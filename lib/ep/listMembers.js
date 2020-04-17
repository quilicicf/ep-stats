const _ = require('lodash');

const list = require('../google/gsheet/list');

const indexPseudos = pseudos => _.reduce(
  pseudos,
  (seed, pseudo, index) => {
    _.set(seed, [ pseudo ], index);
    return seed;
  },
  {},
);

module.exports = async (sheetId) => {
  const [ currentPseudos, oldPseudos ] = await list(sheetId, 'Members!A2:B');
  return {
    currentMembers: indexPseudos(currentPseudos),
    oldMembers: indexPseudos(oldPseudos),
  };
};

