const { registerPrompt, prompt } = require('inquirer');
registerPrompt('datetime', require('inquirer-datepicker-prompt'));
const format = require('date-fns/format');

const buildTitanUploadPayload = require('./buildTitanUploadPayload');
const buildWarUploadPayload = require('./buildWarUploadPayload');

const append = require('../google/gsheet/append');
const { DATE_FORMAT } = require('../google/constants');

const getFromCache = require('../cli/cache/getFromCache');
const storeInCache = require('../cli/cache/storeInCache');
const { LAST_DATE } = require('../cli/cache/cacheKeys');
const { INFO, HITS } = require('../cli/screenshotTypes');

const { TITAN, WAR } = require('../ep/activityTypes');
const activityNextDayComputers = require('../ep/activityNextDayComputers');

const PAYLOAD_BUILDERS = {
  [ TITAN ]: buildTitanUploadPayload,
  [ WAR ]: buildWarUploadPayload,
};

module.exports = async (result, { sheetId }, cachePath) => {
  const info = result[ INFO ];
  const hits = result[ HITS ];

  const { activityType } = info;
  const pathInCache = activityType;
  const { [ LAST_DATE ]: lastDate } = await getFromCache(cachePath, pathInCache);

  const newDate = activityNextDayComputers[ activityType ](lastDate);
  const formattedNewDate = format(newDate, DATE_FORMAT);

  const answer = await prompt({
    type: 'datetime',
    name: 'date',
    initial: newDate,
    message: `The detected date is ${formattedNewDate}, is that OK?`,
    format: [ 'mm', '_', 'dd' ],
  });

  const dateToPush = format(answer.date, DATE_FORMAT);
  const payloadBuilder = PAYLOAD_BUILDERS[ info.activityType ];
  const payload = payloadBuilder(dateToPush, info, hits);

  await append(sheetId, info.gsheetRange, payload);

  const newCacheEntry = { [ LAST_DATE ]: dateToPush };
  await storeInCache(cachePath, pathInCache, newCacheEntry);
  return payload;
};
