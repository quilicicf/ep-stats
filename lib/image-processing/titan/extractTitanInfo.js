const extractTitanColor = require('./extractTitanColor');
const extractTitanLife = require('./extractTitanLife');
const guessTitanStars = require('./guessTitanStars');

module.exports = async ({ imagePath, imageName, imageSize }) => {
  const titanColor = extractTitanColor(imagePath, imageName, imageSize);
  const titanLife = extractTitanLife(imagePath, imageName, imageSize);
  const titanStars = guessTitanStars(titanLife);

  return {
    color: titanColor,
    life: titanLife,
    stars: titanStars,
    gsheetRange: 'Titans',
    valuesForUpload: [ titanLife, titanStars, titanColor ],
  };
};
