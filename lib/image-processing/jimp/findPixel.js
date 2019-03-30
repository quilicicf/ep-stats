const _ = require('lodash');

const getPixelColor = require('./getPixelColor');

const findInRow = (image, predicate, rowIndex) => _(new Array(image.bitmap.width))
  .map((whateva, index) => index)
  .map(columnIndex => ({
    columnIndex,
    rowIndex,
    color: {
      ...getPixelColor(image, columnIndex, rowIndex),
    },
  }))
  .find(pixelPosition => predicate(pixelPosition.color));

module.exports = (image, predicate) => _(new Array(image.bitmap.height))
  .map((whateva, index) => index)
  .map(rowIndex => findInRow(image, predicate, rowIndex))
  .find(pixelPosition => !!pixelPosition);
