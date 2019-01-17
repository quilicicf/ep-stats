const _ = require('lodash');

const createLogParser = require('./createLogParser');
const executeAndReturnStdout = require('./executeAndReturnStdout');

const parseLine = (members, parseableLine) => {
  const anonymousLogParser = createLogParser({});
  const anonymousParsingResult = anonymousLogParser.parseLog(parseableLine);

  if (anonymousParsingResult.hasMatched && members[ anonymousParsingResult.pseudo ]) {
    return anonymousParsingResult;
  }

  process.stdout.write(`Manual parsing necessary for line: ${parseableLine}\n`);

  const manualMatch = _(members)
    .map(member => createLogParser(member))
    .map(logParser => logParser.parseLog(parseableLine))
    .find(parsedLog => parsedLog.hasMatched);

  if (!manualMatch) {
    throw Error(`Could not match line ${parseableLine}`);
  }

  return manualMatch;
};

const parseLines = (members, parseableLines) => {
  const parsedLines = _(parseableLines)
    .reduce(
      (seed, parseableLine) => {
        const parsedLine = parseLine(seed.members, parseableLine);
        return {
          members: _.omit(seed.members, parsedLine.pseudo), // Clean up found members to speed up the process
          scores: {
            ...seed.scores,
            [ parsedLine.pseudo ]: parsedLine.score,
          },
        };
      },
      { members, scores: {} },
    );
  return parsedLines.scores;
};

module.exports = (members, filePath) => {
  const ocrResult = executeAndReturnStdout(`tesseract -psm 4 ${filePath} stdout`);
  const parseableLines = _.filter(ocrResult.split('\n'), line => /^\[([0-9]+)]/.test(line));
  return parseLines(members, parseableLines);
};

