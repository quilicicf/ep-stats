const extractTitanColor = require('./extractTitanColor');
const extractTitanLife = require('./extractTitanLife');

module.exports = async ({ imagePath, imageName, imageSize }) => {
  const titanColor = extractTitanColor(imagePath, imageName, imageSize);
  const titanLife = extractTitanLife(imagePath, imageName, imageSize);

  return {
    color: titanColor,
    life: titanLife,
  };
};
