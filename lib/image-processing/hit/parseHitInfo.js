const _ = require('lodash');

const log = require('../../conf/log');
const { WARNING } = require('../../conf/logLevels');

const guessMemberScoreFromLines = require('./guessMemberScoreFromLines');

module.exports = (parsedLines, members) => {
  const { currentMembers } = members;
  const { lines: remainingLines, memberScores } = _.chain(currentMembers)
    .keys()
    .reduce(
      (seed, pseudo) => {
        const { newLines, memberScore } = guessMemberScoreFromLines(pseudo, seed.lines, currentMembers);
        return { lines: newLines, memberScores: { ...seed.memberScores, [ pseudo ]: memberScore } };
      },
      { lines: parsedLines, membersScores: {} },
    )
    .value();

  if (!_.isEmpty(remainingLines)) {
    // TODO: try to handle remaining lines by a reverse-search
    log([ 'The following lines were not matched to a member', ..._.map(remainingLines, ({ line }) => line) ], WARNING);
  }

  return memberScores;
};
