const { registerPrompt, prompt } = require('inquirer');
registerPrompt('datetime', require('inquirer-datepicker-prompt'));
const { format: formatDate, parse: parseDate, addDays } = require('date-fns');

const buildTitanUploadPayload = require('./buildTitanUploadPayload');

const append = require('../gsheet/append');
const getFromCache = require('../../lib/cli/cache/getFromCache');
const storeInCache = require('../../lib/cli/cache/storeInCache');
const { LAST_DATE } = require('../../lib/cli/cache/cacheKeys');
const { INFO, HITS } = require('../../lib/cli/screenshotTypes');

const { TITAN, WAR } = require('../../lib/ep/activityTypes');

const DATE_FORMAT = 'MM_dd';

const PAYLOAD_BUILDERS = {
  [ TITAN ]: buildTitanUploadPayload,
};

const computeNewDate = lastDate => (
  lastDate ? addDays(parseDate(lastDate, DATE_FORMAT, new Date()), 1) : new Date()
);

module.exports = async (result, { sheetId }, cachePath) => {
  const info = result[ INFO ];
  const hits = result[ HITS ];

  const { activityType } = info;
  const pathInCache = activityType;
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
  const payloadBuilder = PAYLOAD_BUILDERS[ info.activityType ];
  const payload = payloadBuilder(dateToPush, info, hits);

  try {
    await append(sheetId, info.gsheetRange, payload);
  } catch (gsheetError) {
    process.stderr.write(gsheetError);
  }

  const newCacheEntry = { [ LAST_DATE ]: dateToPush };
  await storeInCache(cachePath, pathInCache, newCacheEntry);
};
