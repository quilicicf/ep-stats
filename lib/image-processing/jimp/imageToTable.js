const _ = require('lodash');

const getPixelColor = require('./getPixelColor');

const rowToArray = (image, rowIndex) => _(new Array(image.bitmap.width))
  .map((whateva, index) => index)
  .reduce(
    (seed, columnIndex) => [ ...seed, getPixelColor(image, columnIndex, rowIndex) ],
    [],
  );

module.exports = image => _(new Array(image.bitmap.height))
  .map((whateva, index) => index)
  .reduce(
    (seed, rowIndex) => [ ...seed, rowToArray(image, rowIndex) ],
    [],
  );
