const _ = require('lodash');

module.exports = (date, info, hits) => _.flatten([
  date,
  hits.totalScore,
  info.life || hits.totalScore, // In case the titan was defeated and his life could not be read
  info.stars,
  info.color,
  _.map(hits.scores, memberScore => memberScore.score),
]);
