const _ = require('lodash');

const computeColorDistance = require('../computeColorDistance');

const TITAN_COLORS = {
  RED: {
    name: 'RED', red: 196, green: 62, blue: 49,
  },
  GREEN: {
    name: 'GREEN', red: 66, green: 162, blue: 44,
  },
  BLUE: {
    name: 'BLUE', red: 56, green: 158, blue: 230,
  },
  HOLY: {
    name: 'HOLY', red: 243, green: 215, blue: 71,
  },
  DARK: {
    name: 'DARK', red: 120, green: 44, blue: 134,
  },
};

module.exports = color => (
  _(TITAN_COLORS)
    .sortBy(titanColor => computeColorDistance(color, titanColor))
    .first()
);
