const _ = require('lodash');

const computeHueDistance = require('../../computeHueDistance');

const getPixelHue = require('../../jimp/getPixelHue');

const STARS_HUE = 60;
const STARS_MIN_WIDTH = 3;
const STARS_HUE_THRESHOLD = 10;

const isStarsLine = (image, rowIndex, rightOfEmblem, starLineWidth) => (
  _(new Array(starLineWidth))
    .map((whateva, index) => index + rightOfEmblem)
    .reduce(
      (seed, columnIndex) => {
        const hue = getPixelHue(image, columnIndex, rowIndex);
        const hueDistance = computeHueDistance(hue, STARS_HUE);
        const isInStar = hueDistance <= STARS_HUE_THRESHOLD;

        if (!isInStar && !seed.isInStar) { // Still not in star
          return seed;
        }

        if (!isInStar && seed.isInStar) { // Leaving star
          const hasFoundStar = seed.currentStarWidth > STARS_MIN_WIDTH;
          return {
            starsFound: hasFoundStar ? seed.starsFound + 1 : seed.starsFound,
            isInStar: false,
            currentStarWidth: undefined,
          };
        }

        if (isInStar && !seed.isInStar) { // Entering star
          return {
            starsFound: seed.starsFound,
            isInStar: true,
            currentStarWidth: 1,
          };
        }

        return { // Still in star
          starsFound: seed.starsFound,
          isInStar: true,
          currentStarWidth: seed.currentStarWidth + 1,
        };
      },
      { starsFound: 0, isInStar: false, currentStarWidth: undefined },
    )
);

module.exports = (image, colorLocation) => {
  const midEmblemHeight = colorLocation.verticalOffset + Math.round(colorLocation.height / 2);
  const emblemBottom = colorLocation.verticalOffset + colorLocation.height;
  const rightOfEmblem = colorLocation.horizontalOffset + Math.round(colorLocation.width / colorLocation.reducer);

  const starLineWidth = image.bitmap.width - rightOfEmblem;
  const starLineTop = _(new Array(emblemBottom - midEmblemHeight))
    .map((whateva, index) => index + midEmblemHeight)
    .find(rowIndex => isStarsLine(image, rowIndex, rightOfEmblem, starLineWidth));

  return {
    verticalOffset: starLineTop,
    horizontalOffset: rightOfEmblem,
    width: starLineWidth,
    height: Math.round(starLineWidth / 50),
  };
};
