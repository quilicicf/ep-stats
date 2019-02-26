const extractWarInfo = require('./war/extractWarInfo');
const extractTitanInfo = require('./titan/extractTitanInfo');
const extractHitInfo = require('./hit/extractHitInfo');

const PROCESSOR_TYPES = {
  INFO: 'info',
  HITS: 'hits',
};

module.exports = {
  PROCESSOR_TYPES,
  PROCESSORS: {
    TITAN_INFO: {
      type: PROCESSOR_TYPES.INFO,
      imageHeader: 'TITAN HUNT',
      processor: extractTitanInfo,
    },
    WAR_INFO: {
      type: PROCESSOR_TYPES.INFO,
      imageHeader: 'ALLIANCE',
      processor: extractWarInfo,
    },
    HITS_INFO: {
      type: PROCESSOR_TYPES.HITS,
      imageHeader: 'CHAT',
      processor: extractHitInfo,
    },
  },
};
