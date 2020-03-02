const _ = require('lodash');
const chalk = require('chalk');

const showImage = require('../jimp/showImage');
const { SCREENSHOTS_SIZE } = require('../../cli/config/appConfig');

const { TITAN } = require('../../ep/activityTypes');

const deleteFile = require('../../fs/deleteFile');

const recognize = require('../../ocr/recognizeJs');

const readImage = require('../../image-processing/jimp/readImage');
const cropImage = require('../../image-processing/jimp/cropImage');
const writeImage = require('../../image-processing/jimp/writeImage');
const thresholdImage = require('../../image-processing/jimp/thresholdImage');

const availableProfiles = require('../profiles/availableProfiles');

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

  const tempFilePath = await readImage(imagePath)
    .then(jimpImage => cropImage(jimpImage, titanLifeSize))
    .then(cropped => thresholdImage(cropped, { thresholdLevel: 80, shouldInvert: true }))
    .then(finalImage => writeImage(finalImage, imageName));

  const lifeLine = await recognize(tempFilePath);
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
