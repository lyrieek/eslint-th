const resolve = require("resolve").sync

const NODE_PATH = process.env.NODE_PATH || resolve("\\Roaming\\npm\\node_modules", {
	basedir: process.env.LOCALAPPDATA
})

module.exports = function(path) {
	return require(resolve(path, {
		basedir: NODE_PATH
	}))
}
