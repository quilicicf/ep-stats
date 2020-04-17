#!/usr/bin/env node

const { existsSync } = require('fs');
const authorize = require('./authorize');
const { resolve: resolvePath } = require('path');

const readFile = require('../../fs/readFile');
const askQuestion = require('../../utils/askQuestion');

const CREDENTIALS_PATH = resolvePath(__dirname, 'credentials.json');

const PLEASE_DOWNLOAD_CREDENTIALS_MESSAGE = `
Please visit this page: https://developers.google.com/sheets/api/quickstart/nodejs

When you have downloaded credentials.json put it in $EP_STATS/lib/gsheet/authorization

Press ENTER when that's done`;

const main = async () => {
  if (!existsSync(CREDENTIALS_PATH)) {
    await askQuestion(PLEASE_DOWNLOAD_CREDENTIALS_MESSAGE);
  }

  try {
    const content = await readFile(CREDENTIALS_PATH, JSON.parse);
    await authorize(content);

  } catch (error) {
    process.stderr.write('Could not find credentials.json. Have you put it in $EP_STATS/lib/gsheet/authorization?\n');
  }
};

main();
