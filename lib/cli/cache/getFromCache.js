const _ = require('lodash');
const { existsSync } = require('fs');

const readFile = require('../../fs/readFile');

module.exports = async (cachePath, pathInCache) => {
  if (!existsSync(cachePath)) { return {}; }
  return readFile(cachePath, (cacheAsString) => {
    const cache = JSON.parse(cacheAsString);
    return _.get(cache, pathInCache) || {};
  });
};
