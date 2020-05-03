#!/usr/bin/env node

const yargs = require('yargs');

const runCommand = require('./lib/commands/run');
const masterCommandName = require('./lib/masterCommandName');

/* eslint-disable no-unused-expressions */
// noinspection BadExpressionStatementJS
yargs.usage(`USAGE: ${masterCommandName} <command> [options]`)

  .command(runCommand)

  .help()
  .wrap(null)
  .version()
  .argv;
