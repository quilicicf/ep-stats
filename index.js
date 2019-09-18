#!/usr/bin/env node

const _ = require('lodash');
const { red, green } = require('chalk');
const format = require('date-fns/format');
const { resolve: resolvePath } = require('path');
const { registerPrompt, prompt } = require('inquirer');
registerPrompt('datetime', require('inquirer-datepicker-prompt'));

const listMembers = require('./lib/ep/listMembers');
const uploadScore = require('./lib/ep/uploadScore');
const activityNextDayComputers = require('./lib/ep/activityNextDayComputers');

const configureOcrUserWords = require('./lib/ocr/configureOcrUserWords');

const getFromCache = require('./lib/cli/cache/getFromCache');
const storeInCache = require('./lib/cli/cache/storeInCache');
const patchConfig = require('./lib/cli/config/patchConfig');
const selectScreenshot = require('./lib/cli/selectScreenshot');
const { LAST_DATE } = require('./lib/cli/cache/cacheKeys');
const { HITS, INFO } = require('./lib/cli/screenshotTypes');

const extractHeader = require('./lib/image-processing/extractHeader');
const getInfoImageProcessor = require('./lib/image-processing/getInfoImageProcessor');
const { HITS_INFO } = require('./lib/image-processing/imageProcessors');

const { DATE_FORMAT } = require('./lib/google/constants');
const getEvents = require('./lib/google/gcal/getEvents');

const CACHE_PATH = resolvePath(__dirname, 'cache.json');
const CONFIG_PATH = resolvePath(__dirname, 'config.json');

const processInfoScreenshot = async (screenshot, members, appConfig) => {
  const header = extractHeader({ screenshot, appConfig });
  const { processor } = getInfoImageProcessor(header);
  return processor({ screenshot, members, appConfig });
};

const findEventDate = async (info, pathInCache) => {
  const { [ LAST_DATE ]: lastDate } = await getFromCache(CACHE_PATH, pathInCache);

  const newDate = activityNextDayComputers[ pathInCache ](lastDate);
  const formattedNewDate = format(newDate, DATE_FORMAT);

  const { answer } = await prompt({
    type: 'datetime',
    name: 'answer',
    initial: newDate,
    message: `The detected date is ${formattedNewDate}, is that OK?`,
    format: [ 'mm', '_', 'dd' ],
  });
  return answer;
};

const main = async () => {
  const patchedConfig = await patchConfig(CONFIG_PATH);

  const members = await listMembers(patchedConfig);
  await configureOcrUserWords(_.keys(members));

  const selectedInfoScreenshot = await selectScreenshot(patchedConfig, INFO);
  const info = await processInfoScreenshot(selectedInfoScreenshot, members, patchedConfig);
  const { activityType: pathInCache } = info;
  const eventDate = await findEventDate(info, pathInCache);
  const formattedEventDate = format(eventDate, DATE_FORMAT);

  const holidays = await getEvents(patchedConfig);

  const selectedHitsScreenshot = await selectScreenshot(patchedConfig, HITS, selectedInfoScreenshot.imageNameWithExtension);
  const hits = await HITS_INFO.processor({
    screenshot: selectedHitsScreenshot, members, holidays, date: eventDate,
  });

  await uploadScore(info, hits, patchedConfig, formattedEventDate);

  const newCacheEntry = { [ LAST_DATE ]: formattedEventDate };
  await storeInCache(CACHE_PATH, pathInCache, newCacheEntry);
};

try {
  main().then(() => process.stdout.write(green('Everything done smoothly!\n')));
} catch (error) {
  process.stderr.write(red(`You are a failure!\n${error.message}`));
}
