const showImage = require('../../cli/showImage');
const { SCREENSHOTS_SIZE } = require('../../cli/config/appConfig');

const { WAR } = require('../../ep/activityTypes');

const deleteFile = require('../../fs/deleteFile');

const ocrFile = require('../../ocr/ocrFile');

const temporaryProcessing = require('../temporaryProcessing');
const availableProfiles = require('../profiles/availableProfiles');
const createSubImageBlackAndWhiteExtractionScript = require('../imagemagick/createSubImageBlackAndWhiteExtractionScript');

module.exports = async (imagePath, imageName, appConfig) => {
  const screenshotSizeProfileName = appConfig[ SCREENSHOTS_SIZE.key ];
  const screenshotSizeProfile = availableProfiles[ screenshotSizeProfileName ];
  const warEnemyScore = screenshotSizeProfile[ WAR ].enemyScore;

  const imageMagickScript = createSubImageBlackAndWhiteExtractionScript(warEnemyScore);
  const tempFilePath = temporaryProcessing(imagePath, imageName, imageMagickScript);

  const enemyScoreAsString = ocrFile(tempFilePath);
  const enemyScore = parseInt(enemyScoreAsString, 10);

  const imageRgb = await showImage(tempFilePath, 40);
  process.stdout.write(`Enemy score ${enemyScore} deduced from:\n${imageRgb}\n`);

  deleteFile(tempFilePath);
  return enemyScore;
};
