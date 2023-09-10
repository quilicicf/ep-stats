const log = require('../../conf/log');

const { WAR } = require('../../ep/activityTypes');

const deleteFile = require('../../fs/deleteFile');

const recognize = require('../../ocr/recognizeJs');

const readImage = require('../jimp/readImage');
const cropImage = require('../jimp/crop');
const writeImage = require('../jimp/writeImage');
const thresholdImage = require('../jimp/thresholdLight');

module.exports = async (imagePath, imageName, screenshotProfile) => {
  const warEnemyScore = screenshotProfile[ WAR ].enemyScore;

  const tempFilePath = await readImage(imagePath)
    .then((jimpImage) => cropImage(jimpImage, warEnemyScore))
    .then((cropped) => thresholdImage(cropped, { thresholdLevel: 80, shouldInvert: true }))
    .then((finalImage) => writeImage(finalImage, `${imageName}_score`));

  const enemyScoreAsString = await recognize(tempFilePath);
  const enemyScore = parseInt(enemyScoreAsString, 10);

  log([ `Deduced enemy score: ${enemyScore}` ]);

  deleteFile(tempFilePath);
  return enemyScore;
};
