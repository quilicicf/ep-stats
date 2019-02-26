#!/usr/bin/env node

const _ = require('lodash');
const { resolve: resolvePath } = require('path');

const listMembers = require('./lib/ep/listMembers');
const uploadScore = require('./lib/ep/uploadScore');
const patchConfig = require('./lib/cli/patchConfig');
const selectScreenshots = require('./lib/cli/selectScreenshots');
const extractHeader = require('./lib/image-processing/extractHeader');
const getImageProcessor = require('./lib/image-processing/getImageProcessor');

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
  console.log(JSON.stringify(selectedScreenshots, null, 2));

  const members = await listMembers(patchedConfig);
  const resultPromises = _.map(
    selectedScreenshots,
    selectedScreenshot => processScreenshot(selectedScreenshot, members),
  );

  const items = await Promise.all(resultPromises);
  const result = _.reduce(items, (seed, item) => ({ ...seed, ...item }), {});
  uploadScore(result, patchedConfig);
  console.log(JSON.stringify(result, null, 2));
};

try {
  main();
} catch (error) {
  throw error;
}
