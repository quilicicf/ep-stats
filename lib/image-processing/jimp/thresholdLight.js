const _ = require('lodash');
const Jimp = require('jimp');
const colorConvert = require('color-convert');

const BLACK_HEX = Jimp.cssColorToHex('black');
const WHITE_HEX = Jimp.cssColorToHex('white');

module.exports = async ({ image, bitmap }, { thresholdLevel = 90, shouldInvert = false }) => {
  for (let y = 0; y < bitmap.height; y++) {
    for (let x = 0; x < bitmap.width; x++) {
      const { r, g, b } = Jimp.intToRGBA(image.getPixelColor(x, y));
      const [ light ] = colorConvert.rgb.hsl(r, g, b).splice(2);
      const inverter = shouldInvert ? (condition) => !condition : _.identity;
      const newColor = inverter(light < thresholdLevel) ? BLACK_HEX : WHITE_HEX;
      image.setPixelColor(newColor, x, y);
    }
  }

  return { image, bitmap };
};
