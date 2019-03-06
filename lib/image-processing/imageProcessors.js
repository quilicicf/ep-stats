const extractWarInfo = require('./war/extractWarInfo');
const extractTitanInfo = require('./titan/extractTitanInfo');
const extractHitInfo = require('./hit/extractHitInfo');

const { INFO, HITS } = require('../cli/screenshotTypes');

module.exports = {
  PROCESSORS: {
    TITAN_INFO: {
      type: INFO,
      imageHeader: 'TITAN HUNT',
      processor: extractTitanInfo,
    },
    WAR_INFO: {
      type: INFO,
      imageHeader: 'ALLIANCE',
      processor: extractWarInfo,
    },
    HITS_INFO: {
      type: HITS,
      imageHeader: 'CHAT',
      processor: extractHitInfo,
    },
  },
};
