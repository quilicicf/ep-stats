const log = require('../../conf/log');

const { WAR } = require('../../ep/activityTypes');

const deleteFile = require('../../fs/deleteFile');

const deduceWarBonus = require('./deduceWarBonus');

const readImage = require('../jimp/readImage');
const cropImage = require('../jimp/crop');
const writeImage = require('../jimp/writeImage');

module.exports = async (imagePath, imageName, screenshotProfile) => {
  const warBonusSize = screenshotProfile[ WAR ].bonus;

  const tempFilePath = await readImage(imagePath)
    .then((jimpImage) => cropImage(jimpImage, warBonusSize))
    .then((finalImage) => writeImage(finalImage, `${imageName}_bonus`));

  const warBonus = await deduceWarBonus(tempFilePath);

  log([ `Deduced war bonus ${warBonus}` ]);

  deleteFile(tempFilePath);
  return warBonus;
};
