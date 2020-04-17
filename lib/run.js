const _ = require('lodash');
const min = require('date-fns/min');
const formatDate = require('date-fns/format');
const addDays = require('date-fns/addDays');
const addMonths = require('date-fns/addMonths');

const processFiles = require('./processFiles');
const pushToGsheet = require('./pushToGsheet');
const downloadScreenshots = require('./downloadScreenshots');

const availableProfiles = require('./image-processing/profiles/availableProfiles');

const listMembers = require('./ep/listMembers');
const getEvents = require('./google/gcal/getEvents');

const log = require('./conf/log');
const writeCache = require('./conf/writeCache');
const readOrCreateCache = require('./conf/readOrCreateCache');
const readOrCreateConfig = require('./conf/readOrCreateConfig');

const listPhotos = require('./google/photos/listPhotos');

module.exports = async () => {
  const cache = await readOrCreateCache();
  const { sheetId, calendarId, screenshotsSize } = await readOrCreateConfig();
  const profile = availableProfiles[ screenshotsSize ];

  const { lastCheck } = cache;
  const lastCheckAsString = formatDate(lastCheck, 'yyyy-MM-dd | HH-mm-ss', new Date());

  const startDate = addDays(lastCheck, 1); // images for lastCheck already retrieved
  // const endDate = min([ new Date(), addDays(startDate, 1) ]); // TODO: update
  const endDate = min([ new Date(), addMonths(startDate, 1) ]); // 80 screens each month, 100 pagination on Photos API
  const screenshots = await listPhotos(startDate, endDate);

  if (_.isEmpty(screenshots)) {
    log([ `No new screenshots since ${lastCheckAsString}. Going to sleep...` ]);
    return;
  }

  const members = await listMembers(sheetId);
  const holidays = await getEvents(calendarId);
  const files = await downloadScreenshots(screenshots, lastCheckAsString);
  const cacheWithProcessedItems = await processFiles(files, profile, members, cache, holidays);
  const finalCache = await pushToGsheet(cacheWithProcessedItems, sheetId);
  await writeCache({ ...finalCache, lastCheck: endDate });
};
