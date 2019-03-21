const _ = require('lodash');
const { readFile } = require('fs');

module.exports = async (path, transformer = _.identity, defaultValue = undefined) => (
  new Promise((resolve, reject) => {
    readFile(path, 'utf8', (error, data) => {
      if (error) {
        return defaultValue
          ? resolve(defaultValue)
          : reject(error);
      }
      return resolve(transformer(data));
    });
  })
);
