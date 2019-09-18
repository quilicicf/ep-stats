const _ = require('lodash');
const sizeOf = require('image-size');
const { resolve: resolvePath } = require('path');
const { prompt, registerPrompt } = require('inquirer');
registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

const { HITS, INFO } = require('./screenshotTypes');
const readDir = require('../fs/readDir');

const APP_CONFIG = require('./config/appConfig');

const SCREENSHOT_MESSAGES = {
  [ INFO ]: 'Select the screenshot with titan/war status',
  [ HITS ]: 'Select the screenshot with titan/war hit info',
};

const createSelectScreenshotQuestion = (allImages, screenshotType, previousScreenshotName) => {
  const message = SCREENSHOT_MESSAGES[ screenshotType ];
  return {
    type: 'autocomplete',
    name: 'answer',
    message,
    pageSize: 10,
    async source (answers, searchText = '') {
      return _(allImages)
        .filter(imageName => imageName !== previousScreenshotName)
        .filter(imageName => imageName.includes(searchText))
        .reverse()
        .value();
    },
  };
};

const createImageDataFromImageName = (photosFolder, imageNameWithExtension) => {
  const imagePath = resolvePath(photosFolder, imageNameWithExtension);
  return {
    imageNameWithExtension,
    imageName: imageNameWithExtension.replace(/\.[^.]+$/, ''),
    imagePath,
    imageSize: sizeOf(imagePath),
  };
};

module.exports = async (appConfig, screenshotType, previousScreenshotName = null) => {
  const screenshotsFolder = appConfig[ APP_CONFIG.SCREENSHOTS_FOLDER.key ];
  const allImages = await readDir(screenshotsFolder, imageName => /\.png$/i.test(imageName));
  const question = createSelectScreenshotQuestion(allImages, screenshotType, previousScreenshotName);

  const { answer } = await prompt(question);
  return createImageDataFromImageName(screenshotsFolder, answer);
};
