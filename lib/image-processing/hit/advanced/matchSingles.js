const log = require('../../../conf/log');
const { WARNING } = require('../../../conf/logLevels');

module.exports = (remainingLine, pseudo, index) => {
  const { parsedPseudo, score, line } = remainingLine;
  log([ `Matched last remaining pseudo ${pseudo} to last remaining line ${line}` ], WARNING);
  return {
    forsakenLines: [],
    forsakenMembers: {},
    miracleMemberScores: {
      [ pseudo ]: {
        pseudo,
        parsedPseudo,
        score,
        strategy: 'LAST_REMAINING',
        index,
        line,
      },
    },
  };
};
