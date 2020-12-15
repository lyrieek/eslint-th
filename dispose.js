const import_external = require("./import_external")
const { CLIEngine } = import_external("eslint/lib/cli-engine")
const chalk = require("chalk")
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
	let rootPath = process.cwd();
	if (options.auto && options.root) {
		rootPath = options.root;
		options.ignorePath = checkFileExists(rootPath, options.ignorePath, ".eslintignore")
		if (!files || !files.length) {
			files = [options.root + "/*.js", options.root + "/**/*.js"]
		} else {
			files = [options.root + files[0]]
		}
	} else if (!files || !files.length) {
		files = ["*.js", "**/*.js"]
	}
	options.config = checkFileExists(rootPath, options.config, ".eslintrc")
	if (!options.config) {
		// console.log(chalk.green("\u2705 Eslint-th ready!"))
		console.log(require("./options").generateHelp())
		return
	}
	const engine = new CLIEngine(translateOptions(options))
	const report = engine.executeOnFiles(files)
	return options.all ? report.results : CLIEngine.getErrorResults(report.results)
}
