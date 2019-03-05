const _ = require('lodash');
const showImage = require('../../cli/showImage');
const deleteFile = require('../../fs/deleteFile');

const ocrFile = require('../../ocr/ocrFile');
const temporaryProcessing = require('../temporaryProcessing');
const createSubImageBlackAndWhiteExtractionScript = require('../createSubImageBlackAndWhiteExtractionScript');

const computeTitanLifeSize = imageSize => ({
  width: imageSize.width / 3,
  height: imageSize.height / 40,
  horizontalOffset: imageSize.width / 3,
  verticalOffset: imageSize.height / 2.12,
});

module.exports = async (imagePath, imageName, imageSize) => {
  const titanLifeSize = computeTitanLifeSize(imageSize);

  const imageMagickScript = createSubImageBlackAndWhiteExtractionScript(imageSize, titanLifeSize);
  const tempFilePath = temporaryProcessing(imagePath, imageName, imageMagickScript);

  const lifeLine = ocrFile(tempFilePath);
  const titanLife = _(lifeLine)
    .split('/')
    .takeRight()
    .map(part => parseInt(part, 10))
    .first();

  const imageRgb = await showImage(tempFilePath, 40);
  process.stdout.write(`Titan life ${titanLife} deduced from:\n${imageRgb}\n`);

  deleteFile(tempFilePath);
  return titanLife;
};
