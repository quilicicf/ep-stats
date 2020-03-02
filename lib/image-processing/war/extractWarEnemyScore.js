const showImage = require('../jimp/showImage');
const { SCREENSHOTS_SIZE } = require('../../cli/config/appConfig');

const { WAR } = require('../../ep/activityTypes');

const deleteFile = require('../../fs/deleteFile');

const recognize = require('../../ocr/recognizeJs');

const availableProfiles = require('../profiles/availableProfiles');

const readImage = require('../../image-processing/jimp/readImage');
const cropImage = require('../../image-processing/jimp/cropImage');
const writeImage = require('../../image-processing/jimp/writeImage');
const thresholdImage = require('../../image-processing/jimp/thresholdImage');

module.exports = async (imagePath, imageName, appConfig) => {
  const screenshotSizeProfileName = appConfig[ SCREENSHOTS_SIZE.key ];
  const screenshotSizeProfile = availableProfiles[ screenshotSizeProfileName ];
  const warEnemyScore = screenshotSizeProfile[ WAR ].enemyScore;

  const tempFilePath = await readImage(imagePath)
    .then(jimpImage => cropImage(jimpImage, warEnemyScore))
    .then(cropped => thresholdImage(cropped, { thresholdLevel: 80, shouldInvert: true }))
    .then(finalImage => writeImage(finalImage, imageName));

  const enemyScoreAsString = await recognize(tempFilePath);
  const enemyScore = parseInt(enemyScoreAsString, 10);

  const imageRgb = await showImage(tempFilePath, 40);
  process.stdout.write(`Enemy score ${enemyScore} deduced from:\n${imageRgb}\n`);

  deleteFile(tempFilePath);
  return enemyScore;
};
