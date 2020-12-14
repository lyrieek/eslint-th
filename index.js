#!/usr/bin/env node

const dispose = require("./dispose")
const print = require("./print")
const options = require("./options")

const start_hrtime = process.hrtime();
const currentOptions = options.parse(process.argv)

print(dispose(currentOptions), { all: currentOptions.all, start_time: new Date(), start_hrtime })
