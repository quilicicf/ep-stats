const { SCREENSHOTS_SIZE } = require('../../cli/config/appConfig');

const { WAR } = require('../../ep/activityTypes');

const deleteFile = require('../../fs/deleteFile');

const ocrFile = require('../../ocr/ocrFile');

const temporaryProcessing = require('../temporaryProcessing');
const availableProfiles = require('../profiles/availableProfiles');
const createSubImageExtractionScript = require('../imagemagick/createSubImageExtractionScript');

module.exports = (imagePath, imageName, appConfig) => {
  const screenshotSizeProfileName = appConfig[ SCREENSHOTS_SIZE.key ];
  const screenshotSizeProfile = availableProfiles[ screenshotSizeProfileName ];
  const warEnemyScore = screenshotSizeProfile[ WAR ].enemyScore;

  const imageMagickScript = createSubImageExtractionScript(warEnemyScore);
  const tempFilePath = temporaryProcessing(imagePath, imageName, imageMagickScript);

  const lifeAsString = ocrFile(tempFilePath);

  deleteFile(tempFilePath);
  return parseInt(lifeAsString, 10);
};
