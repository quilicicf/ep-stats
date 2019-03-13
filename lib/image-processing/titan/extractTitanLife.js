const _ = require('lodash');
const chalk = require('chalk');

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

const NO_TITAN_LIFE_MESSAGE = `
The titan life could not be retrieved.
This often happens when the screenshot was taken after it was defeated.
Its life will be set to the amount of damage it took. 
Please correct this in the GSheet if the assumption is wrong.

`;

module.exports = async (imagePath, imageName, imageSize) => {
  const titanLifeSize = computeTitanLifeSize(imageSize);

  const imageMagickScript = createSubImageBlackAndWhiteExtractionScript(imageSize, titanLifeSize);
  const tempFilePath = temporaryProcessing(imagePath, imageName, imageMagickScript);

  const lifeLine = ocrFile(tempFilePath);
  const titanLife = _(lifeLine)
    .split('/')
    .takeRight()
    .map(part => parseInt(part, 10) || 0)
    .first();

  const imageRgb = await showImage(tempFilePath, 80);
  process.stdout.write(`Titan life ${titanLife} deduced from:\n${imageRgb}\n`);

  if (titanLife === 0) {
    process.stderr.write(chalk.yellow(NO_TITAN_LIFE_MESSAGE));
  }

  deleteFile(tempFilePath);
  return titanLife;
};
