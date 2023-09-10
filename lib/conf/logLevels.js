const {
  red, yellow, green, blueBright,
} = require('chalk');

module.exports = {
  INFO: {
    name: `[${blueBright('INFO')}]   `,
    colorMessage: (string) => string,
    write (message) { process.stdout.write(message); },
  },
  SUCCESS: {
    name: `[${green('SUCCESS')}]`,
    colorMessage: (string) => string,
    write (message) { process.stdout.write(message); },
  },
  WARNING: {
    name: `[${yellow('WARNING')}]`,
    colorMessage: (string) => yellow(string),
    write (message) { process.stdout.write(message); },
  },
  ERROR: {
    name: `[${red('ERROR')}]  `,
    colorMessage: (string) => red(string),
    write (message) { process.stderr.write(message); },
  },
};
