const _ = require('lodash');

const getPixelColor = require('./getPixelColor');
const computeColorDistance = require('../computeColorDistance');

const Jimp = require('@sindresorhus/jimp');

module.exports = (
  image, columnIndex,
  zoneStartPredicate, zoneEndPredicate,
  startOffset = undefined, endOffset = undefined,
) => {

  const startIndex = startOffset || 0;
  const endIndex = endOffset || image.bitmap.height;
  return _(new Array(endIndex - startIndex))
    .map((whateva, index) => index + startIndex)
    .reduce(
      (seed, rowIndex) => {
        const pixelColor = getPixelColor(image, columnIndex, rowIndex);
        if (!seed.zoneStartIndex && zoneStartPredicate(pixelColor)) {
          return { ...seed, zoneStartIndex: rowIndex };
        }

        if (seed.zoneStartIndex && !seed.zoneEndIndex && zoneEndPredicate(pixelColor)) {
          return { ...seed, zoneEndIndex: rowIndex };
        }

        return seed;
      },
      { zoneStartIndex: undefined, zoneEndIndex: undefined },
    );
};
