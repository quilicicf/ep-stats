const _ = require('lodash');
const Jimp = require('jimp');

const readImage = require('./readImage');
const toPercentage = require('../../toPercentage');
const computeColorDistance = require('../../computeColorDistance');

const diffPixel = (referenceImage, otherImage, columnIndex, lineIndex) => {
  const {
    r: redRef, g: greenRef, b: blueRef,
  } = Jimp.intToRGBA(referenceImage.getPixelColor(columnIndex, lineIndex + 1));
  const {
    r: redOther, g: greenOther, b: blueOther,
  } = Jimp.intToRGBA(otherImage.getPixelColor(columnIndex, lineIndex + 1));

  const pixelDiff = computeColorDistance(
    { red: redRef, green: greenRef, blue: blueRef },
    { red: redOther, green: greenOther, blue: blueOther },
  );

  const unweightedDiff = pixelDiff / 255;

  return unweightedDiff / 3;
};

const diffLine = (referenceImage, otherImage, lineIndex) => {
  const { height: referenceHeight } = referenceImage.bitmap;
  const unweightedDiff = _(new Array(referenceHeight))
    .map((value, index) => index)
    .reduce(
      (seed, columnIndex) => {
        const bgPixelDiff = diffPixel(referenceImage, otherImage, columnIndex, lineIndex);
        const fgPixelDiff = diffPixel(referenceImage, otherImage, columnIndex, lineIndex + 1);

        return seed + bgPixelDiff + fgPixelDiff;
      },
      0,
    );
  return unweightedDiff / referenceHeight;
};

module.exports = async (referenceImagePath, otherImagePath) => {
  const { image: referenceImage } = await readImage(referenceImagePath);
  const { image: otherImage } = await readImage(otherImagePath);

  const { width: referenceWidth, height: referenceHeight } = referenceImage.bitmap;
  const resizedOtherImage = otherImage.resize(referenceWidth, referenceHeight);

  const unweightedDiff = _(new Array(referenceWidth))
    .map((value, index) => index * 2)
    .reduce((seed, lineIndex) => seed + diffLine(referenceImage, resizedOtherImage, lineIndex), 0);

  return toPercentage(unweightedDiff / referenceWidth);
};
