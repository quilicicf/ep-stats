const _ = require('lodash');

module.exports = (date, info, hits) => _.flatten([
  date,
  hits.totalScore,
  info.enemyScore,
  info.bonus,
  hits.participatingMembersNumber,
  _.map(hits.scores, memberScore => memberScore.score),
]);
