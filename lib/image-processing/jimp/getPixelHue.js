const Jimp = require('@sindresorhus/jimp');

const toHsv = require('../toHsv');

module.exports = (image, x, y) => {
  const { r: red, g: green, b: blue } = Jimp.intToRGBA(image.getPixelColor(x, y));
  const { hue } = toHsv({ red, green, blue });
  return hue;
};
