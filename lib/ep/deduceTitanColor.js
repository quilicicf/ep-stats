const _ = require('lodash');

const computeColorDistance = require('../computeColorDistance');

const TITAN_COLORS = {
  FIRE: {
    name: 'FIRE', red: 196, green: 62, blue: 49,
  },
  ICE: {
    name: 'ICE', red: 56, green: 158, blue: 230,
  },
  NATURE: {
    name: 'NATURE', red: 66, green: 162, blue: 44,
  },
  DARK: {
    name: 'DARK', red: 120, green: 44, blue: 134,
  },
  HOLY: {
    name: 'HOLY', red: 243, green: 215, blue: 71,
  },
};

module.exports = color => (
  _(TITAN_COLORS)
    .sortBy(titanColor => computeColorDistance(color, titanColor))
    .first()
);
