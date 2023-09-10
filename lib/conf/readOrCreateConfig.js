const { existsSync } = require('fs');

const patchConfig = require('./patchConfig');
const { CONFIGURATION_PATH, DEFAULT_CONFIGURATION } = require('./constants');

const readFile = require('../fs/readFile');
const writeFile = require('../fs/writeFile');

module.exports = async () => {
  if (!existsSync(CONFIGURATION_PATH)) {
    const config = await patchConfig(DEFAULT_CONFIGURATION);
    await writeFile(CONFIGURATION_PATH, config, (data) => JSON.stringify(data, null, 2));
    return config;
  }

  return readFile(CONFIGURATION_PATH, (data) => JSON.parse(data));
};
