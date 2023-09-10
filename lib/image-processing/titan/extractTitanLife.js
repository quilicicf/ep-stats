const _ = require('lodash');

const log = require('../../conf/log');
const { WARNING } = require('../../conf/logLevels');

const { TITAN } = require('../../ep/activityTypes');

const deleteFile = require('../../fs/deleteFile');

const recognize = require('../../ocr/recognizeJs');

const readImage = require('../jimp/readImage');
const cropImage = require('../jimp/crop');
const writeImage = require('../jimp/writeImage');
const thresholdImage = require('../jimp/thresholdLight');

const NO_TITAN_LIFE_MESSAGE = [
  'The titan life could not be retrieved',
  'This often happens when the screenshot was taken after it was defeated',
  'Its life will be set to the amount of damage it took',
  'Please correct this in the GSheet if the assumption is wrong',
];

module.exports = async (imagePath, imageName, screenshotProfile) => {
  const titanLifeSize = screenshotProfile[ TITAN ].life;

  const tempFilePath = await readImage(imagePath)
    .then((jimpImage) => cropImage(jimpImage, titanLifeSize))
    .then((cropped) => thresholdImage(cropped, { thresholdLevel: 80, shouldInvert: true }))
    .then((finalImage) => writeImage(finalImage, `${imageName}_life`));

  const lifeLine = await recognize(tempFilePath);
  const titanLife = _(lifeLine)
    .split('/')
    .takeRight()
    .map((part) => parseInt(part, 10) || 0)
    .first();

  log([ `Deduced titan life: ${titanLife}` ]);
  if (titanLife === 0) { log(NO_TITAN_LIFE_MESSAGE, WARNING); }

  deleteFile(tempFilePath);
  return titanLife;
};
