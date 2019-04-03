const findRangeInLine = require('../../jimp/findRangeInLine');
const findRangeInColumn = require('../../jimp/findRangeInColumn');
const getEuclidianColorPredicate = require('../../jimp/getEuclidianColorPredicate');

const HEADER_COLOR_THRESHOLD = 15;
const COLOR_TITAN_HEADER = { red: 14, green: 38, blue: 61 };
const COLOR_TITAN_HEADER_BOTTOM_SHADOW = { red: 28, green: 59, blue: 88 };
const COLOR_TITAN_HEADER_RIGHT_SHADOW = { red: 22, green: 50, blue: 77 };

module.exports = (image) => {
  const { width, height } = image.bitmap;

  const { zoneStartIndex: headerTop, zoneEndIndex: headerBottom } = findRangeInColumn(
    image,
    Math.round(width / 2),
    getEuclidianColorPredicate(COLOR_TITAN_HEADER, HEADER_COLOR_THRESHOLD),
    getEuclidianColorPredicate(COLOR_TITAN_HEADER_BOTTOM_SHADOW, HEADER_COLOR_THRESHOLD),
    0,
    Math.round(height / 3),
  );

  const widthTenth = Math.round(width / 10);
  const headerMidHeight = Math.round((headerBottom + headerTop) / 2);
  const { zoneStartIndex: headerLeft, zoneEndIndex: headerRight } = findRangeInLine(
    image,
    headerMidHeight,
    getEuclidianColorPredicate(COLOR_TITAN_HEADER, HEADER_COLOR_THRESHOLD),
    getEuclidianColorPredicate(COLOR_TITAN_HEADER_RIGHT_SHADOW, HEADER_COLOR_THRESHOLD),
    widthTenth,
    width - widthTenth,
  );

  return {
    verticalOffset: headerTop,
    horizontalOffset: headerLeft,
    width: headerRight - headerLeft,
    height: headerBottom - headerTop,
  };
};

