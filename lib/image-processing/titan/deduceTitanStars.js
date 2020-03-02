const _ = require('lodash');
const Jimp = require('jimp');
const readImage = require('../jimp/readImage');

module.exports = async (imagePath) => {
  const { image, bitmap } = await readImage(imagePath);

  const starsFinder = _(new Array(bitmap.width))
    .map((whateva, index) => index)
    .reduce(
      (seed, x) => {
        const { r, g, b } = Jimp.intToRGBA(image.getPixelColor(x, 1));

        const isInStar = (r + g + b) === 0;
        const starsNumber = !seed.isInStar && isInStar
          ? seed.starsNumber + 1
          : seed.starsNumber;

        return { starsNumber, isInStar };
      },
      { starsNumber: 0, isInStar: false },
    );

  return starsFinder.starsNumber;
};
