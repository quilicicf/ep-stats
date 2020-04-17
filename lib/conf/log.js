const _ = require('lodash');
const { appendFileSync } = require('fs');
const formatDate = require('date-fns/format');

const { LOGS_PATH, DATE_FORMAT_LOGS } = require('./constants');
const { INFO } = require('./logLevels');

const MAX_LEVEL_NAME_LENGTH = 7;
const LEVEL_BRACES_LENGTH = 2;
const SPACES_NUMBER = 4;
const HYPHENS_NUMBER = 2;
const DATE_LENGTH = _.size(DATE_FORMAT_LOGS);
const PREFIX_LENGTH = MAX_LEVEL_NAME_LENGTH + LEVEL_BRACES_LENGTH + SPACES_NUMBER + HYPHENS_NUMBER + DATE_LENGTH;

const dualWrite = (prefix, message, level) => {
  const fullMessage = `${prefix}${level.colorMessage(message)}\n`;
  appendFileSync(LOGS_PATH, fullMessage);
  level.write(fullMessage);
};

module.exports = (lines, level = INFO) => {
  const time = formatDate(new Date(), DATE_FORMAT_LOGS);
  const prefix = `${level.name} - ${time} - `;
  const [ firstLine, ...rest ] = lines;

  dualWrite(prefix, firstLine, level);
  _.each(rest, (line) => {
    const blankPrefix = _.pad('', PREFIX_LENGTH, ' ');
    dualWrite(blankPrefix, line, level);
  });
};
