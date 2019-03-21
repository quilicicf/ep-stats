const deduceTitanStars = require('./deduceTitanStars');

const showImage = require('../../cli/showImage');
const { SCREENSHOTS_SIZE } = require('../../cli/config/appConfig');

const { TITAN } = require('../../ep/activityTypes');

const deleteFile = require('../../fs/deleteFile');

const availableProfiles = require('../profiles/availableProfiles');
const temporaryProcessing = require('../temporaryProcessing');
const createSubImageBlackAndWhiteExtractionScript = require('../imagemagick/createSubImageBlackAndWhiteExtractionScript');

module.exports = async (imagePath, imageName, appConfig) => {
  const screenshotSizeProfileName = appConfig[ SCREENSHOTS_SIZE.key ];
  const screenshotSizeProfile = availableProfiles[ screenshotSizeProfileName ];
  const titanStarsSize = screenshotSizeProfile[ TITAN ].stars;

  const imageMagickScript = createSubImageBlackAndWhiteExtractionScript(titanStarsSize, 80);
  const tempFilePath = temporaryProcessing(imagePath, imageName, imageMagickScript);

  const titanStars = await deduceTitanStars(tempFilePath);
  const imageRgb = await showImage(tempFilePath, 80);
  process.stdout.write(`Titan stars ${titanStars} deduced from:\n${imageRgb}\n`);

  deleteFile(tempFilePath);
  return titanStars;
};
