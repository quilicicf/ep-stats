const _ = require('lodash');

const log = require('./conf/log');
const {
  FIXED_FIELDS,
  SCREEN_TYPES: { WAR_INFO_TYPE },
  RANGES: { TITAN_RANGE, WAR_RANGE },
} = require('./conf/constants');

const append = require('./google/gsheet/append');
const stringifyAll = require('./utils/stringifyAll');

module.exports = async (cache, sheetId) => {
  const itemsToPush = [ ...cache.processedItems ];
  await _.reduce(
    itemsToPush,
    (seed, processedItem) => seed
      .then(async () => {
        const fixedFields = _.values(processedItem.type === WAR_INFO_TYPE ? FIXED_FIELDS.WAR : FIXED_FIELDS.TITAN);
        const fixedFieldsValues = _(processedItem).pick(fixedFields).values().value();
        const memberScores = _.map(processedItem.scores, ({ score }) => score);

        log([ `Pushing values for image ${processedItem.imageName}` ]);
        const gsheetRange = processedItem.type === WAR_INFO_TYPE ? WAR_RANGE : TITAN_RANGE;
        await append(sheetId, gsheetRange, stringifyAll([ ...fixedFieldsValues, ...memberScores ]));
      }),
    Promise.resolve(),
  );

  return { ...cache, processedItems: [] };
};
