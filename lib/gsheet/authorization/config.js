const { resolve: resolvePath } = require('path');

// If modifying these scopes, delete token.json.
const SCOPES = [ 'https://www.googleapis.com/auth/spreadsheets' ];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = resolvePath(__dirname, 'token.json');

const CREDENTIALS_PATH = resolvePath(__dirname, 'credentials.json');

module.exports = {
  SCOPES,
  TOKEN_PATH,
  CREDENTIALS_PATH,
};
