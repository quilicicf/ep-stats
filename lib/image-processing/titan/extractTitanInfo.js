const extractTitanColor = require('./extractTitanColor');
const extractTitanLife = require('./extractTitanLife');
const extractTitanStars = require('./extractTitanStars');
const { TITAN } = require('../../ep/activityTypes');

module.exports = async ({ screenshot, appConfig }) => {
  const { imagePath, imageName } = screenshot;

  const titanColor = await extractTitanColor(imagePath, imageName, appConfig);
  const titanLife = await extractTitanLife(imagePath, imageName, appConfig);
  const titanStars = await extractTitanStars(imagePath, imageName, appConfig);
  // const titanStars = guessTitanStars(titanLife);

  return {
    color: titanColor,
    life: titanLife,
    stars: titanStars,
    activityType: TITAN,
    gsheetRange: 'Titans',
  };
};
