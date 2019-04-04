const { resolve: resolvePath } = require('path');

const SERVER_DIR_PATH = resolvePath(__dirname, '..', 'server');
const SERVER_APP_PATH = resolvePath(__dirname, '..', 'server');
const SERVER_DIST_PATH = resolvePath(SERVER_DIR_PATH, 'dist');

module.exports = {
  SERVER_APP_PATH,

  SERVER_DIR_PATH,
  APP_ENTRY_POINT: resolvePath(SERVER_DIR_PATH, 'app.elm'),
  STYLE_ENTRY_POINT: resolvePath(SERVER_DIR_PATH, 'app.scss'),

  SERVER_DIST_PATH,
  APP_OUTPUT_PATH: resolvePath(SERVER_DIST_PATH, 'app.js'),
  STYLE_OUTPUT_PATH: resolvePath(SERVER_DIST_PATH, 'app.css'),
};
