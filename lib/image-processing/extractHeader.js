const _ = require('lodash');

const { SCREENSHOTS_SIZE } = require('../cli/config/appConfig');

const deleteFile = require('../fs/deleteFile');

const recognize = require('../ocr/recognizeJs');

const readImage = require('../image-processing/jimp/readImage');
const cropImage = require('../image-processing/jimp/cropImage');
const writeImage = require('../image-processing/jimp/writeImage');
const thresholdImage = require('../image-processing/jimp/thresholdImage');

const availableProfiles = require('./profiles/availableProfiles');

module.exports = async ({ screenshot, appConfig }) => {
  const { imagePath, imageName } = screenshot;
  const screenshotSizeProfileName = appConfig[ SCREENSHOTS_SIZE.key ];
  const screenshotSizeProfile = availableProfiles[ screenshotSizeProfileName ];
  const headerSize = screenshotSizeProfile.global.header;

  const tempFilePath = await readImage(imagePath)
    .then(jimpImage => cropImage(jimpImage, headerSize))
    .then(cropped => thresholdImage(cropped, { thresholdLevel: 80, shouldInvert: true }))
    .then(finalImage => writeImage(finalImage, imageName));

  const untrimmedHeader = await recognize(tempFilePath);
  const header = _.trim(untrimmedHeader);
  deleteFile(tempFilePath);
  return header;
};
