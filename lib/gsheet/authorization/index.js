#!/usr/bin/env node

/* eslint-disable */
// This file was created by Google anyway.

const fs = require('fs');
const authorize = require('./authorize');
const listMajors = require('./listMajors');

// Load client secrets from a local file.
fs.readFile('credentials.json', (error, content) => {
  if (error) {
    return process.stdout.write(`Error loading client secret file: ${error.stack}\n`);
  }
  // Authorize a client with credentials, then call the Google Sheets API.
  return authorize(JSON.parse(content), listMajors);
});
