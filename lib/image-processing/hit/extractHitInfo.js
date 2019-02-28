const _ = require('lodash');
const { prompt } = require('inquirer');

const ocrFile = require('../../ocr/ocrFile');
const parseHitInfo = require('./parseHitInfo');
const deleteFile = require('../../fs/deleteFile');
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
    (seed, { pseudo }) => (_.has(seed, pseudo) ? seed : { ...seed, [ pseudo ]: { pseudo, score: 'N/A' } }),
    scoresByMembers,
  )
);

module.exports = async ({ imagePath, imageName, members }) => {
  const imageMagickScript = createImageMagickScript();
  const tempFilePath = temporaryProcessing(imagePath, imageName, imageMagickScript);

  const ocrResult = ocrFile(tempFilePath);

  const scoresByMembers = parseHitInfo(ocrResult, members);
  const completeMemberScores = completeNonPlayingMembers(scoresByMembers, members);
  deleteFile(tempFilePath);

  const confirmQuestions = _(completeMemberScores)
    .map(memberScore => memberScore.confirmQuestion)
    .filter(question => !!question)
    .value();

  const resultFixer = await prompt(confirmQuestions);

  const sortedMembersScoreList = _(completeMemberScores)
    .map((memberScore, memberPseudo) => ({
      ...memberScore,
      score: resultFixer[ memberPseudo ] || memberScore.score,
    }))
    .sortBy('pseudo')
    .value();

  const totalScore = _(sortedMembersScoreList)
    .map(({ score }) => (score === NOT_APPLICABLE ? 0 : parseInt(score, 10)))
    .reduce((seed, score) => seed + score, 0);
  return {
    totalScore,
    scores: sortedMembersScoreList,
    valuesForUpload: _.map(sortedMembersScoreList, memberScore => memberScore.score),
  };
};
