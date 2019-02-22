const extractHitInfo = require('./hit/extractHitInfo');
const extractWarInfo = require('./war/extractWarInfo');
const extractTitanInfo = require('./titan/extractTitanInfo');

module.exports = (imageHeader) => {
  if (imageHeader === 'CHAT') {
    return extractHitInfo;
  }

  if (imageHeader === 'TITAN HUNT') {
    return extractTitanInfo;
  }

  if (imageHeader === 'ALLIANCE') {
    return extractWarInfo;
  }

  throw Error('Could not find image info');
};
