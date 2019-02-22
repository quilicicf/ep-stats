const _ = require('lodash');
const deleteFile = require('../../fs/deleteFile');

const ocrFile = require('../../ocr/ocrFile');
const temporaryProcessing = require('../temporaryProcessing');
const createSubImageExtractionScript = require('../createSubImageExtractionScript');

const computeTitanLifeSize = imageSize => ({
  width: imageSize.width / 3,
  height: imageSize.height / 40,
  horizontalOffset: imageSize.width / 3,
  verticalOffset: imageSize.height / 2.12,
});

module.exports = (imagePath, imageName, imageSize) => {
  const titanLifeSize = computeTitanLifeSize(imageSize);

  const imageMagickScript = createSubImageExtractionScript(imageSize, titanLifeSize);
  const tempFilePath = temporaryProcessing(imagePath, imageName, imageMagickScript);

  const lifeLine = ocrFile(tempFilePath);

  deleteFile(tempFilePath);
  return _(lifeLine)
    .split('/')
    .takeRight()
    .map(part => parseInt(part, 10))
    .first();
};
