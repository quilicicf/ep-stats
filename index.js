#!/usr/bin/env node

const yargs = require('yargs');

const runCommand = require('./lib/commands/run');
const initializeCommand = require('./lib/commands/initialize');
const masterCommandName = require('./lib/masterCommandName');

const { EP_STATS_CONFIG_DIR_PATH } = require('./lib/conf/constants');

process.chdir(EP_STATS_CONFIG_DIR_PATH); // Execute in the configuration path so trained data files are put there

/* eslint-disable no-unused-expressions */
// noinspection BadExpressionStatementJS
yargs.usage(`USAGE: ${masterCommandName} <command> [options]`)

  .command(runCommand)
  .command(initializeCommand)

  .help()
  .strict(true)
  .wrap(null)
  .version()
  .argv;
