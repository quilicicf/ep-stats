const { red, yellow, green } = require('chalk');

module.exports = {
  INFO: {
    name: 'INFO',
    write (message) { process.stdout.write(message); },
  },
  SUCCESS: {
    name: 'SUCCESS',
    write (message) { process.stdout.write(green(message)); },
  },
  WARNING: {
    name: 'WARNING',
    write (message) { process.stdout.write(yellow(message)); },
  },
  ERROR: {
    name: 'ERROR',
    write (message) { process.stderr.write(red(message)); },
  },
};
