const _ = require('lodash');

const guessMemberFromLine = require('./guessMemberFromLine');

module.exports = (parsableLines, members) => (
  _(parsableLines)
    .map(line => guessMemberFromLine(line, members))
    .filter(member => member !== null)
    .keyBy('pseudo')
    .value()
);
