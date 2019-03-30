const toHsv = require('../image-processing/toHsv');
const toChalkWriter = require('../image-processing/toChalkWriter');

const RED = {
  name: 'RED',
  red: 196,
  green: 62,
  blue: 49,
};

const GREEN = {
  name: 'GREEN',
  red: 66,
  green: 162,
  blue: 44,
};

const BLUE = {
  name: 'BLUE',
  red: 56,
  green: 158,
  blue: 230,
};

const HOLY = {
  name: 'HOLY',
  red: 243,
  green: 215,
  blue: 71,
};

const DARK = {
  name: 'DARK',
  red: 120,
  green: 44,
  blue: 134,
};

module.exports = {
  RED: {
    ...RED,
    ...toHsv(RED),
    chalkWriter: toChalkWriter(RED),
  },
  GREEN: {
    ...GREEN,
    ...toHsv(GREEN),
    chalkWriter: toChalkWriter(GREEN),
  },
  BLUE: {
    ...BLUE,
    ...toHsv(BLUE),
    chalkWriter: toChalkWriter(BLUE),
  },
  HOLY: {
    ...HOLY,
    ...toHsv(HOLY),
    chalkWriter: toChalkWriter(HOLY),
  },
  DARK: {
    ...DARK,
    ...toHsv(DARK),
    chalkWriter: toChalkWriter(DARK),
  },
};
