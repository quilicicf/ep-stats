const deduceTitanStars = require('./deduceTitanStars');

const log = require('../../conf/log');

const { TITAN } = require('../../ep/activityTypes');

const deleteFile = require('../../fs/deleteFile');

const readImage = require('../jimp/readImage');
const writeImage = require('../jimp/writeImage');

const crop = require('../jimp/crop');
const thresholdLight = require('../jimp/thresholdLight');

module.exports = async (imagePath, imageName, screenshotProfile) => {
  const titanStarsSize = screenshotProfile[ TITAN ].stars;

  const tempFilePath = await readImage(imagePath)
    .then(jimpImage => crop(jimpImage, titanStarsSize))
    .then(cropped => thresholdLight(cropped, { thresholdLevel: 55, shouldInvert: true }))
    .then(finalImage => writeImage(finalImage, `${imageName}_stars`));

  const titanStars = await deduceTitanStars(tempFilePath);
  log([ `Deduced titan stars: ${titanStars}` ]);

  deleteFile(tempFilePath);
  return titanStars;
};
