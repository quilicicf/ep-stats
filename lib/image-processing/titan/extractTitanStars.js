const deduceTitanStars = require('./deduceTitanStars');

const log = require('../../conf/log');

const { TITAN } = require('../../ep/activityTypes');

const deleteFile = require('../../fs/deleteFile');

const readImage = require('../jimp/readImage');
const writeImage = require('../jimp/writeImage');

const crop = require('../jimp/crop');
const thresholdHue = require('../jimp/thresholdHue');

async function extractAndDeduceTitanStars (imagePath, imageName, starsSize, lineNumber) {
  const tempFilePath = await readImage(imagePath)
    .then((jimpImage) => crop(jimpImage, starsSize))
    .then((cropped) => thresholdHue(cropped, { thresholdLevel: 10, targetHue: 210 }))
    .then((finalImage) => writeImage(finalImage, `${imageName}_stars${lineNumber}`));

  const titanStars = await deduceTitanStars(tempFilePath);
  log([ `Deduced titan stars on line ${lineNumber}: ${titanStars}` ]);

  deleteFile(tempFilePath);

  return titanStars;
}

module.exports = async (imagePath, imageName, screenshotProfile) => {
  const starsOnLine1 = await extractAndDeduceTitanStars(imagePath, imageName, screenshotProfile[ TITAN ].stars1, 1);
  const starsOnLine2 = await extractAndDeduceTitanStars(imagePath, imageName, screenshotProfile[ TITAN ].stars2, 2);
  const totalStars = starsOnLine1 + starsOnLine2;
  log([ `Deduced total titan stars: ${totalStars}` ]);
  return totalStars;
};
