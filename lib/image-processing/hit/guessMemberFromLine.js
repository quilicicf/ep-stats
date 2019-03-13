const _ = require('lodash');
const { findBestMatch } = require('string-similarity');

const guessMemberFromUnparsableLine = require('./guessMemberFromUnparsableLine');

module.exports = (line, members) => {
  const regexResult = /^[[(][0-9]+[\])] (.*) ([0-9]+)$/.exec(line);
  if (!regexResult) { return guessMemberFromUnparsableLine(line, members); }

  // eslint-disable-next-line no-unused-vars
  const [ fullLine, parsedPseudo, score ] = regexResult;
  const { bestMatch } = findBestMatch(parsedPseudo, _.keys(members));
  const { rating: similarity, target: pseudo } = bestMatch;
  return {
    parsedPseudo,
    score,
    similarity,
    pseudo,
    index: members[ pseudo ].index,
    line,
    guessed: false,
    confirmQuestion: undefined,
  };
};
