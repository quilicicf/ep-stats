const _ = require('lodash');
const formatDate = require('date-fns/format');

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

const { DATE_FORMAT_LOGS } = require('./conf/constants');

module.exports = async () => {
  const cache = await readOrCreateCache();
  const { sheetId, calendarId, screenshotsSize } = await readOrCreateConfig();
  const profile = availableProfiles[ screenshotsSize ];

  const { lastCheck } = cache;
  const lastCheckAsString = formatDate(lastCheck, DATE_FORMAT_LOGS, new Date());

  log([ 'Waking up from the slumber, time to work!' ]);
  const { screenshots, lastScreenshotDate } = await listPhotos(lastCheck);

  if (_.isEmpty(screenshots)) {
    log([ `No new screenshots since ${lastCheckAsString}. Going to sleep...` ]);
    return;
  }

  const members = await listMembers(sheetId);
  const holidays = await getEvents(calendarId);
  const files = await downloadScreenshots(screenshots, lastCheckAsString);
  const cacheWithProcessedItems = await processFiles(files, profile, members, cache, holidays);
  const finalCache = await pushToGsheet(cacheWithProcessedItems, sheetId);
  await writeCache({ ...finalCache, lastCheck: lastScreenshotDate });
  log([ 'Done for now, going back to sleep...' ]);
};
