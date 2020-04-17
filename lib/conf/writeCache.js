const { CACHE_PATH } = require('./constants');

const writeFile = require('../fs/writeFile');

module.exports = async (cache) => {
  await writeFile(CACHE_PATH, cache, data => JSON.stringify(data, null, 2));
};
