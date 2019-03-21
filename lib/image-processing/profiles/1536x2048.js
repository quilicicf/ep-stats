const { WAR, TITAN } = require('../../ep/activityTypes');

module.exports = {
  global: {
    header: {
      width: 512,
      height: 108,
      horizontalOffset: 512,
      verticalOffset: 0,
    },
  },
  [ TITAN ]: {
    color: {
      width: 60,
      height: 60,
      horizontalOffset: 386,
      verticalOffset: 221,
    },
    stars: {
      width: 1000,
      height: 20,
      horizontalOffset: 500,
      verticalOffset: 252,
    },
    life: {
      width: 500,
      height: 49,
      horizontalOffset: 520,
      verticalOffset: 960,
    },
  },
  [ WAR ]: {
    bonus: {
      width: 44,
      height: 44,
      horizontalOffset: 1066,
      verticalOffset: 1243,
    },
    enemyScore: {
      width: 160,
      height: 40,
      horizontalOffset: 963,
      verticalOffset: 1130,
    },
  },
};
