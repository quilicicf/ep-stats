const Jimp = require('jimp');
const colorConvert = require('color-convert');

const BLACK_HEX = Jimp.cssColorToHex('black');
const WHITE_HEX = Jimp.cssColorToHex('white');

module.exports = async ({ image, bitmap }, { threshold = 10, targetHue }) => {
  for (let y = 0; y < bitmap.height; y++) {
    for (let x = 0; x < bitmap.width; x++) {
      const { r, g, b } = Jimp.intToRGBA(image.getPixelColor(x, y));
      const [ hue ] = colorConvert.rgb.hsl(r, g, b).splice(2);
      const hueDiff = targetHue - hue;
      const smallHueDiff = ((hueDiff + 180) % 360) - 180; // Smallest angle, 350° === -10°
      const newColor = Math.abs(smallHueDiff) <= threshold ? BLACK_HEX : WHITE_HEX;
      image.setPixelColor(newColor, x, y);
    }
  }

  return { image, bitmap };
};
