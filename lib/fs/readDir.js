const _ = require('lodash');
const { readdir } = require('fs');

module.exports = async (path, fileTester = () => true) => new Promise((resolve, reject) => {
  readdir(path, (error, files) => {
    if (error) { return reject(error); }
    return resolve(_.filter(files, fileTester));
  });
});
