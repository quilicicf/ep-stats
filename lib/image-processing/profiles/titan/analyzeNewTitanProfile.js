const { execSync } = require('child_process');

const analyzeTitanColorLocation = require('./analyzeTitanColorLocation');
const analyzeTitanStarsLocation = require('./analyzeTitanStarsLocation');
const analyzeTitanHeaderLocation = require('./analyzeTitanHeaderLocation');

const showImage = require('../../../cli/showImage');

const readImage = require('../../readImage');
const createSubImageBlackAndWhiteExtractionScript = require('../../imagemagick/createSubImageBlackAndWhiteExtractionScript');
const deduceTitanStars = require('../../titan/deduceTitanStars');

module.exports = async (imagePath, titanColor) => {
  const image = await readImage(imagePath);
  const headerLocation = analyzeTitanHeaderLocation(image);
  const colorLocation = analyzeTitanColorLocation(image, headerLocation, titanColor);
  const starsLocation = analyzeTitanStarsLocation(image, colorLocation);

  const extractionScript = createSubImageBlackAndWhiteExtractionScript(starsLocation, 80);
  const outputPath = `/tmp/${titanColor.name}.png`;
  const command = extractionScript(imagePath, outputPath);
  execSync(command);

  const imageToShow = await showImage(outputPath, 80);
  console.log(titanColor.name);
  console.log(imageToShow);
  console.log(await deduceTitanStars(outputPath));
};
