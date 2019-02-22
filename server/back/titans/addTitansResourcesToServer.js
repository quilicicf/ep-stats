const _ = require('lodash');
const multer = require('multer');
const { resolve: resolvePath } = require('path');
const { parse: parseDate, format: formatDate } = require('date-fns');

const rename = require('../../../lib/fs/rename');
const ocrFile = require('../../../lib/ocr/ocrFile');
const parseOcr = require('../../../lib/ep/parseOcr');
const append = require('../../../lib/gsheet/append');
const listMembers = require('../../../lib/ep/listMembers');

const { DAY_ID_FORMAT } = require('../constants');

const TITANS_PATH = 'titans';

const upload = multer({ dest: resolvePath(__dirname, 'files') });

module.exports = (app, sheetId) => {

  // CORS
  app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

  // File input field name is simply 'file'
  app.post(`/${TITANS_PATH}`, upload.single('file'), async (request, response) => {
    const {
      color,
      stars,
      life,
      date,
    } = request.body;

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

    } catch (renameError) {
      process.stderr.write(renameError);
      response.status(500);
      response.send(renameError.message);
    }

    const members = await listMembers(sheetId);

    try {
      const ocrResult = ocrFile(fileNewPath);
      const scoresByNames = parseOcr(members, ocrResult);
      const scores = _.values(scoresByNames);
      const totalScore = _.reduce(scores, (seed, score) => (_.isNumber(score) ? seed + score : seed), 0);

      if (totalScore > life) {
        response.status(422);
        response.send(`Titan life is ${life}, total score is ${totalScore}. We had a problem Houston`);
        return;
      }

      const values = [ formattedDate, totalScore, life, stars, color, ...scores ];

      const range = `Titans_${year}`;
      try {
        await append(sheetId, range, values);
        response.json({ message: 'File uploaded successfully' });

      } catch (gsheetError) {
        process.stderr.write(gsheetError);
        response.status(500);
        response.send(gsheetError.message);
      }
    } catch (parsingError) {
      process.stderr.write(parsingError);
      response.status(500);
      response.send(parsingError.message);
    }
  });
};
