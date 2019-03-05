const showImage = require('../../cli/showImage');
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

module.exports = async (imagePath, imageName, imageSize) => {
  const titanColorSize = computeTitanNameSize(imageSize);

  const imageMagickScript = createSubImageExtractionScript(imageSize, titanColorSize);
  const tempFilePath = temporaryProcessing(imagePath, imageName, imageMagickScript);

  const meanColor = findMeanColor(tempFilePath);
  const titanColor = deduceTitanColor(meanColor);

  const imageRgb = await showImage(tempFilePath, 5);
  process.stdout.write(`Titan color ${titanColor.name} deduced from:\n${imageRgb}\n`);

  deleteFile(tempFilePath);
  return titanColor.name;
};
