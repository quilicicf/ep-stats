const _ = require('lodash');

const matchSingles = require('./matchSingles');
const matchLeftOvers = require('./matchLeftOvers');

module.exports = (remainingLines, remainingMembers) => {
  const remainingLinesNumber = _.size(remainingLines);
  const remainingMembersNumber = _.size(remainingMembers);

  if (remainingLinesNumber === 1 && remainingMembersNumber === 1) {
    const [
      [ pseudo, index ],
    ] = _.toPairs(remainingMembers);
    return matchSingles(remainingLines[ 0 ], pseudo, index);
  }

  return matchLeftOvers(remainingLines, remainingMembers);
};
