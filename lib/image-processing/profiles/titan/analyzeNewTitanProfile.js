const { execSync } = require('child_process');

const analyzeTitanColorLocation = require('./analyzeTitanColorLocation');

const readImage = require('../../readImage');
const findMeanColor = require('../../findMeanColor');
const createSubImageExtractionScript = require('../../imagemagick/createSubImageExtractionScript');
const deduceTitanColor = require('../../titan/deduceTitanColor');

module.exports = async (imagePath, titanColor) => {
  const image = await readImage(imagePath);
  const colorLocation = analyzeTitanColorLocation(image, titanColor);

  const extractionScript = createSubImageExtractionScript(colorLocation);
  const outputPath = `/tmp/${titanColor.name}.png`;
  const command = extractionScript(imagePath, outputPath);
  execSync(command);

  const meanColor = findMeanColor(outputPath);
  const deducedTitanColor = deduceTitanColor(meanColor);
  console.log(titanColor.name, deducedTitanColor.name);
};
