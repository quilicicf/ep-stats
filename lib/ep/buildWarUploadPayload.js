const _ = require('lodash');

const logLine = require('./logLine');
const logScores = require('./logScores');
const { WAR_FIXED_FIELDS } = require('./payloadLogsConfig');

module.exports = (date, info, hits) => {
  const memberPseudos = _.map(hits.scores, ({ pseudo }) => pseudo);

  const fixedFieldsValues = [
    date,
    hits.totalScore,
    info.enemyScore,
    info.bonus,
    hits.participatingMembersNumber,
  ];

  const memberScores = _.map(hits.scores, ({ score }) => score);

  logLine(WAR_FIXED_FIELDS);
  logLine(fixedFieldsValues);
  logScores(memberPseudos, memberScores);

  return _([ fixedFieldsValues, memberScores ])
    .flatten()
    .map(value => `${value}`)
    .value();
};
