const Jimp = require('jimp');
const readFileBuffer = require('../../fs/readFileBuffer');

module.exports = async (imagePath) => {
  const imageBuffer = await readFileBuffer(imagePath);
  const image = await Jimp.read(imageBuffer);
  return { image, bitmap: image.bitmap };
};
