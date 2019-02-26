const _ = require('lodash');

const TITANS_STRENGTHS = {
  SEVEN_STARS: { value: 7, minLife: 1600000 },
  SIX_STARS: { value: 6, minLife: 1188000 },
  FIVE_STARS: { value: 5, minLife: 880000 },
  FOUR_STARS: { value: 4, minLife: 660000 },
  THREE_STARS: { value: 3, minLife: 440000 },
  TWO_STARS: { value: 2, minLife: 220000 },
  ONE_STAR: { value: 1, minLife: 0 },
};

module.exports = titanLife => _(TITANS_STRENGTHS)
  .filter(titanStrength => titanStrength.minLife < titanLife)
  .map(titanStrength => titanStrength.value)
  .first();
