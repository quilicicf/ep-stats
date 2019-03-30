const toHsv = require('../toHsv');
const computeHueDistance = require('../computeHueDistance');

module.exports = (expectedHue, threshold = 0) => (
  actualColor => computeHueDistance(expectedHue, toHsv(actualColor).hue) <= threshold
);
