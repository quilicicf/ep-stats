const _ = require('lodash');

const deleteFile = require('../fs/deleteFile');

const recognize = require('../ocr/recognizeJs');

const readImage = require('./jimp/readImage');
const cropImage = require('./jimp/crop');
const writeImage = require('./jimp/writeImage');
const thresholdImage = require('./jimp/thresholdLight');

module.exports = async (imagePath, imageName, screenshotProfile) => {
  const headerSize = screenshotProfile.global.header;

  const tempFilePath = await readImage(imagePath)
    .then((jimpImage) => cropImage(jimpImage, headerSize))
    .then((cropped) => thresholdImage(cropped, { thresholdLevel: 80, shouldInvert: true }))
    .then((finalImage) => writeImage(finalImage, `${imageName}_header`));

  const untrimmedHeader = await recognize(tempFilePath);
  const header = _.trim(untrimmedHeader);
  deleteFile(tempFilePath);
  return header;
};
