const _ = require('lodash');
const { google } = require('googleapis');
const VerEx = require('verbal-expressions');

const readFile = require('../readFile');
const authorize = require('./authorization/authorize');
const { CREDENTIALS_PATH } = require('./authorization/config');


const REGEX_BUILDER = () => {
  const regex = VerEx()
    .startOfLine()
    .then('[')
    .beginCapture()
    .digit()
    .oneOrMore()
    .endCapture()
    .then(']')
    .maybe(' ');

  regex.endIt = () => regex
    .maybe(' ')
    .beginCapture()
    .digit()
    .oneOrMore()
    .endCapture()
    .endOfLine();

  return regex;
};

const defaultRegexCreator = name => REGEX_BUILDER().then(name).endIt();

const advancedRegexCreator = nameRegex => REGEX_BUILDER().add(nameRegex).endIt();

module.exports = async (sheetId) => {
  const credentials = await readFile(CREDENTIALS_PATH, JSON.parse);
  return new Promise((resolve, reject) => {
    authorize(credentials, (authClient) => {
      const sheets = google.sheets({ version: 'v4', auth: authClient });

      sheets.spreadsheets.values.get(
        {
          spreadsheetId: sheetId,
          range: 'Members!A2:B31',
        },
        (error, result) => {
          if (error) {
            return reject(Error('Cannot read members list'));
          }

          const results = _.map(
            result.data.values,
            ([ name, regexAsString ]) => ({
              name,
              regexAsString,
              patternCreator () {
                return regexAsString
                  ? advancedRegexCreator(regexAsString)
                  : defaultRegexCreator(name);
              },
            }),
          );
          return resolve(results);
        },
      );
    });
  });
};

