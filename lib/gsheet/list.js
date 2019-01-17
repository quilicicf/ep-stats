const { google } = require('googleapis');

const readFile = require('../readFile');
const authorize = require('./authorization/authorize');
const { CREDENTIALS_PATH } = require('./authorization/config');

module.exports = async (sheetId, range) => {
  const credentials = await readFile(CREDENTIALS_PATH, JSON.parse);
  return new Promise((resolve, reject) => {
    authorize(credentials, (authClient) => {
      const sheets = google.sheets({ version: 'v4', auth: authClient });

      sheets.spreadsheets.values.get(
        { spreadsheetId: sheetId, range },
        (error, result) => {
          if (error) {
            return reject(Error(`Cannot list range ${range}`));
          }

          return resolve(result.data.values);
        },
      );
    });
  });
};
