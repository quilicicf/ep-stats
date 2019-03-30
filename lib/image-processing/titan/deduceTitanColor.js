const _ = require('lodash');

const titanColors = require('../../ep/titanColors');
const computeColorDistance = require('../computeColorDistance');

module.exports = color => (
  _(titanColors)
    .sortBy(titanColor => computeColorDistance(color, titanColor))
    .first()
);
