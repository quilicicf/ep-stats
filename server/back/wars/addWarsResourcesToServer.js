const _ = require('lodash');
const multer = require('multer');
const { resolve: resolvePath } = require('path');
const { parse: parseDate, format: formatDate } = require('date-fns');

const rename = require('../../../lib/rename');
const parseOcr = require('../../../lib/parseOcr');
const append = require('../../../lib/gsheet/append');
const listMembers = require('../../../lib/listMembers');

const { DAY_ID_FORMAT } = require('../constants');

const WARS_PATH = 'wars';

const upload = multer({ dest: resolvePath(__dirname, 'files') });

module.exports = (app, sheetId) => {

  // CORS
  app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

  // File input field name is simply 'file'
  app.post(`/${WARS_PATH}`, upload.single('file'), async (request, response) => {
    const { bonus, date, enemyScore } = request.body;

    const titanDate = parseDate(date, DAY_ID_FORMAT, new Date());
    const year = formatDate(titanDate, 'yyyy');
    const month = formatDate(titanDate, 'MM');
    const day = formatDate(titanDate, 'dd');
    const formattedFullDate = `${year}_${month}_${day}`;
    const formattedDate = `${month}_${day}`;

    const fileNewPath = resolvePath(__dirname, 'files', `${formattedFullDate}.png`);
    try {
      await rename(request.file.path, fileNewPath);
      process.stdout.write(`File written to ${fileNewPath}\n`);

      const members = await listMembers(sheetId);
      const scoresByNames = parseOcr(members, fileNewPath);
      const scores = _.values(scoresByNames);
      const totalScore = _.reduce(scores, (seed, score) => (_.isNumber(score) ? seed + score : seed), 0);
      const values = [ formattedDate, totalScore, enemyScore, bonus, ...scores ];

      const range = `Wars_${year}`;
      try {
        await append(sheetId, range, values);
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
};
