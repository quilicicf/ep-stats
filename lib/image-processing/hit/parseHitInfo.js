const _ = require('lodash');

const log = require('../../conf/log');
const { WARNING } = require('../../conf/logLevels');

const guessMemberScoreFromLines = require('./guessMemberScoreFromLines');
const deduceUnparsableLines = require('./advanced/deduceUnparsableLines');

module.exports = (parsedLines, members) => {
  const { remainingLines, remainingMembers, memberScores } = _.reduce(
    members,
    (seed, index, pseudo) => {
      const { newLines, wasFound, memberScore } = guessMemberScoreFromLines(pseudo, seed.remainingLines, members);
      return {
        remainingLines: newLines,
        memberScores: { ...seed.memberScores, [ pseudo ]: memberScore },
        remainingMembers: wasFound ? seed.remainingMembers : { ...seed.remainingMembers, [ pseudo ]: index },
      };
    },
    { remainingLines: parsedLines, membersScores: {}, remainingMembers: {} },
  );

  if (!_.isEmpty(remainingLines) && !_.isEmpty(remainingMembers)) {
    log([ 'Attempting to match remaining lines with remaining members' ], WARNING);
    const {
      forsakenLines,
      forsakenMembers,
      miracleMemberScores,
    } = deduceUnparsableLines(remainingLines, remainingMembers);

    if (!_.isEmpty(forsakenLines)) {
      log([
        'The following lines were not matched to a member',
        ..._.map(forsakenLines, ({ line }) => `  * ${line}`),
      ], WARNING);
    }

    if (!_.isEmpty(forsakenMembers)) {
      log([
        'The following members were not matched to a line',
        ..._.map(forsakenMembers, (index, pseudo) => `  * ${pseudo}`),
      ], WARNING);
    }

    return { ...memberScores, ...miracleMemberScores };
  }

  return memberScores;
};
