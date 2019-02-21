const _ = require('lodash');

module.exports = (parsedLines, anonymousLogParser) => {
  const lastMember = _(parsedLines.members).values().first();
  const lastUnmatched = _.first(parsedLines.unmatched);
  process.stdout.write(`Deducting result for ${lastMember.pseudo} because it was the only un-matched. Line: ${lastUnmatched.line}\n`);

  const anonymousParsingResult = anonymousLogParser.parseLog(lastUnmatched.line);
  if (!anonymousParsingResult.hasMatched) {
    throw Error(`Still couldn't parse line ${lastUnmatched.line}`);
  }

  return {
    members: [],
    unmatched: [],
    scores: [
      ...parsedLines.scores,
      {
        ...anonymousParsingResult,
        pseudo: lastMember.pseudo,
      },
    ],
  };
};
