const _ = require('lodash');

const logLine = require('./logLine');
const logScores = require('./logScores');
const { TITAN_FIXED_FIELDS } = require('./payloadLogsConfig');

module.exports = (date, info, hits) => {
  const memberPseudos = _.map(hits.scores, ({ pseudo }) => pseudo);

  const fixedFieldsValues = [
    date,
    hits.totalScore,
    info.life || hits.totalScore, // In case the titan was defeated and his life could not be read
    info.stars,
    info.color,
    hits.participatingMembersNumber,
  ];

  const memberScores = _.map(hits.scores, ({ score }) => score);
  const payload = _.flatten([ fixedFieldsValues, memberScores ]);

  logLine(TITAN_FIXED_FIELDS);
  logLine(fixedFieldsValues);
  logScores(memberPseudos, memberScores);

  return payload;
};
