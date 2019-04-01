const Jimp = require('@sindresorhus/jimp');

const toHsv = require('../toHsv');

module.exports = (image, rowIndex, columnIndex) => {
  const { r: red, g: green, b: blue } = Jimp.intToRGBA(image.getPixelColor(rowIndex, columnIndex));
  return toHsv({ red, green, blue });
};
