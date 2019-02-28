#!/usr/bin/env node

const _ = require('lodash');
const { resolve: resolvePath } = require('path');

const listMembers = require('./lib/ep/listMembers');
const uploadScoreAndUpdateCache = require('./lib/ep/uploadScoreAndUpdateCache');

const patchConfig = require('./lib/cli/config/patchConfig');
const selectScreenshots = require('./lib/cli/selectScreenshots');

const extractHeader = require('./lib/image-processing/extractHeader');
const getImageProcessor = require('./lib/image-processing/getImageProcessor');

const CACHE_PATH = resolvePath(__dirname, 'cache.json');
const CONFIG_PATH = resolvePath(__dirname, 'config.json');

const processScreenshot = async (selectedScreenshot, members) => {
  const header = extractHeader(selectedScreenshot);
  const { type, processor } = getImageProcessor(header);

  const result = await processor({ ...selectedScreenshot, members });
  return { [ type ]: result };
};

const main = async () => {
  const patchedConfig = await patchConfig(CONFIG_PATH);
  const selectedScreenshots = await selectScreenshots(patchedConfig);

  const members = await listMembers(patchedConfig);
  const resultPromises = _.map(
    selectedScreenshots,
    selectedScreenshot => processScreenshot(selectedScreenshot, members),
  );

  const items = await Promise.all(resultPromises);
  const result = _.reduce(items, (seed, item) => ({ ...seed, ...item }), {});

  await uploadScoreAndUpdateCache(result, patchedConfig, CACHE_PATH);
  console.log(JSON.stringify(result, null, 2));
};

try {
  main();
} catch (error) {
  throw error;
}
