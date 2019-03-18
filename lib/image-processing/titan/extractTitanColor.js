const showImage = require('../../cli/showImage');
const { SCREENSHOTS_SIZE } = require('../../cli/config/appConfig');

const deleteFile = require('../../fs/deleteFile');

const { TITAN } = require('../../ep/activityTypes');
const deduceTitanColor = require('../../ep/deduceTitanColor');

const findMeanColor = require('../findMeanColor');
const temporaryProcessing = require('../temporaryProcessing');
const availableProfiles = require('../profiles/availableProfiles');
const createSubImageExtractionScript = require('../imagemagick/createSubImageExtractionScript');


module.exports = async (imagePath, imageName, appConfig) => {
  const screenshotSizeProfileName = appConfig[ SCREENSHOTS_SIZE.key ];
  const screenshotSizeProfile = availableProfiles[ screenshotSizeProfileName ];
  const titanColorSize = screenshotSizeProfile[ TITAN ].color;

  const imageMagickScript = createSubImageExtractionScript(titanColorSize);
  const tempFilePath = temporaryProcessing(imagePath, imageName, imageMagickScript);

  const meanColor = findMeanColor(tempFilePath);
  const titanColor = deduceTitanColor(meanColor);

  const imageRgb = await showImage(tempFilePath, 5);
  process.stdout.write(`Titan color ${titanColor.name} deduced from:\n${imageRgb}\n`);

  deleteFile(tempFilePath);
  return titanColor.name;
};
