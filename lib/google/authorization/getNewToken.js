const { prompt } = require('inquirer');

const writeFile = require('../../fs/writeFile');
const { TOKEN_PATH, SCOPES } = require('../../conf/constants');

module.exports = async (oAuth2Client) => {
  const authUrl = oAuth2Client.generateAuthUrl({ access_type: 'offline', scope: SCOPES });

  process.stdout.write(`Authorize this app by visiting this url: ${authUrl}\n`);

  const { code } = await prompt({
    type: 'input',
    message: 'Copy the code from that page and press ENTER',
    name: 'code',
  });

  return new Promise((resolve, reject) => {
    oAuth2Client.getToken(code, async (questionError, token) => {
      if (questionError) { return reject(Error(`Error while trying to retrieve access token ${questionError}`)); }

      try {
        await writeFile(TOKEN_PATH, JSON.stringify(token, null, 2));
        return resolve(token);
      } catch (writeError) {
        return reject(writeError);
      }
    });
  });
};
