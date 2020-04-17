const _ = require('lodash');

const availableProfiles = require('../image-processing/profiles/availableProfiles');

const KEYS = {
  SHEET_ID: 'sheetId',
  SCREENSHOTS_SIZE: 'screenshotsSize',
  CALENDAR_ID: 'calendarId',
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
  CALENDAR_ID: {
    key: KEYS.CALENDAR_ID,
    question: {
      type: 'input',
      message: 'What is the id of your Google Calendar? (leave empty if you don\'t have one)',
      name: KEYS.CALENDAR_ID,
    },
    isRequired: true,
  },
};
