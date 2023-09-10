const _ = require('lodash');
const writeFile = require('../fs/writeFile');
const { USER_WORDS_PATH } = require('./ocrConstants');

module.exports = async (names) => writeFile(USER_WORDS_PATH, _.join(names, '\n'));
