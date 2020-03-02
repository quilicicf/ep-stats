const showImage = require('../jimp/showImage');
const { SCREENSHOTS_SIZE } = require('../../cli/config/appConfig');

const { WAR } = require('../../ep/activityTypes');

const deleteFile = require('../../fs/deleteFile');

const deduceWarBonus = require('./deduceWarBonus');
const availableProfiles = require('../profiles/availableProfiles');

const readImage = require('../../image-processing/jimp/readImage');
const cropImage = require('../../image-processing/jimp/cropImage');
const writeImage = require('../../image-processing/jimp/writeImage');

module.exports = async (imagePath, imageName, appConfig) => {
  const screenshotSizeProfileName = appConfig[ SCREENSHOTS_SIZE.key ];
  const screenshotSizeProfile = availableProfiles[ screenshotSizeProfileName ];
  const warBonusSize = screenshotSizeProfile[ WAR ].bonus;

  const tempFilePath = await readImage(imagePath)
    .then(jimpImage => cropImage(jimpImage, warBonusSize))
    .then(finalImage => writeImage(finalImage, imageName));

  const warBonus = await deduceWarBonus(tempFilePath);

  const imageRgb = await showImage(tempFilePath, 10);
  process.stdout.write(`War bonus ${warBonus} deduced from:\n${imageRgb}\n`);

  deleteFile(tempFilePath);

  return warBonus;
};
