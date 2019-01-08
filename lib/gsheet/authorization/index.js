#!/usr/bin/env node

// This file was created by Google anyway.

const { resolve: resolvePath } = require('path');
const authorize = require('./authorize');
const listMajors = require('./listMajors');

const readFile = require('../../readFile');

const CREDENTIALS_PATH = resolvePath(__dirname, 'credentials.json');

const createCredentialsErrorMessage = error => `
Error loading client secret file: ${error.stack}

Please follow instructions to download the file ./credentials.json here:

https://developers.google.com/sheets/api/quickstart/nodejs
`;

const main = async () => {
  try {
    const content = await readFile(CREDENTIALS_PATH);

    // Authorize a client with credentials, then call the Google Sheets API to check that everything's OK
    return authorize(JSON.parse(content), listMajors);

  } catch (error) {
    return process.stderr.write(createCredentialsErrorMessage(error));
  }
};

main();

