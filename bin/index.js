#!/usr/bin/env node

const dispose = require("../lib/dispose")
const print = require("../lib/print")
const options = require("../lib/options")

const start_hrtime = process.hrtime();
const currentOptions = options.parse(process.argv)

print(dispose(currentOptions), { all: currentOptions.all, start_time: Date.now(), start_hrtime })
