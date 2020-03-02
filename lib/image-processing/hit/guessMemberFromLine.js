const _ = require('lodash');
const { findBestMatch } = require('string-similarity');

const guessMemberFromUnparsableLine = require('./guessMemberFromUnparsableLine');

module.exports = (line, members) => {
  const regexResult = /^[[(][0-9]+[\])][1Il]? (.*) ([0-9]+)$/.exec(line);
  if (!regexResult) { return guessMemberFromUnparsableLine(line, members); }

  const [ parsedPseudo, score ] = regexResult.splice(1);
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
