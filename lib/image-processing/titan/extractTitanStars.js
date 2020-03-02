const deduceTitanStars = require('./deduceTitanStars');

const showImage = require('../jimp/showImage');
const { SCREENSHOTS_SIZE } = require('../../cli/config/appConfig');

const { TITAN } = require('../../ep/activityTypes');

const deleteFile = require('../../fs/deleteFile');

const availableProfiles = require('../profiles/availableProfiles');

const readImage = require('../../image-processing/jimp/readImage');
const cropImage = require('../../image-processing/jimp/cropImage');
const writeImage = require('../../image-processing/jimp/writeImage');
const thresholdImage = require('../../image-processing/jimp/thresholdImage');

module.exports = async (imagePath, imageName, appConfig) => {
  const screenshotSizeProfileName = appConfig[ SCREENSHOTS_SIZE.key ];
  const screenshotSizeProfile = availableProfiles[ screenshotSizeProfileName ];
  const titanStarsSize = screenshotSizeProfile[ TITAN ].stars;

  const tempFilePath = await readImage(imagePath)
    .then(jimpImage => cropImage(jimpImage, titanStarsSize))
    .then(cropped => thresholdImage(cropped, { thresholdLevel: 80, shouldInvert: true }))
    .then(finalImage => writeImage(finalImage, imageName));

  const titanStars = await deduceTitanStars(tempFilePath);
  const imageRgb = await showImage(tempFilePath, 80);
  process.stdout.write(`Titan stars ${titanStars} deduced from:\n${imageRgb}\n`);

  deleteFile(tempFilePath);
  return titanStars;
};
