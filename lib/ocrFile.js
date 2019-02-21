const executeAndReturnStdout = require('./executeAndReturnStdout');

module.exports = filePath => executeAndReturnStdout(`tesseract ${filePath} stdout -psm 4`);
