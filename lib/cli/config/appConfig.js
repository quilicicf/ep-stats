const _ = require('lodash');
const { existsSync } = require('fs');

const availableProfiles = require('../../image-processing/profiles/availableProfiles');

const KEYS = {
  SHEET_ID: 'sheetId',
  SCREENSHOTS_FOLDER: 'screenshotsFolder',
  SCREENSHOTS_SIZE: 'screenshotsSize',
};

module.exports = {
  SHEET_ID: {
    key: KEYS.SHEET_ID,
    question: {
      type: 'input',
      message: 'What is the id of your GSheet?',
      name: KEYS.SHEET_ID,
    },
    isRequired: true,
  },
  SCREENSHOTS_FOLDER: {
    key: KEYS.SCREENSHOTS_FOLDER,
    question: {
      type: 'input',
      message: 'Where are your screenshots saved? (must be a valid folder)',
      name: KEYS.SCREENSHOTS_FOLDER,
      validate (userInput) {
        if (existsSync(userInput)) { return true; }
        throw Error(`${userInput} not found on disk`);
      },
    },
    isRequired: true,
  },
  SCREENSHOTS_SIZE: {
    key: KEYS.SCREENSHOTS_SIZE,
    question: {
      type: 'list',
      message: 'What is the size of your screenshots?\n',
      name: KEYS.SCREENSHOTS_SIZE,
      choices: _.keys(availableProfiles),
      suffix: 'If your size does not appear, please refer to instructions at https://github.com/quilicicf/ep-stats/tree/master/doc/screenshot_profiles.md',
    },
    isRequired: true,
  },
};
