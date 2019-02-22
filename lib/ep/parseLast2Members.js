const _ = require('lodash');
const { compareTwoStrings } = require('string-similarity');

module.exports = (parsedLines, anonymousLogParser) => {
  const { members, unmatched } = parsedLines;

  const pseudo1 = _.first(members).pseudo;
  const pseudo2 = _.last(members).pseudo;

  const line1 = _.first(unmatched).line;
  const line2 = _.last(unmatched).line;

  const parsingResult1 = anonymousLogParser.parseLog(line1);
  const parsingResult2 = anonymousLogParser.parseLog(line2);

  const noneMatched = _.every([ parsingResult1, parsingResult2 ], result => !result.hasMatched);
  if (noneMatched) {
    throw Error(`Still couldn't parse lines:\n${line1}\n${line2}`);
  }

  const linesMarks = {
    [ pseudo1 ]: {
      [ line1 ]: compareTwoStrings(pseudo1, parsingResult1.pseudo),
      [ line2 ]: compareTwoStrings(pseudo1, parsingResult2.pseudo),
      getBestMatch () {
        return this[ line1 ] > this[ line2 ] ? parsingResult1 : parsingResult2;
      },
    },
    [ pseudo2 ]: {
      [ line1 ]: compareTwoStrings(pseudo2, parsingResult1.pseudo),
      [ line2 ]: compareTwoStrings(pseudo2, parsingResult2.pseudo),
      getBestMatch () {
        return this[ line1 ] > this[ line2 ] ? parsingResult1 : parsingResult2;
      },
    },
  };

  process.stdout.write(`Deducting results for ${pseudo1} & ${pseudo2} because they were the only un-matched.\n`);
  process.stdout.write(`Matching results: ${linesMarks}\n`);

  const bestMatch1 = linesMarks[ pseudo1 ].getBestMatch();
  const bestMatch2 = linesMarks[ pseudo2 ].getBestMatch();
  if (bestMatch1 === bestMatch2) {
    throw Error(`Both members were matched to same line ${bestMatch1}`);
  }

  return {
    members: [],
    unmatched: [],
    scores: [
      ...parsedLines.scores,
      {
        ...bestMatch1,
        pseudo: pseudo1,
      },
      {
        ...bestMatch2,
        pseudo: pseudo2,
      },
    ],
  };
};

