const _ = require('lodash');
const { prompt } = require('inquirer');

const filterHitInfo = require('./filterHitInfo');
const parseHitInfo = require('./parseHitInfo');

const recognize = require('../../ocr/recognizeJs');
const deleteFile = require('../../fs/deleteFile');
const isOnHolidays = require('../../ep/isOnHolidays');
const { NOT_APPLICABLE } = require('../../ep/constants');
const temporaryProcessing = require('../temporaryProcessing');

const createImageMagickScript = () => (
  (imagePath, outputPath) => (
    `convert \
      "${imagePath}" \
      -write mpr:P1 \
      +delete \
      -respect-parentheses \
        \\( mpr:P1 -fuzz 15% -fill white -opaque '#BAD5EE' +write mpr:P2 \\) \
        \\( mpr:P2 -fuzz 2% -fill white -opaque '#020708'  +write mpr:P3 \\) \
        \\( mpr:P3 -threshold 90% -negate                  +write "${outputPath}" \\) \
        null:
    `)
);

const completeNonPlayingMembers = (scoresByMembers, members) => (
  _.reduce(
    members,
    (seed, { pseudo, index }) => (
      _.has(seed, pseudo)
        ? seed
        : {
          ...seed,
          [ pseudo ]: {
            pseudo,
            index,
            score: NOT_APPLICABLE,
          },
        }
    ),
    scoresByMembers,
  )
);

// eslint-disable-next-line object-curly-newline
module.exports = async ({ screenshot, members, holidays, date }) => {
  const { imagePath, imageName } = screenshot;
  const imageMagickScript = createImageMagickScript();
  const tempFilePath = temporaryProcessing(imagePath, imageName, imageMagickScript);

  const ocrResult = await recognize(tempFilePath);

  const parseableLines = filterHitInfo(ocrResult);
  const participatingMembersNumber = _.size(parseableLines);

  const scoresByMembers = parseHitInfo(parseableLines, members);
  const completeMemberScores = completeNonPlayingMembers(scoresByMembers, members);
  deleteFile(tempFilePath);

  const { confirmQuestions, automaticScoresPatchers } = _(completeMemberScores)
    .reduce(
      (seed, { confirmQuestion, guessed, score }, pseudo) => {
        if (!guessed && score !== NOT_APPLICABLE && score > 0) { return seed; }
        if (isOnHolidays(pseudo, holidays, date)) {
          return { ...seed, automaticScoresPatchers: { ...seed.automaticScoresPatchers, [ pseudo ]: NOT_APPLICABLE } };
        }
        if (!guessed) { return seed; }
        return { ...seed, confirmQuestions: [ ...seed.confirmQuestions, confirmQuestion ] };
      },
      { confirmQuestions: [], automaticScoresPatchers: {} },
    );

  const manualScoresPatchers = await prompt(confirmQuestions);

  const sortedMembersScoreList = _(completeMemberScores)
    .map((memberScore, memberPseudo) => {
      const patchedScore = automaticScoresPatchers[ memberPseudo ]
        || manualScoresPatchers[ memberPseudo ]
        || memberScore.score;
      return { ...memberScore, score: patchedScore };
    })
    .sortBy('index')
    .value();

  const totalScore = _(sortedMembersScoreList)
    .map(({ score }) => (score === NOT_APPLICABLE ? 0 : parseInt(score, 10)))
    .reduce((seed, score) => seed + score, 0);

  return {
    totalScore,
    participatingMembersNumber,
    scores: sortedMembersScoreList,
  };
};
