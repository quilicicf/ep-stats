const { existsSync } = require('fs');

const createOauth2Client = require('./createOauth2Client');

const readFile = require('../../fs/readFile');
const { CREDENTIALS_PATH, TOKEN_PATH } = require('../../conf/constants');

const checkAuthorizationFileExistence = (filePath) => {
  if (!existsSync(filePath)) {
    process.stderr.write(`The file ${filePath} does not exist. You must initialize ep-stats before running it.\n`);
    process.exit(1);
  }
};

const authorize = async () => {
  checkAuthorizationFileExistence(CREDENTIALS_PATH);
  checkAuthorizationFileExistence(TOKEN_PATH);

  const oAuth2Client = await createOauth2Client();
  const token = await readFile(TOKEN_PATH, JSON.parse);
  oAuth2Client.setCredentials(token);
  return oAuth2Client;
};

module.exports = authorize;
