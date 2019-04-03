const _ = require('lodash');

const computeHueDistance = require('../../computeHueDistance');

const getPixelHue = require('../../jimp/getPixelHue');

const LIFE_BORDER_HUE = 50;
const BORDER_HUE_THRESHOLD = 10;
const SIDE_BORDER_WIDTH = 10; // Arbitrary width of border to be removed from sides of grabbed zone

const isBorderPixel = hue => computeHueDistance(hue, LIFE_BORDER_HUE) <= BORDER_HUE_THRESHOLD;

const isLifeBarLimit = (imageWidth, rowHues) => {
  const borderPixelsCount = _(rowHues)
    .filter(hue => isBorderPixel(hue))
    .size();
  return borderPixelsCount > (imageWidth / 2);
};

const addTopOrBottom = (lifeBarParameters, rowIndex, rowHues) => {
  if (lifeBarParameters.top) {
    return {
      isInLifeBarLimit: true,
      top: lifeBarParameters.top,
      bottom: rowIndex,
      left: lifeBarParameters.left,
      right: lifeBarParameters.right,
    };
  }

  const areBorderPixels = _.map(rowHues, hue => isBorderPixel(hue));
  return {
    isInLifeBarLimit: true,
    top: rowIndex,
    bottom: undefined,
    left: _.indexOf(areBorderPixels, true),
    right: _.lastIndexOf(areBorderPixels, true),
  };
};

const updateTopOrBottom = (lifeBarParameters, rowIndex) => {
  if (lifeBarParameters.bottom) { return lifeBarParameters; } // Keep first limit row

  return {
    isInLifeBarLimit: true,
    top: rowIndex, // Update top row to keep the last discovered
    bottom: undefined,
    left: lifeBarParameters.left,
    right: lifeBarParameters.right,
  };
};

module.exports = (image) => {
  const { width, height } = image.bitmap;

  const topOfSearchZone = Math.round(height / 3);
  const bottomOfSearchZone = Math.round((2 * height) / 3);

  const lifeBarParameters = _(new Array(bottomOfSearchZone - topOfSearchZone))
    .map((whateva, index) => index + topOfSearchZone)
    .reduce(
      (seed, y) => {
        const rowHues = _(new Array(width))
          .map((dontCare, index) => index)
          .map(x => getPixelHue(image, x, y))
          .value();

        const isCurrentRowLifeBarLimit = isLifeBarLimit(width, rowHues);
        if (isCurrentRowLifeBarLimit && !seed.isInLifeBarLimit) {
          return addTopOrBottom(seed, y, rowHues);
        }

        if (isCurrentRowLifeBarLimit && seed.isInLifeBarLimit) {
          return updateTopOrBottom(seed, y);
        }

        return { ...seed, isInLifeBarLimit: false };
      },
      {
        isInLifeBarLimit: false,
        top: undefined,
        bottom: undefined,
        left: undefined,
        right: undefined,
      },
    );


  const lifeBarTop = lifeBarParameters.top + 1; // Don't take the border in the zone
  const lifeBarBottom = lifeBarParameters.bottom - 1; // Don't take the border in the zone
  const lifeBarLeft = lifeBarParameters.left + SIDE_BORDER_WIDTH; // Don't take the border in the zone
  const lifeBarRight = lifeBarParameters.right - SIDE_BORDER_WIDTH; // Don't take the border in the zone

  const lifeBarWidth = lifeBarRight - lifeBarLeft;
  const lifeBarHeight = lifeBarBottom - lifeBarTop;
  return {
    verticalOffset: lifeBarTop,
    horizontalOffset: lifeBarParameters.left,
    width: lifeBarWidth,
    height: lifeBarHeight,
  };
};
