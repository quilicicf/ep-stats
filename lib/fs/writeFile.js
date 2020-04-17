const _ = require('lodash');
const { writeFile } = require('fs');

module.exports = async (path, data, transformer = _.identity) => (
  new Promise((resolve, reject) => {
    writeFile(path, transformer(data), 'utf8', (error) => {
      if (error) { return reject(error); }
      return resolve();
    });
  })
);
