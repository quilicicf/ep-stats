#!/usr/bin/env node

const _ = require('lodash');
const { homedir } = require('os');
const { resolve: resolvePath } = require('path');

const readDir = require('./lib/fs/readDir');
const patchConfig = require('./lib/cli/patchConfig');
const selectScreenshots = require('./lib/cli/selectScreenshots');
const extractHeader = require('./lib/image-processing/extractHeader');
const getImageProcessor = require('./lib/image-processing/getImageProcessor');

const APP_CONFIG = require('./lib/cli/appConfig');

const CONFIG_PATH = resolvePath(__dirname, 'config.json');

const main = async () => {
  const patchedConfig = await patchConfig(CONFIG_PATH);
  const selectedScreenshots = await selectScreenshots(patchedConfig);
  console.log(JSON.stringify(selectedScreenshots, null, 2));

  const infoScreenshot = selectedScreenshots[ 0 ];
  const infoHeader = extractHeader(infoScreenshot);
  const infoProcessor = getImageProcessor(infoHeader);
  const info = await infoProcessor(infoScreenshot);

  const hitsScreenshot = selectedScreenshots[ 1 ];
  const hitsHeader = extractHeader(hitsScreenshot);
  const hitsProcessor = getImageProcessor(hitsHeader);
  const hits = await hitsProcessor(hitsScreenshot);

  console.log(JSON.stringify(info));
  console.log(JSON.stringify(hits));

  // const imageNamesWithExtensions = await readDir(FILES_PATH, file => /IMG_[0-9]+\.png/.test(file));
  //
  // const promises = _(imageNamesWithExtensions)
  //   .map((imageNameWithExtension) => {
  //     const imagePath = resolvePath(FILES_PATH, imageNameWithExtension);
  //     const imageName = imageNameWithExtension.replace(/\.[^.]+$/, '');
  //
  //     const imageProcessor = getImageProcessor(header);
  //
  //     return imageProcessor(imagePath, imageName, imageSize);
  //   })
  //   .value();
  //
  // const results = await Promise.all(promises);
};

try {
  main();
} catch (error) {
  throw error;
}
