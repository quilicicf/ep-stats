#!/usr/bin/env node

const _ = require('lodash');
const { resolve: resolvePath } = require('path');

const listMembers = require('./lib/ep/listMembers');
const uploadScoreAndUpdateCache = require('./lib/ep/uploadScoreAndUpdateCache');

const configureOcrUserWords = require('./lib/ocr/configureOcrUserWords');

const patchConfig = require('./lib/cli/config/patchConfig');
const selectScreenshots = require('./lib/cli/selectScreenshots');

const extractHeader = require('./lib/image-processing/extractHeader');
const getImageProcessor = require('./lib/image-processing/getImageProcessor');

const CACHE_PATH = resolvePath(__dirname, 'cache.json');
const CONFIG_PATH = resolvePath(__dirname, 'config.json');

const processScreenshot = async (screenshot, members, appConfig) => {
  const header = extractHeader({ screenshot, appConfig });
  const { type, processor } = getImageProcessor(header);

  const result = await processor({ screenshot, members, appConfig });
  return { [ type ]: result };
};

const main = async () => {
  const patchedConfig = await patchConfig(CONFIG_PATH);
  const selectedScreenshots = await selectScreenshots(patchedConfig);

  const members = await listMembers(patchedConfig);
  await configureOcrUserWords(_.keys(members));

  const resultPromise = _.reduce(
    selectedScreenshots,
    (promise, selectedScreenshot) => promise
      .then(seed => (
        processScreenshot(selectedScreenshot, members, patchedConfig)
          .then(item => [ ...seed, item ])
      )),
    Promise.resolve([]),
  );

  const items = await resultPromise;
  const result = _.reduce(items, (seed, item) => ({ ...seed, ...item }), {});

  const sentPayload = await uploadScoreAndUpdateCache(result, patchedConfig, CACHE_PATH);
  console.log(sentPayload);
};

try {
  main();
} catch (error) {
  throw error;
}
