const { rename } = require('fs');

module.exports = async (sourcePath, targetPath) => (
  new Promise((resolve, reject) => {
    rename(sourcePath, targetPath, (error) => {
      if (error) { return reject(error); }
      return resolve();
    });
  })
);
