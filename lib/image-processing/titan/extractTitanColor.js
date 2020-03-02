const showImage = require('../jimp/showImage');
const { SCREENSHOTS_SIZE } = require('../../cli/config/appConfig');

const deleteFile = require('../../fs/deleteFile');

const { TITAN } = require('../../ep/activityTypes');

const deduceTitanColor = require('./deduceTitanColor');
const findMeanColor = require('../findMeanColor');
const availableProfiles = require('../profiles/availableProfiles');

const readImage = require('../../image-processing/jimp/readImage');
const cropImage = require('../../image-processing/jimp/cropImage');
const writeImage = require('../../image-processing/jimp/writeImage');

module.exports = async (imagePath, imageName, appConfig) => {
  const screenshotSizeProfileName = appConfig[ SCREENSHOTS_SIZE.key ];
  const screenshotSizeProfile = availableProfiles[ screenshotSizeProfileName ];
  const titanColorSize = screenshotSizeProfile[ TITAN ].color;

  const tempFilePath = await readImage(imagePath)
    .then(jimpImage => cropImage(jimpImage, titanColorSize))
    .then(finalImage => writeImage(finalImage, imageName));

  const meanColor = findMeanColor(tempFilePath);
  const titanColor = deduceTitanColor(meanColor);

  const imageRgb = await showImage(tempFilePath, 5);
  process.stdout.write(`Titan color ${titanColor.toChalk().bold(titanColor.name)} deduced from:\n${imageRgb}\n`);

  deleteFile(tempFilePath);
  return titanColor.name;
};
