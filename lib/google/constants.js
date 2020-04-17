const { resolve: resolvePath } = require('path');

module.exports = {
  DATE_FORMAT: 'MM_dd',
  SCOPES: [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/calendar.events.readonly',
    'https://www.googleapis.com/auth/photoslibrary.readonly',
  ],
  CREDENTIALS_PATH: resolvePath(__dirname, 'authorization', 'credentials.json'),
  TOKEN_PATH: resolvePath(__dirname, 'authorization', 'token.json'),
};
