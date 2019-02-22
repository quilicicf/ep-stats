const _ = require('lodash');
const { findBestMatch } = require('string-similarity');

const ocrFile = require('../../ocr/ocrFile');
const { SINGLE_CHARACTER } = require('../../ocr/psms');
const deleteFile = require('../../fs/deleteFile');
const temporaryProcessing = require('../temporaryProcessing');
const createSubImageBlackAndWhiteExtractionScript = require('../createSubImageBlackAndWhiteExtractionScript');

const computeBonusSize = imageSize => ({
  width: imageSize.width / 21,
  height: imageSize.height / 27,
  horizontalOffset: imageSize.width / 1.46,
  verticalOffset: imageSize.height / 1.67,
});

const BONUSES = {
  HEAL: { name: 'HEAL', parsed: 'oh\n\f' },
  ARROW: { name: 'ARROW', parsed: '&\n\f' },
  ATTACK: { name: 'ATTACK', parsed: '4}\n\f' },
};

module.exports = (imagePath, imageName, imageSize) => {
  const warBonusSize = computeBonusSize(imageSize);

  const imageMagickScript = createSubImageBlackAndWhiteExtractionScript(imageSize, warBonusSize);
  const tempFilePath = temporaryProcessing(imagePath, imageName, imageMagickScript);

  const parsedBonus = ocrFile(tempFilePath, SINGLE_CHARACTER);
  const { bestMatch } = findBestMatch(parsedBonus, _.map(BONUSES, ({ parsed }) => parsed));
  const { target } = bestMatch;
  deleteFile(tempFilePath);

  return _.find(BONUSES, bonus => bonus.parsed === target).name;
};
