const { resolve: resolvePath } = require('path');

const executeAndReturnStdout = require('../executeAndReturnStdout');
const psms = require('./psms');

const USER_WORDS_PATH = resolvePath(__dirname, 'user_words.txt');

module.exports = (filePath, psm = psms.FAPS_NO_OSD) => (
  executeAndReturnStdout(`tesseract ${filePath} stdout --psm ${psm.value} --user-words ${USER_WORDS_PATH}`)
);
