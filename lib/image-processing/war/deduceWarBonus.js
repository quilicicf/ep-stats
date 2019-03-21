const _ = require('lodash');
const { resolve: resolvePath } = require('path');

const computeImageDistance = require('../computeImageDistance');

const BONUSES_FOLDER_NAME = 'bonuses';
const BONUSES = {
  ATTACK: resolvePath(__dirname, BONUSES_FOLDER_NAME, 'attack_24.png'),
  ARROW: resolvePath(__dirname, BONUSES_FOLDER_NAME, 'arrow_24.png'),
  HEAL: resolvePath(__dirname, BONUSES_FOLDER_NAME, 'heal_24.png'),
};

module.exports = async (extractedImagePath) => {
  const promises = _.map(
    BONUSES,
    async (bonusImagePath, name) => ({
      name, distance: await computeImageDistance(bonusImagePath, extractedImagePath),
    }),
  );

  const results = await Promise.all(promises);
  return _(results)
    .sortBy('distance')
    .map(({ name }) => name)
    .first();
};
