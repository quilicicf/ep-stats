#!/usr/bin/env node

const { google } = require('googleapis');

const readFile = require('../readFile');
const authorize = require('./authorization/authorize');
const { CREDENTIALS_PATH } = require('./authorization/config');

module.exports = async (sheetId, values, year) => {
  const credentials = await readFile(CREDENTIALS_PATH, JSON.parse);

  return new Promise((resolve, reject) => {
    authorize(credentials, (authClient) => {
      const sheets = google.sheets({ version: 'v4', auth: authClient });

      sheets.spreadsheets.values.append(
        {
          spreadsheetId: sheetId,
          range: `Wars_${year}`,
          valueInputOption: 'RAW',
          insertDataOption: 'INSERT_ROWS',
          resource: { values: [ values ] },
        },
        (error) => {
          if (error) {
            return reject(error);
          }

          return resolve();
        },
      );
    });
  });
};

