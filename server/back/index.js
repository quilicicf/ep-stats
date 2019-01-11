#!/usr/bin/env node

const { address } = require('ip');
const express = require('express');

const addWarsResourcesToServer = require('./wars/addWarsResourcesToServer');
const addTitansResourcesToServer = require('./titans/addTitansResourcesToServer');

const [ sheetId, portOverwrite ] = process.argv.splice(2);

if (!sheetId) {
  process.stderr.write('You must give the sheet ID as first parameter\n');
  process.exit(1);
}

const DEFAULT_PORT = 12012;

const app = express();
const port = portOverwrite || DEFAULT_PORT;
addWarsResourcesToServer(app, sheetId);
addTitansResourcesToServer(app, sheetId);

app.listen(port, () => {
  const baseUrl = `http://${address()}:${port}`;
  process.stdout.write(`App running:\n  Wars: ${baseUrl}/wars\n  Titans: ${baseUrl}/titans\n`);
});
