const _ = require('lodash');
const { appendFileSync } = require('fs');
const formatDate = require('date-fns/format');

const { LOGS_PATH } = require('./constants');
const { INFO } = require('./logLevels');

const dualWrite = (line, level) => {
  appendFileSync(LOGS_PATH, line);
  level.write(line);
};

module.exports = (lines, level = INFO) => {
  const time = formatDate(new Date(), 'yyyy-MM-dd | HH-mm-ss');
  const prefix = `[${level.name}] - ${time} - `;
  const prefixSize = _.size(prefix);
  const [ firstLine, ...rest ] = lines;

  dualWrite(`${prefix}${firstLine}\n`, level);
  _.each(rest, (line) => {
    const blankPrefix = _.pad('', prefixSize, ' ');
    dualWrite(`${blankPrefix}${line}\n`, level);
  });
};
