const Jimp = require('jimp');

const readImage = require('./readImage');

module.exports = async (imagePath) => {
  const { image, bitmap } = await readImage(imagePath);
  let redValue = 0;
  let greenValue = 0;
  let blueValue = 0;

  for (let y = 0; y < bitmap.height; y++) {
    for (let x = 0; x < bitmap.width; x++) {
      const { r, g, b } = Jimp.intToRGBA(image.getPixelColor(x, y));
      redValue += r;
      greenValue += g;
      blueValue += b;
    }
  }

  const pixelsNumber = bitmap.height * bitmap.width;
  return {
    red: Math.round(redValue / pixelsNumber),
    green: Math.round(greenValue / pixelsNumber),
    blue: Math.round(blueValue / pixelsNumber),
  };
};
