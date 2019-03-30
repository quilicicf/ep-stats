const _ = require('lodash');

const findRangeInLine = require('../../jimp/findRangeInLine');
const findRangeInColumn = require('../../jimp/findRangeInColumn');
const getHueColorPredicate = require('../../jimp/getHueColorPredicate');
const getEuclidianColorPredicate = require('../../jimp/getEuclidianColorPredicate');

const EMBLEM_HUE_THRESHOLD = 75;
const HEADER_COLOR_THRESHOLD = 30;
const COLOR_TITAN_HEADER = { red: 14, green: 38, blue: 61 };
const COLOR_TITAN_HEADER_SHADOW = { red: 28, green: 59, blue: 88 };

module.exports = (image, titanColor) => {
  const { zoneStartIndex: headerTop, zoneEndIndex: headerBottom } = findRangeInColumn(
    image,
    Math.round(image.bitmap.width / 2),
    getEuclidianColorPredicate(COLOR_TITAN_HEADER, HEADER_COLOR_THRESHOLD),
    getEuclidianColorPredicate(COLOR_TITAN_HEADER_SHADOW, HEADER_COLOR_THRESHOLD),
    0,
    Math.round(image.height / 3),
  );

  const midHeaderHeight = Math.round((headerTop + headerBottom) / 2);
  const { zoneStartIndex: detectedEmblemLeft, zoneEndIndex: detectedEmblemRight } = findRangeInLine(
    image,
    midHeaderHeight,
    getHueColorPredicate(titanColor.hue, EMBLEM_HUE_THRESHOLD),
    _.negate(getHueColorPredicate(titanColor.hue, EMBLEM_HUE_THRESHOLD)),
    0,
    Math.round(image.width / 3),
  );

  const midEmblemWidth = Math.round((detectedEmblemLeft + detectedEmblemRight) / 2);
  const detectedEmblemWidth = detectedEmblemRight - detectedEmblemLeft;
  const emblemWidth = Math.round(detectedEmblemWidth * 0.6);
  const emblemHalfWidth = Math.round(emblemWidth / 2);

  const emblemTop = midHeaderHeight - emblemHalfWidth;

  return {
    horizontalOffset: midEmblemWidth - emblemHalfWidth,
    verticalOffset: emblemTop,
    width: emblemWidth,
    height: emblemWidth,
  };
};
