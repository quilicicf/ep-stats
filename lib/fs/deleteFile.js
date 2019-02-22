const { unlinkSync } = require('fs');

module.exports = filePath => unlinkSync(filePath);
