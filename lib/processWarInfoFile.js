const { SCREEN_TYPES: { WAR_INFO_TYPE } } = require('./conf/constants');

const extractWarBonus = require('./image-processing/war/extractWarBonus');
const extractWarEnemyScore = require('./image-processing/war/extractWarEnemyScore');

module.exports = async (imagePath, imageName, screenshotProfile) => {
  const warBonus = await extractWarBonus(imagePath, imageName, screenshotProfile);
  const enemyScore = await extractWarEnemyScore(imagePath, imageName, screenshotProfile);

  return {
    type: WAR_INFO_TYPE,
    imageName,
    bonus: warBonus,
    enemyScore,
  };
};
