const { google } = require('googleapis');

const readFile = require('../../fs/readFile');
const { CREDENTIALS_PATH } = require('../../conf/constants');

module.exports = async () => {
  const credentials = await readFile(CREDENTIALS_PATH, JSON.parse);
  const { client_secret: clientSecret, client_id: clientId, redirect_uris: redirectUris } = credentials.installed;
  return new google.auth.OAuth2(clientId, clientSecret, redirectUris[ 0 ]);
};
