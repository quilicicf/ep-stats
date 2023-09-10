const { google } = require('googleapis');

const authorize = require('../authorization/authorize');

module.exports = async (sheetId, range, values) => {
  const oauthClient = await authorize();

  return new Promise((resolve, reject) => {
    const sheets = google.sheets({ version: 'v4', auth: oauthClient });

    sheets.spreadsheets.values.append(
      {
        spreadsheetId: sheetId,
        range,
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        resource: { values: [ values ] },
      },
      (error) => {
        if (error) { return reject(Error(`Cannot append data to ${sheetId}\n${error.stack}\n`)); }
        return resolve();
      },
    );
  });
};
