const chalk = require('chalk');

module.exports = {
  RED: {
    name: 'RED',
    red: 196,
    green: 62,
    blue: 49,
    toChalk () { return chalk.rgb(this.red, this.green, this.blue); },
  },
  GREEN: {
    name: 'GREEN',
    red: 66,
    green: 162,
    blue: 44,
    toChalk () { return chalk.rgb(this.red, this.green, this.blue); },
  },
  BLUE: {
    name: 'BLUE',
    red: 56,
    green: 158,
    blue: 230,
    toChalk () { return chalk.rgb(this.red, this.green, this.blue); },
  },
  HOLY: {
    name: 'HOLY',
    red: 243,
    green: 215,
    blue: 71,
    toChalk () { return chalk.rgb(this.red, this.green, this.blue); },
  },
  DARK: {
    name: 'DARK',
    red: 120,
    green: 44,
    blue: 134,
    toChalk () { return chalk.rgb(this.red, this.green, this.blue); },
  },
};
