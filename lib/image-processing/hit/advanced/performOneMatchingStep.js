const _ = require('lodash');
const { findBestMatch } = require('string-similarity');

const log = require('../../../conf/log');
const { WARNING } = require('../../../conf/logLevels');
const { MINIMAL_SIMILARITY_UNPARSABLE } = require('../../../conf/constants');

module.exports = (accumulator, stepIndex, stepsNumber) => {
  const {
    shouldStopEarly, remainingLines, remainingMembers, memberScores,
  } = accumulator;

  if (shouldStopEarly) { return accumulator; }

  const allBestMatches = _.reduce(
    remainingLines,
    (seed, { parsedPseudo, line, score }) => {
      const { bestMatch } = findBestMatch(parsedPseudo, _.keys(remainingMembers));
      const { rating: similarity, target: pseudo } = bestMatch;
      seed.push({
        parsedPseudo, line, score, similarity, pseudo,
      });
      return seed;
    },
    [],
  );

  const {
    parsedPseudo, line, score, similarity, pseudo,
  } = _.chain(allBestMatches)
    .sortBy('similarity')
    .last()
    .value();

  if (similarity < MINIMAL_SIMILARITY_UNPARSABLE) {
    log([
      `Stopping early, max similarity ${similarity} is below the threshold of ${MINIMAL_SIMILARITY_UNPARSABLE}`,
    ], WARNING);
    return { ...accumulator, shouldStopEarly: true };
  }

  log([
    `  * Step ${stepIndex + 1}/${stepsNumber}`,
    `    Matched line '${line}'`,
    `    To member ${pseudo}`,
    `    With a similarity of ${similarity}`,
  ], WARNING);

  const memberScore = {
    pseudo,
    parsedPseudo,
    score,
    similarity,
    strategy: 'INCREMENTAL_ELIMINATION',
    index: remainingMembers[ pseudo ],
    line,
  };
  return {
    shouldStopEarly: false,
    remainingLines: _.filter(remainingLines, (parsedLine) => parsedLine.line !== line),
    remainingMembers: _.omit(remainingMembers, pseudo),
    memberScores: { ...memberScores, [ pseudo ]: memberScore },
  };
};
