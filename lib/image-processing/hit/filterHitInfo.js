const _ = require('lodash');

const { REGEX_PREFIX } = require('./lineRegexes');

module.exports = (ocrResult) => (
  _(ocrResult)
    .split('\n')
    .filter((line) => REGEX_PREFIX.test(line))
    .map((line) => line.trim())
    .value()
);
