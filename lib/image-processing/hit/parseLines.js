const _ = require('lodash');

const log = require('../../conf/log');
const { WARNING } = require('../../conf/logLevels');

const LINE_REGEX = /^[[(][0-9]+[\])][1Il]? (.*) ([0-9O]+)$/;

module.exports = parsableLines => _.chain(parsableLines)
  .map(line => ({ line, regexResult: LINE_REGEX.exec(line) }))
  .filter(({ line, regexResult }) => {
    if (!regexResult) {
      log([ `Line ${line} was unparsable, the member will have a score of 'N/A'` ], WARNING);
      return false;
    }

    return true;
  })
  .map(({ line, regexResult }) => {
    const [ parsedPseudo, scoreAsString ] = regexResult.slice(1);
    const fixedScoreAsString = scoreAsString.replace(/O/, '0'); // Frequent OCR mistake
    return { line, parsedPseudo, score: parseInt(fixedScoreAsString, 10) };
  })
  .value();
