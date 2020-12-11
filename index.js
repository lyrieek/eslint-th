#!/usr/bin/env node

var dispose = require("./dispose")
var print = require("./print")
var options = require("./options")

var start_hrtime = process.hrtime();
var currentOptions = options.parse(process.argv)

print(dispose(currentOptions), { all: currentOptions.all, start_time: new Date(), start_hrtime })
