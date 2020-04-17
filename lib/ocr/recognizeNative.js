const executeAndReturnStdout = require('../utils/executeAndReturnStdout');
const { PSMS, USER_WORDS_PATH } = require('./ocrConstants');

module.exports = (filePath, psm = PSMS.FAPS_NO_OSD) => (
  executeAndReturnStdout(`tesseract ${filePath} stdout --psm ${psm.value} --user-words ${USER_WORDS_PATH}`)
);
