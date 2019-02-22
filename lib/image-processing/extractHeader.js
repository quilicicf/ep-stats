const _ = require('lodash');

const deleteFile = require('../fs/deleteFile');
const ocrFile = require('../ocr/ocrFile');
const createSubImageExtractionScript = require('./createSubImageExtractionScript');
const temporaryProcessing = require('./temporaryProcessing');

const computeHeaderSize = imageSize => ({
  width: imageSize.width / 3,
  height: imageSize.height / 19,
  horizontalOffset: imageSize.width / 3,
  verticalOffset: 0,
});

module.exports = (imagePath, imageName, imageSize) => {
  const headerSize = computeHeaderSize(imageSize);

  const imageMagickScript = createSubImageExtractionScript(imageSize, headerSize);
  const tempFilePath = temporaryProcessing(imagePath, imageName, imageMagickScript);

  const header = _.trim(ocrFile(tempFilePath));
  deleteFile(tempFilePath);
  return header;
};
