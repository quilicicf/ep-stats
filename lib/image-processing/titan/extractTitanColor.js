const deleteFile = require('../../fs/deleteFile');

const findMeanColor = require('../findMeanColor');
const deduceTitanColor = require('../../ep/deduceTitanColor');
const temporaryProcessing = require('../temporaryProcessing');
const createSubImageExtractionScript = require('../createSubImageExtractionScript');

const computeTitanNameSize = imageSize => ({
  width: imageSize.width / 30,
  height: imageSize.height / 40,
  horizontalOffset: imageSize.width / 3.93,
  verticalOffset: imageSize.height / 9.3,
});

module.exports = (imagePath, imageName, imageSize) => {
  const titanColorSize = computeTitanNameSize(imageSize);

  const imageMagickScript = createSubImageExtractionScript(imageSize, titanColorSize);
  const tempFilePath = temporaryProcessing(imagePath, imageName, imageMagickScript);

  const meanColor = findMeanColor(tempFilePath);
  const titanColor = deduceTitanColor(meanColor);

  deleteFile(tempFilePath);
  return titanColor.name;
};
