const _ = require('lodash');
const { findBestMatch } = require('string-similarity');

const ENDS_WITH_NUMBERS_REGEX = /([0-9]+)$/;

const extractNumbersAtEndOfPseudo = pseudo => (
  _.get(ENDS_WITH_NUMBERS_REGEX.exec(pseudo), [ '1' ], false)
);

const extractScoreFromLine = (unparsableLine, numbersAtEndOfPseudo) => (
  numbersAtEndOfPseudo
    ? _.get(new RegExp(`${numbersAtEndOfPseudo}([0-9]+)$`).exec(unparsableLine), [ '1' ], 'N/A')
    : _.get(/([0-9]+)$/.exec(unparsableLine), [ '1' ], 'N/A')
);

module.exports = (unparsableLine, membersPseudos) => {
  const { bestMatch } = findBestMatch(unparsableLine, membersPseudos);
  const { rating: similarity, target: pseudo } = bestMatch;

  const numbersAtEndOfPseudo = extractNumbersAtEndOfPseudo(pseudo);
  const score = extractScoreFromLine(unparsableLine, numbersAtEndOfPseudo);

  return {
    parsedPseudo: undefined,
    score,
    similarity,
    pseudo,
    line: unparsableLine,
    guessed: true,
    confirmQuestion: {
      type: 'input',
      message: `The score of member ${pseudo} was hard to guess, does it look good?\nCurrent value: ${score}\nLine: ${unparsableLine}`,
      name: `${pseudo}`,
      default: score,
    },
  };
};
