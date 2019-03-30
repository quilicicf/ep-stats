const _ = require('lodash');

const getPixelColor = require('./getPixelColor');

module.exports = (
  image, rowIndex,
  zoneStartPredicate, zoneEndPredicate,
  startOffset = undefined, endOffset = undefined,
) => {

  const startIndex = startOffset || 0;
  const endIndex = endOffset || image.bitmap.width;
  return _(new Array(endIndex - startIndex))
    .map((whateva, index) => index + startIndex)
    .reduce(
      (seed, columnIndex) => {
        const pixelColor = getPixelColor(image, columnIndex, rowIndex);

        if (!seed.zoneStartIndex && zoneStartPredicate(pixelColor)) {
          return { ...seed, zoneStartIndex: columnIndex };
        }

        if (seed.zoneStartIndex && !seed.zoneEndIndex && zoneEndPredicate(pixelColor)) {
          return { ...seed, zoneEndIndex: columnIndex };
        }

        return seed;
      },
      { zoneStartIndex: undefined, zoneEndIndex: undefined },
    );
};
