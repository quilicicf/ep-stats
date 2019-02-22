const _ = require('lodash');
const { findBestMatch } = require('string-similarity');

module.exports = async (ocrResult, members) => {
  const membersPseudos = _.map(members, ({ pseudo }) => pseudo);
  return _(ocrResult)
    .split('\n')
    .filter(line => /^[[(][0-9]+[\])]/.test(line))
    .map(line => line.trim())
    .map((line) => {
      const regexResult = /^[[(][0-9]+[\])] (.*) ([0-9]+)$/.exec(line);
      if (!regexResult) {
        return null; // TODO: try to match members pseudos
      }

      // eslint-disable-next-line no-unused-vars
      const [ fullLine, parsedPseudo, score ] = regexResult;
      const { bestMatch } = findBestMatch(parsedPseudo, membersPseudos);
      const { rating: similarity, target: pseudo } = bestMatch;
      return {
        parsedPseudo,
        score,
        similarity,
        pseudo,
      };
    })
    .filter(member => member !== null)
    .keyBy('pseudo')
    .value();
};
