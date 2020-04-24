const _ = require('lodash');

const findBestMatch = require('./findBestMatch');

const { NOT_APPLICABLE, MINIMAL_SIMILARITY_THRESHOLD } = require('./../../conf/constants');

const buildEmptyMember = (pseudo, members) => ({
  pseudo,
  parsedPseudo: undefined,
  score: NOT_APPLICABLE,
  similarity: 0,
  index: members[ pseudo ],
  line: undefined,
});

module.exports = (pseudo, parsedLines, members) => {
  const parsedPseudos = _.map(parsedLines, ({ parsedPseudo }) => parsedPseudo);
  const { hasMatch, similarity, match } = findBestMatch(pseudo, parsedPseudos);

  if (!hasMatch) { // No more lines
    return { newLines: parsedLines, wasFound: false, memberScore: buildEmptyMember(pseudo, members) };
  }
  if (similarity >= MINIMAL_SIMILARITY_THRESHOLD) {
    const memberLine = _.find(parsedLines, ({ parsedPseudo }) => parsedPseudo === match);
    const newLines = _.filter(parsedLines, ({ parsedPseudo }) => parsedPseudo !== match);
    return {
      newLines,
      wasFound: true,
      memberScore: {
        pseudo,
        parsedPseudo: match,
        score: memberLine.score,
        similarity,
        index: members[ pseudo ],
        line: memberLine.line,
      },
    };
  }

  return { // -king。你的一, go to hell
    newLines: parsedLines,
    wasFound: false,
    memberScore: buildEmptyMember(pseudo, members),
  };
};
