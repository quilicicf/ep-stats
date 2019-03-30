const Jimp = require('@sindresorhus/jimp');

module.exports = (image, rowIndex, columnIndex) => {
  const { r: red, g: green, b: blue } = Jimp.intToRGBA(image.getPixelColor(rowIndex, columnIndex));
  return { red, green, blue };
};
