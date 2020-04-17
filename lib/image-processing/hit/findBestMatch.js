const _ = require('lodash');
const { findBestMatch } = require('string-similarity');

module.exports = (pseudo, comparables) => {
  if (_.isEmpty(comparables)) {
    return { hasMatch: false };
  }

  const { bestMatch } = findBestMatch(pseudo, comparables);
  const { rating: similarity, target: match } = bestMatch;
  return { hasMatch: true, similarity, match };
};
