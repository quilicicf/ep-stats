#!/usr/bin/env node

const _ = require('lodash');
const fs = require('fs');
const multer = require('multer');
const { address } = require('ip');
const express = require('express');
const formatDate = require('dateformat');
const { resolve: resolvePath } = require('path');

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

app.get('/', (request, response) => response.sendFile(resolvePath(__dirname, 'website', 'index.html')));
app.get('/app.js', (request, response) => response.sendFile(resolvePath(__dirname, 'website', 'app.js')));

// File input field name is simply 'file'
app.post('/', upload.single('file'), async (request, response) => {
  const now = new Date();
  const year = formatDate(now, 'yyyy');
  const formattedFullDate = formatDate(now, 'yyyy_mm_dd_HH_MM_ss');
  const formattedDate = formatDate(now, 'mm_dd');

  const fileNewPath = resolvePath(__dirname, 'files', `${formattedFullDate}.png`);
  fs.rename(request.file.path, fileNewPath, async (httpError) => {
    if (httpError) {
      process.stderr.write(httpError);
      response.send(500);
    }

    process.stdout.write(`File written to ${fileNewPath}\n`);
    const scores = _.values(parseOcr(fileNewPath));
    const totalScore = _.reduce(scores, (seed, score) => (_.isNumber(score) ? seed + score : seed), 0);
    const values = [ formattedDate, totalScore, request.body.bonus, ...scores ];
    await append(sheetId, year, values);
    response.json({ message: 'File uploaded successfully' });
  });
});

app.listen(PORT, () => {
  process.stdout.write(`Example app listening at http://${address()}:${PORT}\n`);
});
