const { SCREEN_TYPES: { TITAN_INFO_TYPE } } = require('./conf/constants');

const extractTitanColor = require('./image-processing/titan/extractTitanColor');
const extractTitanLife = require('./image-processing/titan/extractTitanLife');
const extractTitanStars = require('./image-processing/titan/extractTitanStars');

module.exports = async (imagePath, imageName, screenshotProfile) => {
  const titanColor = await extractTitanColor(imagePath, imageName, screenshotProfile);
  const titanLife = await extractTitanLife(imagePath, imageName, screenshotProfile);
  const titanStars = await extractTitanStars(imagePath, imageName, screenshotProfile);

  return {
    type: TITAN_INFO_TYPE,
    imageName,
    color: titanColor,
    life: titanLife,
    stars: titanStars,
  };
};
