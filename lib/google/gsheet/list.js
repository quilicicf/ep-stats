const { google } = require('googleapis');

const authorize = require('../authorization/authorize');

module.exports = async (sheetId, range) => {
  const oauthClient = await authorize();

  return new Promise((resolve, reject) => {
    const sheets = google.sheets({ version: 'v4', auth: oauthClient });

    sheets.spreadsheets.values.get(
      { spreadsheetId: sheetId, range, majorDimension: 'COLUMNS' },
      (error, result) => {
        if (error) { return reject(Error(`Cannot list range ${range}\n${error.stack}`)); }
        return resolve(result.data.values);
      },
    );
  });
};
