const _ = require('lodash');
const formatDate = require('date-fns/format');

const {
  DATE_FORMAT_GSHEET,
  SCREEN_TYPES: {
    TITAN_INFO_TYPE, WAR_INFO_TYPE, WAR_HITS_TYPE, TITAN_HITS_TYPE,
  },
} = require('./conf/constants');
const log = require('./conf/log');
const { WARNING, ERROR } = require('./conf/logLevels');

const processHitsFile = require('./processHitsFile');
const processWarInfoFile = require('./processWarInfoFile');
const processTitanInfoFile = require('./processTitanInfoFile');

const extractHeader = require('./image-processing/extractHeader');

const TITAN_HUNT_TITLES = {
  FR: 'CHASSE AU TITAN',
  EN: 'TITAN HUNT',
};

const ALLIANCE_TITLES = {
  FR: 'ALLIANCE',
  EN: 'ALLIANCE',
};

const CHAT_TITLES = {
  FR: 'CHAT',
  EN: 'CHAT',
};

function isPageType (titles, imageHeader) {
  return !!Object.values(titles)
    .find((title) => title === imageHeader);
}

const processFile = async (imageHeader, screenshot, screenshotProfile, members, holidays, progressAsString) => {
  const { filePath, fileName, date } = screenshot;
  const dateAsString = formatDate(date, DATE_FORMAT_GSHEET);
  if (isPageType(TITAN_HUNT_TITLES, imageHeader)) {
    log([ `Starting processing of ${fileName} from ${dateAsString} as Titan (${progressAsString})` ]);
    return processTitanInfoFile(filePath, fileName, screenshotProfile);

  }
  if (isPageType(ALLIANCE_TITLES, imageHeader)) {
    log([ `Starting processing of ${fileName} from ${dateAsString} as War (${progressAsString})` ]);
    return processWarInfoFile(filePath, fileName, screenshotProfile);

  }
  if (isPageType(CHAT_TITLES, imageHeader)) {
    log([ `Starting processing of ${fileName} from ${dateAsString} as Hits (${progressAsString})` ]);
    return processHitsFile(filePath, fileName, screenshotProfile, members, holidays, date);

  }

  return { type: 'error', message: `No image processor for screenshot with header ${imageHeader}` };
};

module.exports = async (cache, screenshot, screenshotProfile, members, holidays, progressAsString) => {
  const { filePath, fileName } = screenshot;
  const imageHeader = await extractHeader(filePath, fileName, screenshotProfile);
  const result = await processFile(imageHeader, screenshot, screenshotProfile, members, holidays, progressAsString);

  const previousResult = cache[ result.type ];
  switch (result.type) {
    case WAR_INFO_TYPE:
      if (!_.isEmpty(previousResult)) {
        log([ `Two war info screens in a row, ${previousResult.imageName} was discarded` ], WARNING);
      }
      _.set(cache, [ WAR_INFO_TYPE ], result);
      break;
    case TITAN_INFO_TYPE:
      if (!_.isEmpty(previousResult)) {
        log([ `Two titan info screens in a row, ${previousResult.imageName} was discarded` ], WARNING);
      }
      _.set(cache, [ TITAN_INFO_TYPE ], result);
      break;
    case WAR_HITS_TYPE:
      if (_.isEmpty(cache[ WAR_INFO_TYPE ])) {
        log([ `No war info for the hits, ${result.imageName} was discarded` ], WARNING);
        break;
      }
      cache.processedItems.push({ ...result, ...cache[ WAR_INFO_TYPE ] });
      _.unset(cache, [ WAR_INFO_TYPE ]);
      break;
    case TITAN_HITS_TYPE:
      if (_.isEmpty(cache[ TITAN_INFO_TYPE ])) {
        log([ `No titan info for the hits, ${result.imageName} was discarded` ], WARNING);
        break;
      }
      cache.processedItems.push({ ...result, ...cache[ TITAN_INFO_TYPE ] });
      _.unset(cache, [ TITAN_INFO_TYPE ]);
      break;
    default:
      log([ `Unknown file type: ${result.type}, ignoring ${result.imageName}` ], ERROR); // TODO: handle error from processHitsFile
  }
  return cache;
};
