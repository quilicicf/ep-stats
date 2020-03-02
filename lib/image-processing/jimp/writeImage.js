const { tmpdir } = require('os');
const { resolve: resolvePath } = require('path');

module.exports = async ({ image }, imageName) => {
  const tempFilePath = resolvePath(tmpdir(), `${imageName}.png`);
  await image.writeAsync(tempFilePath);
  return tempFilePath;
};
