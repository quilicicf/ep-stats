const log = require('../../conf/log');

const deleteFile = require('../../fs/deleteFile');

const { TITAN } = require('../../ep/activityTypes');

const deduceTitanColor = require('./deduceTitanColor');

const cropImage = require('../jimp/crop');
const readImage = require('../jimp/readImage');
const writeImage = require('../jimp/writeImage');
const findMeanColor = require('../jimp/findMeanColor');

module.exports = async (imagePath, imageName, screenshotProfile) => {
  const titanColorSize = screenshotProfile[ TITAN ].color;

  const tempFilePath = await readImage(imagePath)
    .then(jimpImage => cropImage(jimpImage, titanColorSize))
    .then(finalImage => writeImage(finalImage, `${imageName}_color`));

  const meanColor = await findMeanColor(tempFilePath);
  const titanColor = deduceTitanColor(meanColor);

  log([ `Deduced titan color: ${titanColor.toChalk().bold(titanColor.name)}` ]);

  deleteFile(tempFilePath);
  return titanColor.name;
};
