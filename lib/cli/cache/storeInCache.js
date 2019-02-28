const _ = require('lodash');
const { existsSync } = require('fs');

const readFile = require('../../fs/readFile');
const writeFile = require('../../fs/writeFile');

module.exports = async (cachePath, pathInCache, value) => {
  const cache = existsSync(cachePath)
    ? (await readFile(cachePath, JSON.parse))
    : {};

  _.set(cache, pathInCache, value);

  return writeFile(cachePath, JSON.stringify(cache, null, 2));
};
