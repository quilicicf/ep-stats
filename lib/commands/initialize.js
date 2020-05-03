const { prompt } = require('inquirer');
const { parse: parsePath } = require('path');
const { existsSync, unlinkSync } = require('fs');

const { homepage } = require('../../package.json');

const getNewToken = require('../google/authorization/getNewToken');
const createOauth2Client = require('../google/authorization/createOauth2Client');

const masterCommandName = require('../masterCommandName');
const { CREDENTIALS_PATH, TOKEN_PATH } = require('../conf/constants');

const command = parsePath(__filename).name;
const aliases = [ command.charAt(0) ];
const describe = 'Initialize the connection to Google APIs';

const DOC_URL = `${homepage}#create-your-google-project`;

const builder = yargs => yargs
  .usage(`USAGE: ${masterCommandName} ${command} [options]`)
  .help();

const handler = async () => {
  process.stdout.write(`Read the README instructions to create your Google project first: ${DOC_URL}\n`);
  const { shouldContinue } = await prompt({
    type: 'confirm',
    message: `Acknowledge once the credentials file is copied to ${CREDENTIALS_PATH} or abort`,
    name: 'shouldContinue',
  });

  if (!shouldContinue) {
    process.stdout.write('Aborting...\n');
    process.exit(0);
  }

  if (existsSync(TOKEN_PATH)) { unlinkSync(TOKEN_PATH); } // This file cause issues if the token was revoked

  try {
    process.stdout.write('You will now need to allow your Google project to access your data\n');
    process.stdout.write('This project can\'t work without the spreadsheet/photos data of course.\n');
    process.stdout.write('For the calendar data, only accept it if you want to use the holiday feature.\n');
    const oAuth2Client = await createOauth2Client();
    await getNewToken(oAuth2Client);
    process.stdout.write('You\'re good to go, you can run the parser now\n');

  } catch (error) {
    process.stderr.write(`Could not get a new token, got error: ${error.stack}\n`);
    process.exit(1);
  }
};

module.exports = {
  command,
  aliases,
  describe,

  builder,
  handler,
};
