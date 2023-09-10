const { readFile } = require('fs');

module.exports = async (filePath) => new Promise((resolve, reject) => {
  readFile(filePath, (error, buffer) => {
    if (error) { return reject(error); }
    return resolve(buffer);
  });
});
