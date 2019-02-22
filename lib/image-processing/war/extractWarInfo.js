const extractWarBonus = require('./extractWarBonus');
const extractWarEnemyScore = require('./extractWarEnemyScore');

module.exports = async (imagePath, imageName, imageSize) => {
  const warBonus = extractWarBonus(imagePath, imageName, imageSize);
  const enemyScore = extractWarEnemyScore(imagePath, imageName, imageSize);

  return {
    bonus: warBonus,
    enemyScore,
  };
};
