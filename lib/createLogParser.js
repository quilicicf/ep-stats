const _ = require('lodash');
const VerEx = require('verbal-expressions');

module.exports = ({ pseudo = '', regexAsString = '' }) => ({
  verbalExpression: VerEx()
    .startOfLine()
    .then('[')
    .beginCapture()
    .digit()
    .oneOrMore()
    .endCapture()
    .then(']')
    .maybe(' ')
    .beginCapture()
    .add(regexAsString || pseudo || '[^ ]+')
    .endCapture()
    .maybe(' ')
    .beginCapture()
    .digit()
    .oneOrMore()
    .endCapture()
    .endOfLine(),

  parseLog (log) {
    const parsedLine = this.verbalExpression.exec(log);

    if (!parsedLine) { return { hasMatched: false }; }

    const [ rank, parsedPseudo, scoreAsString ] = _.drop(parsedLine);
    return {
      hasMatched: true,
      rank,
      pseudo: pseudo || parsedPseudo,
      score: parseInt(scoreAsString, 0),
    };
  },
});
