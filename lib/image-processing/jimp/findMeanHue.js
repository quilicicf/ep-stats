const _ = require('lodash');
const toHsv = require('../toHsv');
const getPixelColor = require('./getPixelColor');

const aggregateLineHues = (image, rowIndex) => (
  _(new Array(image.bitmap.width))
    .map((value, index) => index)
    .reduce(
      (seed, columnIndex) => {
        const pixelColor = getPixelColor(image, columnIndex, rowIndex);
        const { hue } = toHsv(pixelColor);
        return seed + hue;
      },
      0,
    )
);

module.exports = (image) => {
  const { width, height } = image.bitmap;
  const addedHues = _(new Array(height))
    .map((value, index) => index)
    .reduce(
      (seed, rowIndex) => seed + aggregateLineHues(image, rowIndex),
      0,
    );

  return Math.round(addedHues / (width * height));
};
