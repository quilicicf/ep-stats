const _ = require('lodash');

const PARSEABLE_LINE_REGEX = /^[[(][0-9]+[\])]/;

module.exports = ocrResult => (
  _(ocrResult)
    .split('\n')
    .filter(line => PARSEABLE_LINE_REGEX.test(line))
    .map(line => line.trim())
    .value()
);
