#!/usr/bin/env node

const { google } = require('googleapis');
const { readFile, writeFile } = require('fs');
const { createInterface } = require('readline');

const { SCOPES, TOKEN_PATH } = require('./config');

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
const getNewToken = (oAuth2Client, callback) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  process.stdout.write(`Authorize this app by visiting this url: ${authUrl}\n`);
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (questionError, token) => {
      if (questionError) {
        return process.stderr.write(`Error while trying to retrieve access token ${questionError}`);
      }

      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      writeFile(TOKEN_PATH, JSON.stringify(token), (writeError) => {
        if (writeError) process.stderr.write(writeError);
        process.stdout.write(`Token stored to ${TOKEN_PATH}\n`);
      });
      return callback(oAuth2Client);
    });
  });
};


/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
const authorize = (credentials, callback) => {
  // eslint-disable-next-line camelcase
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[ 0 ]);

  // Check if we have previously stored a token.
  readFile(TOKEN_PATH, 'utf8', (error, token) => {
    if (error) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    return callback(oAuth2Client);
  });
};

module.exports = authorize;
