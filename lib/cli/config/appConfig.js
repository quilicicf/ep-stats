const { existsSync } = require('fs');

const KEYS = {
  SHEET_ID: 'sheetId',
  SCREENSHOTS_FOLDER: 'screenshotsFolder',
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
};
