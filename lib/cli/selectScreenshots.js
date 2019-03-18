const _ = require('lodash');
const sizeOf = require('image-size');
const { resolve: resolvePath } = require('path');
const { prompt, registerPrompt } = require('inquirer');
registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

const { HITS, INFO } = require('./screenshotTypes');
const readDir = require('../fs/readDir');

const APP_CONFIG = require('./config/appConfig');

const SCREENSHOTS = {
  INFO: {
    key: INFO,
    message: 'Select the screenshot with titan/war status',
  },
  HITS: {
    key: HITS,
    message: 'Select the screenshot with titan/war hit info',
  },
};

const createSelectScreenshotQuestion = (allImages, message, name, previousQuestionName = null) => ({
  type: 'autocomplete',
  name,
  message,
  pageSize: 10,
  async source (answers, searchText = '') {
    const previousScreenshotName = answers[ previousQuestionName ];
    return _(allImages)
      .filter(imageName => imageName !== previousScreenshotName)
      .filter(imageName => imageName.includes(searchText))
      .reverse()
      .value();
  },
});

const createImageDataFromImageName = (photosFolder, imageNameWithExtension) => {
  const imagePath = resolvePath(photosFolder, imageNameWithExtension);
  return {
    imageName: imageNameWithExtension.replace(/\.[^.]+$/, ''),
    imagePath,
    imageSize: sizeOf(imagePath),
  };
};

module.exports = async (appConfig) => {
  const screenshotsFolder = appConfig[ APP_CONFIG.SCREENSHOTS_FOLDER.key ];
  const allImages = await readDir(screenshotsFolder, imageName => /\.png$/i.test(imageName));
  const questions = [
    createSelectScreenshotQuestion(
      allImages, SCREENSHOTS.INFO.message,
      SCREENSHOTS.INFO.key,
    ),
    createSelectScreenshotQuestion(
      allImages, SCREENSHOTS.HITS.message,
      SCREENSHOTS.HITS.key, SCREENSHOTS.INFO.key,
    ),
  ];

  const answers = await prompt(questions);
  return [
    createImageDataFromImageName(screenshotsFolder, answers[ SCREENSHOTS.INFO.key ]),
    createImageDataFromImageName(screenshotsFolder, answers[ SCREENSHOTS.HITS.key ]),
  ];
};
