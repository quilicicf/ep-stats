const _ = require('lodash');

const { SCREENSHOTS_SIZE } = require('../cli/config/appConfig');

const deleteFile = require('../fs/deleteFile');

const ocrFile = require('../ocr/ocrFile');

const availableProfiles = require('./profiles/availableProfiles');
const temporaryProcessing = require('./temporaryProcessing');
const createSubImageBlackAndWhiteExtractionScript = require('./imagemagick/createSubImageBlackAndWhiteExtractionScript');

module.exports = ({ screenshot, appConfig }) => {
  const { imagePath, imageName } = screenshot;
  const screenshotSizeProfileName = appConfig[ SCREENSHOTS_SIZE.key ];
  const screenshotSizeProfile = availableProfiles[ screenshotSizeProfileName ];
  const headerSize = screenshotSizeProfile.global.header;

  const imageMagickScript = createSubImageBlackAndWhiteExtractionScript(headerSize);
  const tempFilePath = temporaryProcessing(imagePath, imageName, imageMagickScript);

  const header = _.trim(ocrFile(tempFilePath));
  deleteFile(tempFilePath);
  return header;
};
