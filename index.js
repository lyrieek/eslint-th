"use strict"
const dispose = require("./dispose")
const print = require("./print")
const options = require("./options")

process.argv.push("--root")
process.argv.push("E:\\idea/AMS-Client")
process.argv.push("/client/app/**/*.js")
const start_hrtime = process.hrtime();
const currentOptions = options.parse(process.argv)

print(dispose(currentOptions), { all: currentOptions.all, start_time: new Date(), start_hrtime })
