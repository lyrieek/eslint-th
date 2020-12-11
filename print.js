const chalk = require("chalk")
const table = require("text-table")

module.exports = function(results, config) {
	if (!results) {
		return
	}

	let errorCount = 0
	let warningCount = 0

	results.forEach(result => {
		const messages = result.messages

		if (messages.length === 0) {
			return
		}

		errorCount += result.errorCount
		warningCount += result.warningCount

		console.log(chalk.red.underline(result.filePath))

		console.log(table(
			messages.map(message => [
				chalk.bold.underline((message.line || 0) + "," + (message.column || 0)),
				config.all && chalk.bold(message.severity === 2 ? "\u2716 error" : "\u26A0 warning") || "",
				chalk.blue.italic(message.ruleId || "?"),
				message.message.replace(/([^ ])\.$/u, "$1")
			].filter((e) => e)), {
				align: ["l", "c", "l"],
				hsep: " | "
			}
		))
		console.log('\n');
	})

	const total = errorCount + warningCount
	let warningInfo = '';
	if (config.all) {
		warningInfo = `, ${warningCount} warning`;
	}
	const endtime = process.hrtime(config.start_hrtime);
	console.log(chalk.red.bold(`\u2718 There are ${total} problem (${errorCount} error${warningInfo})`))
	console.log('Run-up time:\u23F0 ' + new Date(config.start_time).toTimeString())
	console.log('Expend time:\u26A1 %ds %sms', endtime[0], (endtime[1] / 1000000).toFixed(2))
	console.log(chalk.green.bold(`\u2728 Eslint-th done.`))

}
