const _ = require('lodash');
const formatDate = require('date-fns/format');

const log = require('./conf/log');
const { WARNING } = require('./conf/logLevels');

const parseLines = require('./image-processing/hit/parseLines');
const filterHitInfo = require('./image-processing/hit/filterHitInfo');
const parseHitInfo = require('./image-processing/hit/parseHitInfo');

const readImage = require('./image-processing/jimp/readImage');
const cropImage = require('./image-processing/jimp/crop');
const writeImage = require('./image-processing/jimp/writeImage');
const thresholdImage = require('./image-processing/jimp/thresholdLight');

const { SCREEN_TYPES: { WAR_HITS_TYPE, TITAN_HITS_TYPE }, DATE_FORMAT_GSHEET } = require('./conf/constants');
const recognize = require('./ocr/recognizeJs');
const deleteFile = require('./fs/deleteFile');
const isOnHolidays = require('./ep/isOnHolidays');
const { NOT_APPLICABLE } = require('./ep/constants');

const findActivityType = (ocrResult) => {
  if (/top titan attackers/i.test(ocrResult)) {
    return TITAN_HITS_TYPE;

  } else if (/top war attackers/i.test(ocrResult)) {
    return WAR_HITS_TYPE;

  }

  return { type: 'error', message: 'Can\'t find hits type', ocrResult };
};

module.exports = async (imagePath, imageName, screenshotProfile, members, holidays, date) => {
  const { global: { hits: hitsSize } } = screenshotProfile;

  const tempFilePath = await readImage(imagePath)
    .then(jimpImage => cropImage(jimpImage, hitsSize))
    .then(cropped => thresholdImage(cropped, { thresholdLevel: 55, shouldInvert: true }))
    .then(threshold => writeImage(threshold, `${imageName}_hits`));

  const ocrResult = await recognize(tempFilePath);

  const type = findActivityType(ocrResult);
  if (type.message) { return type; } // Could not find the type, return an error

  const parseableLines = filterHitInfo(ocrResult);
  const participatingMembersNumber = _.size(parseableLines);

  const parsedLines = parseLines(parseableLines);
  const totalScore = _.reduce(parsedLines, (seed, { score }) => seed + score, 0);
  if (_.size(parsedLines) !== _.size(parseableLines)) {
    log([ 'The total score won\'t be accurate because some lines were unparsable' ], WARNING);
  }

  const scoresByMembers = parseHitInfo(parsedLines, members);
  deleteFile(tempFilePath);

  const sortedMembersScoreList = _(scoresByMembers)
    .map((memberScore, memberPseudo) => {
      const { score } = memberScore;
      const shouldExcuseMember = score === 0 && isOnHolidays(memberPseudo, holidays, date);
      if (shouldExcuseMember) {
        log([ `Member ${memberPseudo} was on holidays on ${formatDate(date, DATE_FORMAT_GSHEET)}. Setting score to 'N/A' for that day` ]);
      }
      const patchedScore = shouldExcuseMember ? NOT_APPLICABLE : memberScore.score;
      return { ...memberScore, score: patchedScore };
    })
    .sortBy('index')
    .value();

  return {
    type,
    date: formatDate(date, DATE_FORMAT_GSHEET),
    imageName,
    totalScore,
    participatingMembersNumber,
    scores: sortedMembersScoreList,
  };
};
