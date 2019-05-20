const _ = require('lodash');

const getMaxLength = require('./getMaxLength');
const { SEPARATOR } = require('./payloadLogsConfig');

module.exports = (memberPseudos, memberScores) => {
  const maxLength = getMaxLength(memberPseudos);

  const lines = _(memberPseudos)
    .map((pseudo, index) => `${_.padStart(pseudo, maxLength)}${SEPARATOR}${memberScores[ index ]}`)
    .join('\n');
  process.stdout.write(`${lines}\n`);
};
