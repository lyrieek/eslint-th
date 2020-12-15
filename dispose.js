const engine = require("./lib/engine")
const path = require("path")
const fs = require("fs")
const _options = require("./options")

function translateOptions(cliOptions) {
	return {
		envs: cliOptions.env,
		extensions: cliOptions.ext,
		rules: cliOptions.rule,
		plugins: cliOptions.plugin,
		globals: cliOptions.global,
		ignore: cliOptions.ignore,
		ignorePath: cliOptions.ignorePath,
		ignorePattern: cliOptions.ignorePattern,
		configFile: cliOptions.config,
		rulePaths: cliOptions.rulesdir,
		useEslintrc: cliOptions.eslintrc,
		parser: cliOptions.parser,
		parserOptions: cliOptions.parserOptions,
		cache: cliOptions.cache,
		cacheFile: cliOptions.cacheFile,
		cacheLocation: cliOptions.cacheLocation,
		allowInlineConfig: cliOptions.inlineConfig,
		reportUnusedDisableDirectives: cliOptions.reportUnusedDisableDirectives
	}
}

function checkFileExists(dir, fileName, defaultFileName) {
	try {
		if (!fileName && defaultFileName) {
			fileName = defaultFileName
		}
		if (fileName) {
			fileName = path.resolve(dir, fileName)
		} else {
			fileName = dir
		}
		if (fs.existsSync(fileName) && fs.lstatSync(fileName).isFile()) {
			return fileName
		}
	} catch (error) {
		console.error(error)
		return
	}
}

module.exports = function(options) {
	let files = options._
	if (options.help) {
		console.log(_options.generateHelp())
		return
	}
	if (!options.cwd) {
		options.cwd = process.cwd();
	}
	if (options.auto && options.root) {
		options.cwd = options.root;
		options.ignorePath = checkFileExists(options.cwd, options.ignorePath, ".eslintignore")
		if (!files || !files.length) {
			files = [options.root + "/*.js", options.root + "/**/*.js"]
		} else {
			files = [options.root + files[0]]
		}
	} else if (!files || !files.length) {
		files = ["*.js", "**/*.js"]
	}
	options.config = checkFileExists(options.cwd, options.config, ".eslintrc")
	if (!options.config) {
		// console.log(chalk.green("\u2705 Eslint-th ready!"))
		console.log(require("./options").generateHelp())
		return
	}
	const results = engine(translateOptions(options), files).results;
	if (!options.all) {
		const filtered = []
		results.forEach(result => {
			const filteredMessages = result.messages.filter((message) => message.severity === 2)
			if (filteredMessages.length > 0) {
				filtered.push({
					...result,
					messages: filteredMessages,
					errorCount: filteredMessages.length,
					warningCount: 0
				})
			}
		})
		return filtered
	}
	return results
}
