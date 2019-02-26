const { findBestMatch } = require('string-similarity');

const guessMemberFromUnparsableLine = require('./guessMemberFromUnparsableLine');

module.exports = (line, membersPseudos) => {
  const regexResult = /^[[(][0-9]+[\])] (.*) ([0-9]+)$/.exec(line);
  if (!regexResult) { return guessMemberFromUnparsableLine(line, membersPseudos); }

  // eslint-disable-next-line no-unused-vars
  const [ fullLine, parsedPseudo, score ] = regexResult;
  const { bestMatch } = findBestMatch(parsedPseudo, membersPseudos);
  const { rating: similarity, target: pseudo } = bestMatch;
  return {
    parsedPseudo,
    score,
    similarity,
    pseudo,
    line,
    guessed: false,
    confirmQuestion: undefined,
  };
};
