const { registerPrompt, prompt } = require('inquirer');
registerPrompt('datetime', require('inquirer-datepicker-prompt'));
const { format: formatDate, parse: parseDate, addDays } = require('date-fns');

const append = require('../gsheet/append');
const getFromCache = require('../../lib/cli/cache/getFromCache');
const storeInCache = require('../../lib/cli/cache/storeInCache');
const { LAST_DATE } = require('../../lib/cli/cache/cacheKeys');
const { PROCESSOR_TYPES } = require('../image-processing/imageProcessors');
const { INFO } = require('../../lib/cli/screenshotTypes');

const DATE_FORMAT = 'MM_dd';

const computeNewDate = lastDate => (
  lastDate ? addDays(parseDate(lastDate, DATE_FORMAT, new Date()), 1) : new Date()
);

module.exports = async (result, { sheetId }, cachePath) => {
  const pathInCache = result[ INFO ].activityType;
  const { [ LAST_DATE ]: lastDate } = await getFromCache(cachePath, pathInCache);

  const newDate = computeNewDate(lastDate);
  const formattedNewDate = formatDate(newDate, DATE_FORMAT);

  const answer = await prompt({
    type: 'datetime',
    name: 'date',
    initial: newDate,
    message: `The detected date is ${formattedNewDate}, is that OK?`,
    format: [ 'mm', '_', 'dd' ],
  });

  const dateToPush = formatDate(answer.date, DATE_FORMAT);
  const newCacheEntry = { [ LAST_DATE ]: dateToPush };
  await storeInCache(cachePath, pathInCache, newCacheEntry);

  const info = result[ PROCESSOR_TYPES.INFO ];
  const hits = result[ PROCESSOR_TYPES.HITS ];

  const valuesToUpload = [
    dateToPush,
    hits.totalScore,
    ...info.valuesForUpload,
    ...hits.valuesForUpload,
  ];

  try {
    await append(sheetId, info.gsheetRange, valuesToUpload);
  } catch (gsheetError) {
    process.stderr.write(gsheetError);
  }
};
