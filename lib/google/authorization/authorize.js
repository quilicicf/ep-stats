const { google } = require('googleapis');
const { createInterface } = require('readline');
const { resolve: resolvePath } = require('path');

const readFile = require('../../fs/readFile');
const writeFile = require('../../fs/writeFile');

const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/calendar.events.readonly',
  'https://www.googleapis.com/auth/photoslibrary.readonly',
];
const CREDENTIALS_PATH = resolvePath(__dirname, 'authorization', 'credentials.json');
const TOKEN_PATH = resolvePath(__dirname, 'authorization', 'token.json');

const getNewToken = async oAuth2Client => new Promise(((resolve, reject) => {
  const authUrl = oAuth2Client.generateAuthUrl({ access_type: 'offline', scope: SCOPES });

  process.stdout.write(`Authorize this app by visiting this url: ${authUrl}\n`);

  const rl = createInterface({ input: process.stdin, output: process.stdout });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (questionError, token) => {
      if (questionError) { return reject(Error(`Error while trying to retrieve access token ${questionError}`)); }

      return writeFile(TOKEN_PATH, JSON.stringify(token))
        .then(() => resolve(token))
        .catch((writeError) => {
          if (writeError) process.stderr.write(writeError);
          process.stdout.write(`Token stored to ${TOKEN_PATH}\n`);
        });
    });
  });
}));

const readTokenOrGetANewOne = async (oAuth2Client) => {
  try {
    return await readFile(TOKEN_PATH, JSON.parse); // If we already have one, maybe it's not expired yet
  } catch (error) {
    return getNewToken(oAuth2Client); // Else let's refresh it
  }
};

const authorize = async () => {
  const credentials = await readFile(CREDENTIALS_PATH, JSON.parse);
  const { client_secret: clientSecret, client_id: clientId, redirect_uris: redirectUris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUris[ 0 ]);

  const token = await readTokenOrGetANewOne(oAuth2Client);
  oAuth2Client.setCredentials(token);
  return oAuth2Client;
};

module.exports = authorize;
