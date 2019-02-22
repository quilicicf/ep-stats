const _ = require('lodash');
const deleteFile = require('../../fs/deleteFile');

const ocrFile = require('../../ocr/ocrFile');
const temporaryProcessing = require('../temporaryProcessing');
const createSubImageExtractionScript = require('../createSubImageExtractionScript');

const computeEnemyScoreSize = imageSize => ({
  width: imageSize.width / 5.70,
  height: imageSize.height / 48,
  horizontalOffset: imageSize.width / 1.80,
  verticalOffset: imageSize.height / 1.82,
});

module.exports = (imagePath, imageName, imageSize) => {
  const titanLifeSize = computeEnemyScoreSize(imageSize);

  const imageMagickScript = createSubImageExtractionScript(imageSize, titanLifeSize);
  const tempFilePath = temporaryProcessing(imagePath, imageName, imageMagickScript);

  const lifeAsString = ocrFile(tempFilePath);

  deleteFile(tempFilePath);
  return parseInt(lifeAsString, 10);
};
