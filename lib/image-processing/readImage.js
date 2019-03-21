const Jimp = require('@sindresorhus/jimp');
const readFileBuffer = require('../fs/readFileBuffer');

module.exports = async (imagePath) => {
  const imageBuffer = await readFileBuffer(imagePath);
  return Jimp.read(imageBuffer);
};
