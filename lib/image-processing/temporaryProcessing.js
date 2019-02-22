const { tmpdir } = require('os');
const { execSync } = require('child_process');
const { resolve: resolvePath } = require('path');

module.exports = (imagePath, imageName, imageMagickScript) => {
  const tempFilePath = resolvePath(tmpdir(), `${imageName}.png`);
  const command = imageMagickScript(imagePath, tempFilePath);
  execSync(command);
  return tempFilePath;
};
