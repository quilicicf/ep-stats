#!/usr/bin/env node

const run = require('./lib/run');

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

const main = async () => {
  run();
  setInterval(() => {
    run();
  }, ONE_DAY_IN_MS);
};

main();
