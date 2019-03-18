const _ = require('lodash');
const { findBestMatch } = require('string-similarity');

const { SCREENSHOTS_SIZE } = require('../../cli/config/appConfig');

const { WAR } = require('../../ep/activityTypes');

const deleteFile = require('../../fs/deleteFile');

const ocrFile = require('../../ocr/ocrFile');
const { SINGLE_CHARACTER } = require('../../ocr/ocrConstants');

const temporaryProcessing = require('../temporaryProcessing');
const availableProfiles = require('../profiles/availableProfiles');
const createSubImageBlackAndWhiteExtractionScript = require('../imagemagick/createSubImageBlackAndWhiteExtractionScript');

const BONUSES = {
  HEAL: { name: 'HEAL', parsed: 'oh\n\f' },
  ARROW: { name: 'ARROW', parsed: '&\n\f' },
  ATTACK: { name: 'ATTACK', parsed: '4}\n\f' },
};

module.exports = (imagePath, imageName, appConfig) => {
  const screenshotSizeProfileName = appConfig[ SCREENSHOTS_SIZE.key ];
  const screenshotSizeProfile = availableProfiles[ screenshotSizeProfileName ];
  const warBonusSize = screenshotSizeProfile[ WAR ].bonus;

  const imageMagickScript = createSubImageBlackAndWhiteExtractionScript(warBonusSize);
  const tempFilePath = temporaryProcessing(imagePath, imageName, imageMagickScript);

  const parsedBonus = ocrFile(tempFilePath, SINGLE_CHARACTER);
  const { bestMatch } = findBestMatch(parsedBonus, _.map(BONUSES, ({ parsed }) => parsed));
  const { target } = bestMatch;
  deleteFile(tempFilePath);

  return _.find(BONUSES, bonus => bonus.parsed === target).name;
};
