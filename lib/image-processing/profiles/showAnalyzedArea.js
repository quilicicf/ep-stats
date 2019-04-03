const _ = require('lodash');

const temporaryProcessing = require('../temporaryProcessing');

const showImage = require('../../cli/showImage');
const createSubImageBlackAndWhiteExtractionScript = require('../imagemagick/createSubImageBlackAndWhiteExtractionScript');

module.exports = async (
  imagePath, areaName, location,
  {
    scriptGenerator = createSubImageBlackAndWhiteExtractionScript,
    maxWidth = 120,
  },
) => {

  const tempImagePath = temporaryProcessing(imagePath, _.camelCase(areaName), scriptGenerator(location));
  const imageAsText = await showImage(tempImagePath, maxWidth);
  process.stdout.write(`${areaName} deduced:\n${imageAsText}\n`);
};
