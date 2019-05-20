const _ = require('lodash');

const { SEPARATOR, FIELD_MAX_LENGTH } = require('./payloadLogsConfig');

module.exports = (items) => {
  process.stdout.write(`${_(items)
    .map(string => _.padStart(string, FIELD_MAX_LENGTH))
    .join(SEPARATOR)}\n`);
};
