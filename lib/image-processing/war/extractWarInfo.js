const extractWarBonus = require('./extractWarBonus');
const extractWarEnemyScore = require('./extractWarEnemyScore');
const { WAR } = require('../../ep/activityTypes');

module.exports = async ({ screenshot, appConfig }) => {
  const { imagePath, imageName } = screenshot;
  const warBonus = await extractWarBonus(imagePath, imageName, appConfig);
  const enemyScore = extractWarEnemyScore(imagePath, imageName, appConfig);

  return {
    bonus: warBonus,
    enemyScore,
    activityType: WAR,
    gsheetRange: 'Wars',
  };
};
