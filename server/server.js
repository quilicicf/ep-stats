#!/usr/bin/env node

const _ = require('lodash');
const multer = require('multer');
const { address } = require('ip');
const express = require('express');
const { parse: parseDate, format: formatDate } = require('date-fns');
const { resolve: resolvePath } = require('path');

const rename = require('../lib/rename');
const parseOcr = require('../lib/parseOcr');
const append = require('../lib/gsheet/append');

const [ sheetId, portOverwrite ] = process.argv.splice(2);

if (!sheetId) {
  process.stderr.write('You must give the sheet ID as first parameter\n');
  process.exit(1);
}

const PORT = portOverwrite || 12012;

const app = express();
const upload = multer({ dest: resolvePath(__dirname, 'files') });

app.get('/wars', (request, response) => response.sendFile(resolvePath(__dirname, 'website', 'wars.html')));
app.get('/wars.js', (request, response) => response.sendFile(resolvePath(__dirname, 'website', 'wars.js')));

// File input field name is simply 'file'
app.post('/', upload.single('file'), async (request, response) => {
  const { bonus, date, enemyScore } = request.body;

  const warDate = parseDate(date);
  const year = formatDate(warDate, 'yyyy');
  const formattedFullDate = formatDate(warDate, 'yyyy_mm_dd');
  const formattedDate = formatDate(warDate, 'mm_dd');

  const fileNewPath = resolvePath(__dirname, 'files', `${formattedFullDate}.png`);
  try {
    await rename(request.file.path, fileNewPath);
    process.stdout.write(`File written to ${fileNewPath}\n`);
    const scores = _.values(parseOcr(fileNewPath));
    const totalScore = _.reduce(scores, (seed, score) => (_.isNumber(score) ? seed + score : seed), 0);
    const values = [ formattedDate, totalScore, enemyScore, bonus, ...scores ];
    try {
      await append(sheetId, year, values);
      response.json({ message: 'File uploaded successfully' });

    } catch (gsheetError) {
      process.stderr.write(gsheetError);
      response.send(500);
    }

  } catch (renameError) {
    process.stderr.write(renameError);
    response.send(500);
  }
});

app.listen(PORT, () => {
  process.stdout.write(`Example app listening at http://${address()}:${PORT}\n`);
});
