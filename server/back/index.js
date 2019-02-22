#!/usr/bin/env node

const { address } = require('ip');
const express = require('express');
const { resolve: resolvePath } = require('path');

const readFile = require('../../lib/fs/readFile');
const writeFile = require('../../lib/fs/writeFile');
const addWarsResourcesToServer = require('./wars/addWarsResourcesToServer');
const addTitansResourcesToServer = require('./titans/addTitansResourcesToServer');

const CONFIG_PATH = resolvePath(__dirname, 'config.json');

const [ sheetIdOverwrite, portOverwrite ] = process.argv.splice(2);

const main = async () => {
  const { sheetId } = await readFile(CONFIG_PATH, JSON.parse, { sheetId: undefined });

  if (!sheetId && !sheetIdOverwrite) {
    process.stderr.write('You must give the sheet ID as first parameter for a first launch\n');
    process.exit(1);
  }

  if (!sheetId && sheetIdOverwrite) {
    const config = { sheetId: sheetIdOverwrite };
    await writeFile(CONFIG_PATH, JSON.stringify(config, null, 2));
  }

  const DEFAULT_PORT = 12012;

  const app = express();
  const port = portOverwrite || DEFAULT_PORT;
  const sheetIdToUse = sheetIdOverwrite || sheetId;
  addWarsResourcesToServer(app, sheetIdToUse);
  addTitansResourcesToServer(app, sheetIdToUse);

  app.listen(port, () => {
    const baseUrl = `http://${address()}:${port}`;
    process.stdout.write(`App running:\n  Wars: ${baseUrl}/wars\n  Titans: ${baseUrl}/titans\n`);
  });
};

main();
