const _ = require('lodash');

const guessMemberFromLine = require('./guessMemberFromLine');

module.exports = (ocrResult, members) => {
  const membersPseudos = _.map(members, ({ pseudo }) => pseudo);
  return _(ocrResult)
    .split('\n')
    .filter(line => /^[[(][0-9]+[\])]/.test(line))
    .map(line => line.trim())
    .map(line => guessMemberFromLine(line, membersPseudos))
    .filter(member => member !== null)
    .keyBy('pseudo')
    .value();
};
