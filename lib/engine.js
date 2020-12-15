const import_external = require("../import_external")
const { Linter } = import_external("eslint/lib/linter")
const { FileEnumerator } = import_external("eslint/lib/cli-engine/file-enumerator")
const fs = require("fs")

function verifyText({
	text,
	filePath,
	config,
	allowInlineConfig,
	linter
}) {
	const { messages } = linter.verifyAndFix(
		text,
		config, {
			allowInlineConfig,
			filename: filePath,
			fix: false
		}
	);

	// Tweak and return.
	const result = {
		filePath,
		messages,
		...calculateStatsPerFile(messages)
	};

	if (result.errorCount + result.warningCount > 0) {
		result.source = text;
	}

	return result;
}

function calculateStatsPerRun(results) {
    return results.reduce((stat, result) => {
        stat.errorCount += result.errorCount;
        stat.warningCount += result.warningCount;
        return stat;
    }, {
        errorCount: 0,
        warningCount: 0
    });
}

function calculateStatsPerFile(messages) {
    return messages.reduce((stat, message) => {
        if (message.severity === 2) {
            stat.errorCount++;
        } else {
            stat.warningCount++;
        }
        return stat;
    }, {
        errorCount: 0,
        warningCount: 0
    });
}

module.exports = function(options, patterns) {
	const fileEnumerator = new FileEnumerator({
		cwd: options.cwd,
		extensions: options.extensions,
		globInputPaths: true,
		errorOnUnmatchedPattern: null,
		ignore: true
	});
	const linter = new Linter({ cwd: options.cwd });
	const results = [];

	for (const { config, filePath } of fileEnumerator.iterateFiles(patterns)) {
		const result = verifyText({
			text: fs.readFileSync(filePath, "utf8"),
			filePath,
			config,
			cwd: options.cwd,
			allowInlineConfig: true,
			linter
		});

		results.push(result);

    }

	return {
		results,
		...calculateStatsPerRun(results)
	}
}
