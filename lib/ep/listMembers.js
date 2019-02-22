const _ = require('lodash');

const list = require('../gsheet/list');

module.exports = async (sheetId) => {
  const rawMembers = await list(sheetId, 'Members!A2:B31');
  return _(rawMembers)
    .map(([ pseudo, regexAsString ]) => ({ pseudo, regexAsString }))
    .keyBy('pseudo')
    .value();
};

