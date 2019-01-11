const _ = require('lodash');
const { execSync } = require('child_process');

const scoreUser = (user, parseableLines) => {
  const result = _(parseableLines)
    .filter(parseableLine => user.patternCreator().test(parseableLine))
    .map((parseableLine) => {
      const parsedLine = user.patternCreator().exec(parseableLine);
      return { [ user.name ]: parseInt(parsedLine[ 2 ], 0) };
    })
    .first();

  return result || { [ user.name ]: 'N/A' };
};

module.exports = (members, file) => {
  const ocrResult = execSync(`tesseract -psm 4 ${file} stdout`, { encoding: 'utf8' }).replace(/\n$/, '');
  const parseableLines = _.filter(ocrResult.split('\n'), line => /^\[([0-9]+)]/.test(line));

  return _.reduce(
    members,
    (seed, user) => ({ ...seed, ...scoreUser(user, parseableLines) }),
    {},
  );
};

