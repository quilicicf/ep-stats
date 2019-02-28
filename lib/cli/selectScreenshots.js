const _ = require('lodash');
const sizeOf = require('image-size');
const { prompt } = require('inquirer');
const { resolve: resolvePath } = require('path');

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

const createSelectScreenshotQuestion = (screenshotsFolder, message, name, previousQuestionName = null) => ({
  type: 'list',
  name,
  message,
  pageSize: 10,
  async choices (answers) {
    const allImages = await readDir(screenshotsFolder, imageName => /\.png$/i.test(imageName));
    const previousScreenshotName = answers[ previousQuestionName ];
    return _(allImages)
      .filter(imageName => imageName !== previousScreenshotName)
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
  const questions = [
    createSelectScreenshotQuestion(
      screenshotsFolder, SCREENSHOTS.INFO.message,
      SCREENSHOTS.INFO.key,
    ),
    createSelectScreenshotQuestion(
      screenshotsFolder, SCREENSHOTS.HITS.message,
      SCREENSHOTS.HITS.key, SCREENSHOTS.INFO.key,
    ),
  ];

  const answers = await prompt(questions);
  return [
    createImageDataFromImageName(screenshotsFolder, answers[ SCREENSHOTS.INFO.key ]),
    createImageDataFromImageName(screenshotsFolder, answers[ SCREENSHOTS.HITS.key ]),
  ];
};
