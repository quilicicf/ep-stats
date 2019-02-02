const _ = require('lodash');

const createLogParser = require('./createLogParser');

const anonymousLogParser = createLogParser({});

const parseLine = (members, parseableLine) => {
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
    return {
      hasMatched: false,
      message: `Could not match line ${parseableLine}`,
      line: parseableLine,
    };
  }

  return manualMatch;
};

const fixParsedLines = (parsedLines) => {
  if (_.isEmpty(parsedLines.unmatched)) {
    return parsedLines;
  }

  if (_.size(parsedLines.members) === 1) {
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
  }

  const unmatchedLines = _(parsedLines.unmatched).map(parsedLine => parsedLine.line).join('\n  ');
  throw Error(`Too many un-matched members. Failed lines:  \n${unmatchedLines}`);
};

const parseLines = (members, parseableLines) => {
  const parsedLines = _(parseableLines)
    .reduce(
      (seed, parseableLine) => {
        const parsedLine = parseLine(seed.members, parseableLine);
        if (!parsedLine.hasMatched) {
          return {
            members: seed.members,
            scores: seed.scores,
            unmatched: [ ...seed.unmatched, parsedLine ],
          };
        }

        return {
          members: _.omit(seed.members, parsedLine.pseudo), // Clean up found members to speed up the process
          scores: [
            ...seed.scores,
            { pseudo: parsedLine.pseudo, score: parsedLine.score },
          ],
          unmatched: seed.unmatched,
        };
      },
      { members, scores: [], unmatched: [] },
    );

  const fixedParsedLines = fixParsedLines(parsedLines);
  return fixedParsedLines;
};

const processRemainingMembers = remainingMembers => (
  _.map(remainingMembers, remainingMember => ({ pseudo: remainingMember.pseudo, score: 'N/A' }))
);

module.exports = (members, ocrResult, allowsNonParticipating = false) => {
  const parseableLines = _.filter(ocrResult.split('\n'), line => /^\[([0-9]+)]/.test(line));
  const parsedLines = parseLines(members, parseableLines);

  if (!allowsNonParticipating && !_.isEmpty(parsedLines.members)) {
    throw Error(`Could not match scores for members: [${_(parsedLines.members).map(member => member.pseudo).join(', ')}] `);
  }

  const fullScores = [
    ...parsedLines.scores,
    ...processRemainingMembers(parsedLines.members),
  ];

  return _(fullScores)
    .sortBy('pseudo')
    .reduce(
      (seed, { score, pseudo }) => ({ ...seed, [ pseudo ]: score }),
      {},
    );
};

