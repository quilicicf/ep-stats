const extractWarBonus = require('./extractWarBonus');
const extractWarEnemyScore = require('./extractWarEnemyScore');
const { WAR } = require('../../ep/activityTypes');

module.exports = async ({ imagePath, imageName, imageSize }) => {
  const warBonus = extractWarBonus(imagePath, imageName, imageSize);
  const enemyScore = extractWarEnemyScore(imagePath, imageName, imageSize);

  return {
    bonus: warBonus,
    enemyScore,
    activityType: WAR,
    gsheetRange: 'Wars',
    valuesForUpload: [ enemyScore, warBonus ],
  };
};
