const _ = require('lodash');
const chalk = require('chalk');

const showImage = require('../../cli/showImage');
const { SCREENSHOTS_SIZE } = require('../../cli/config/appConfig');

const { TITAN } = require('../../ep/activityTypes');

const deleteFile = require('../../fs/deleteFile');

const ocrFile = require('../../ocr/ocrFile');

const availableProfiles = require('../profiles/availableProfiles');
const temporaryProcessing = require('../temporaryProcessing');
const createSubImageBlackAndWhiteExtractionScript = require('../imagemagick/createSubImageBlackAndWhiteExtractionScript');

const NO_TITAN_LIFE_MESSAGE = `
The titan life could not be retrieved.
This often happens when the screenshot was taken after it was defeated.
Its life will be set to the amount of damage it took. 
Please correct this in the GSheet if the assumption is wrong.

`;

module.exports = async (imagePath, imageName, appConfig) => {
  const screenshotSizeProfileName = appConfig[ SCREENSHOTS_SIZE.key ];
  const screenshotSizeProfile = availableProfiles[ screenshotSizeProfileName ];
  const titanLifeSize = screenshotSizeProfile[ TITAN ].life;

  const imageMagickScript = createSubImageBlackAndWhiteExtractionScript(titanLifeSize);
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
