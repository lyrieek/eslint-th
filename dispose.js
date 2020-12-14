const import_external = require("./import_external")
const { CLIEngine } = import_external("eslint/lib/cli-engine")
const chalk = require("chalk")
const path = require("path")
const fs = require("fs")

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

module.exports = function(options) {
	let files = options._
	if (options.auto && options.root) {
		if (!files || !files.length) {
			files = [options.root + "/*.js", options.root + "/**/*.js"]
		} else {
			files = [options.root + files[0]]
		}
		if (!options.config) {
			options.config = ".eslintrc"
		}
		try {
			options.config = path.resolve(options.root, options.config)
			if (!fs.existsSync(options.config) || !fs.lstatSync(options.config).isFile()) {
				console.log(require("./options").generateHelp())
				return
			}
		} catch (error) {
			console.error(error)
			return
		}
		if (!options.ignorePath) {
			options.ignorePath = ".eslintignore"
		}
		options.ignorePath = path.resolve(options.root, options.ignorePath)
	} else if (!files || !files.length) {
		files = ["*.js", "**/*.js"]
	}
	if (!options.config) {
		console.log(chalk.green("\u2705Eslint-th ready!"))
		return
	}
	const engine = new CLIEngine(translateOptions(options))
	const report = engine.executeOnFiles(files)
	return options.all ? report.results : CLIEngine.getErrorResults(report.results)
}
