const computeColorDistance = require('../computeColorDistance');

module.exports = (expectedColor, threshold = 0) => (
  actualColor => computeColorDistance(expectedColor, actualColor) <= threshold
);
