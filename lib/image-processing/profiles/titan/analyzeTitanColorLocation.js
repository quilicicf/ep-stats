const _ = require('lodash');

const findRangeInLine = require('../../jimp/findRangeInLine');
const getHueColorPredicate = require('../../jimp/getHueColorPredicate');

const EMBLEM_HUE_THRESHOLD = 75;
const EMBLEM_REDUCER = 0.6; // We get only 60% of the discovered area to be sure to remove emblem border

module.exports = (image, headerLocation, titanColor) => {
  const midHeaderHeight = headerLocation.verticalOffset + Math.round(headerLocation.height / 2);
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
  const emblemSideLength = Math.round(detectedEmblemWidth * 0.6);
  const emblemHalfSideLength = Math.round(emblemSideLength / 2);

  const emblemTop = midHeaderHeight - emblemHalfSideLength;

  return {
    horizontalOffset: midEmblemWidth - emblemHalfSideLength,
    verticalOffset: emblemTop,
    width: emblemSideLength,
    height: emblemSideLength,
    reducer: EMBLEM_REDUCER,
  };
};
