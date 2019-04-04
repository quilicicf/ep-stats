#!/usr/bin/env node

const { watch } = require('chokidar');
const { resolve: resolvePath } = require('path');

const renderElm = require('./build/renderElm');
const renderSass = require('./build/renderSass');

const {
  SERVER_APP_PATH, SERVER_DIR_PATH, APP_ENTRY_POINT, STYLE_ENTRY_POINT,
} = require('./build/constants');

const ELM_FILES_GLOB = resolvePath(SERVER_APP_PATH, '**', '*.elm');
const STYLE_FILES_GLOB = resolvePath(SERVER_APP_PATH, '**', '*.scss');

const main = async () => {
  const elmWatcher = watch(
    [ APP_ENTRY_POINT, ELM_FILES_GLOB ],
    { cwd: SERVER_DIR_PATH },
  );

  elmWatcher
    .on('add', renderElm)
    .on('change', renderElm)
    // .on('unlink', renderElm) TODO needed?
    .on('ready', renderElm);

  const sassWatcher = watch(
    [ STYLE_ENTRY_POINT, STYLE_FILES_GLOB ],
    { cwd: SERVER_DIR_PATH },
  );

  sassWatcher
    .on('add', renderSass)
    .on('change', renderSass)
    // .on('unlink', renderSass) TODO needed?
    .on('ready', renderSass);
};

try {
  main();
} catch (error) {
  throw error;
}
