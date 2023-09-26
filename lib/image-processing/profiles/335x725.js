const { WAR, TITAN } = require('../../ep/activityTypes');

module.exports = {
  global: {
    header: {
      width: 217,
      height: 25,
      horizontalOffset: 83,
      verticalOffset: 45,
    },
    hits: {
      width: 335,
      height: 531,
      horizontalOffset: 0,
      verticalOffset: 125,
    },
  },
  [ TITAN ]: {
    color: {
      width: 18,
      height: 18,
      horizontalOffset: 56,
      verticalOffset: 100,
    },
    stars1: {
      width: 185,
      height: 1,
      horizontalOffset: 86,
      verticalOffset: 115,
    },
    stars2: {
      width: 185,
      height: 1,
      horizontalOffset: 86,
      verticalOffset: 122,
    },
    life: {
      width: 125,
      height: 14,
      horizontalOffset: 105,
      verticalOffset: 317,
    },
  },
  [ WAR ]: {
    bonus: {
      width: 13,
      height: 13,
      horizontalOffset: 254,
      verticalOffset: 381,
    },
    enemyScore: {
      width: 44,
      height: 12,
      horizontalOffset: 225,
      verticalOffset: 348,
    },
  },
};
