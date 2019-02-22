#!/usr/bin/env node

const _ = require('lodash');
const { homedir } = require('os');
const sizeOf = require('image-size');
const { resolve: resolvePath } = require('path');

const readDir = require('./lib/fs/readDir');
const extractHeader = require('./lib/image-processing/extractHeader');
const getImageProcessor = require('./lib/image-processing/getImageProcessor');

const FILES_PATH = resolvePath(homedir(), 'Downloads', 'Photos');

const main = async () => {
  const imageNamesWithExtensions = await readDir(FILES_PATH, file => /IMG_[0-9]+\.png/.test(file));

  const promises = _(imageNamesWithExtensions)
    // .filter(name => name === 'IMG_0818.png')
    .map((imageNameWithExtension) => {
      const imagePath = resolvePath(FILES_PATH, imageNameWithExtension);
      const imageName = imageNameWithExtension.replace(/\.[^.]+$/, '');

      const imageSize = sizeOf(imagePath);
      const header = extractHeader(imagePath, imageName, imageSize);
      const imageProcessor = getImageProcessor(header);

      return imageProcessor(imagePath, imageName, imageSize);
      // const processedFilePath =
      // preprocessImage(filePath, resolvePath(ARCHIVE_PATH, fileName), { thresholdValue: '45' });
      // console.log(processedFilePath);
      //
      // const ocrResult = ocrFile(processedFilePath, psms.AS_MUCH_TEXT_AS_POSSIBLE);
      // return writeFile(resolvePath(ARCHIVE_PATH, `${fileNameNoExtension}_ocr.txt`), ocrResult);
      // console.log(_(ocrResult).split('\n').filter(line => !_.isEmpty(line)).join('\n'));

      // const processedOcrResult = processOcrResult(ocrResult);
      // console.log(processedOcrResult);
      // console.log(separator);
    })
    .value();

  const results = await Promise.all(promises);
  console.log(results);
};

try {
  main();
} catch (error) {
  throw error;
}
