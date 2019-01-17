const _ = require('lodash');
const VerEx = require('verbal-expressions');

const processLog = (regexResult) => {
  if (!regexResult) {
    return { hasMatched: false };
  }
  const [ rank, pseudo, score ] = _.drop(regexResult);
  return {
    hasMatched: true,
    rank,
    pseudo,
    score,
  };
};

const initRegex = () => {
  const regex = VerEx()
    .startOfLine()
    .then('[')
    .beginCapture()
    .digit()
    .oneOrMore()
    .endCapture()
    .then(']')
    .maybe(' ')
    .beginCapture();

  regex.endIt = () => regex
    .endCapture()
    .maybe(' ')
    .beginCapture()
    .digit()
    .oneOrMore()
    .endCapture()
    .endOfLine();

  regex.parseLog = log => processLog(regex.exec(log));

  return regex;
};

module.exports = ({ pseudo = '', regexAsString = '' }) => {
  if (regexAsString) { return initRegex().add(regexAsString).endIt(); }

  if (pseudo) {
    return initRegex().then(pseudo).endIt();
  }

  return initRegex().anythingBut(' ').endIt();
};
