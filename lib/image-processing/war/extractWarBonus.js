const showImage = require('../../cli/showImage');
const { SCREENSHOTS_SIZE } = require('../../cli/config/appConfig');

const { WAR } = require('../../ep/activityTypes');

const deleteFile = require('../../fs/deleteFile');

const deduceWarBonus = require('./deduceWarBonus');
const temporaryProcessing = require('../temporaryProcessing');
const availableProfiles = require('../profiles/availableProfiles');
const createSubImageExtractionScript = require('../imagemagick/createSubImageExtractionScript');

module.exports = async (imagePath, imageName, appConfig) => {
  const screenshotSizeProfileName = appConfig[ SCREENSHOTS_SIZE.key ];
  const screenshotSizeProfile = availableProfiles[ screenshotSizeProfileName ];
  const warBonusSize = screenshotSizeProfile[ WAR ].bonus;

  const imageMagickScript = createSubImageExtractionScript(warBonusSize);
  const tempFilePath = temporaryProcessing(imagePath, imageName, imageMagickScript);

  const warBonus = await deduceWarBonus(tempFilePath);

  const imageRgb = await showImage(tempFilePath, 10);
  process.stdout.write(`War bonus ${warBonus} deduced from:\n${imageRgb}\n`);

  deleteFile(tempFilePath);

  return warBonus;
};
