const _ = require('lodash');
const { resolve: resolvePath } = require('path');

const ocrFile = require('../../ocr/ocrFile');
const readFile = require('../../fs/readFile');
const parseHitInfo = require('./parseHitInfo');
const deleteFile = require('../../fs/deleteFile');
const listMembers = require('../../ep/listMembers');
const temporaryProcessing = require('../temporaryProcessing');

const CONFIG_PATH = resolvePath(__dirname, '..', '..', '..', 'config.json');

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

module.exports = async (imagePath, imageName) => {
  const imageMagickScript = createImageMagickScript();
  const tempFilePath = temporaryProcessing(imagePath, imageName, imageMagickScript);

  const ocrResult = ocrFile(tempFilePath);

  const config = await readFile(CONFIG_PATH, JSON.parse);
  const members = await listMembers(config.sheetId);

  const scoresByMembers = await parseHitInfo(ocrResult, members);
  const completeMembers = completeNonPlayingMembers(scoresByMembers, members);
  deleteFile(tempFilePath);

  return _.sortBy(completeMembers, 'pseudo');
};
