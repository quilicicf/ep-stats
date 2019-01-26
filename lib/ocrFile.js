const executeAndReturnStdout = require('./executeAndReturnStdout');

module.exports = filePath => executeAndReturnStdout(`tesseract -psm 4 ${filePath} stdout`);
