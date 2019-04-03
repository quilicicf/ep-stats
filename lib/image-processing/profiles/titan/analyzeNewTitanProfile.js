const analyzeTitanLifeLocation = require('./analyzeTitanLifeLocation');
const analyzeTitanColorLocation = require('./analyzeTitanColorLocation');
const analyzeTitanStarsLocation = require('./analyzeTitanStarsLocation');
const analyzeTitanHeaderLocation = require('./analyzeTitanHeaderLocation');
const analyzeScreenshotHeaderLocation = require('./analyzeScreenshotHeaderLocation');

const showAnalyzedArea = require('../showAnalyzedArea');

const readImage = require('../../readImage');

const createSubImageExtractionScript = require('../../imagemagick/createSubImageExtractionScript');

module.exports = async (imagePath, titanColor) => {
  const image = await readImage(imagePath);
  const titanHeaderLocation = analyzeTitanHeaderLocation(image);
  const screenshotHeaderLocation = analyzeScreenshotHeaderLocation(image, titanHeaderLocation);

  await showAnalyzedArea(imagePath, 'Screenshot header', screenshotHeaderLocation, {});

  const colorLocation = analyzeTitanColorLocation(image, titanHeaderLocation, titanColor);
  await showAnalyzedArea(imagePath, 'Titan color', colorLocation, { scriptGenerator: createSubImageExtractionScript, maxWidth: 15 });

  const starsLocation = analyzeTitanStarsLocation(image, colorLocation);
  await showAnalyzedArea(imagePath, 'Titan stars', starsLocation, {});

  const lifeLocation = analyzeTitanLifeLocation(image, colorLocation);
  await showAnalyzedArea(imagePath, 'Titan life', lifeLocation, {});
};
