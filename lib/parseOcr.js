const _ = require('lodash');
const { execSync } = require('child_process');
const VerEx = require('verbal-expressions');

const REGEX_BUILDER = () => {
  const regex = VerEx()
    .startOfLine()
    .then('[')
    .beginCapture()
    .digit()
    .oneOrMore()
    .endCapture()
    .then(']')
    .maybe(' ');

  regex.endIt = () => regex
    .maybe(' ')
    .beginCapture()
    .digit()
    .oneOrMore()
    .endCapture()
    .endOfLine();

  return regex;
};

const defaultRegexCreator = name => REGEX_BUILDER().then(name).endIt();

const advancedRegexCreator = nameRegex => REGEX_BUILDER().add(nameRegex).endIt();

const users = [
  { name: 'amaury', patternCreator () { return defaultRegexCreator(this.name); } },
  { name: 'Argonythe', patternCreator () { return defaultRegexCreator(this.name); } },
  { name: 'Attila095', patternCreator () { return defaultRegexCreator(this.name); } },
  { name: 'Berserker', patternCreator () { return defaultRegexCreator(this.name); } },
  { name: 'CarnivorousKnight178', patternCreator () { return defaultRegexCreator(this.name); } },
  { name: 'Fred', patternCreator () { return defaultRegexCreator(this.name); } },
  { name: 'horlan-tidou', patternCreator () { return defaultRegexCreator(this.name); } },
  { name: 'kg1', patternCreator () { return defaultRegexCreator(this.name); } },
  { name: 'LePlusFortCestGaston', patternCreator () { return defaultRegexCreator(this.name); } },
  { name: 'Lightcreed', patternCreator () { return defaultRegexCreator(this.name); } },
  { name: 'maki', patternCreator () { return defaultRegexCreator(this.name); } },
  { name: 'maylou83', patternCreator () { return defaultRegexCreator(this.name); } },
  { name: 'Medusa', patternCreator () { return defaultRegexCreator(this.name); } },
  { name: 'musa', patternCreator () { return defaultRegexCreator(this.name); } },
  { name: 'Nappier', patternCreator () { return defaultRegexCreator(this.name); } },
  { name: 'PATRIOT', patternCreator () { return defaultRegexCreator(this.name); } },
  { name: 'pazuzu', patternCreator () { return defaultRegexCreator(this.name); } },
  { name: 'Peter', patternCreator () { return defaultRegexCreator(this.name); } },
  { name: 'petit scarabée', patternCreator () { return defaultRegexCreator(this.name); } },
  { name: 'Rob', patternCreator () { return defaultRegexCreator(this.name); } },
  { name: 'Ryo Hazuki', patternCreator () { return defaultRegexCreator(this.name); } },
  { name: 'Skoblar44', patternCreator () { return defaultRegexCreator(this.name); } },
  { name: 'Syfler', patternCreator () { return defaultRegexCreator(this.name); } },
  { name: 'Taco7788999', patternCreator () { return defaultRegexCreator(this.name); } },
  { name: 'Taranee', patternCreator () { return defaultRegexCreator(this.name); } },
  { name: 'tofcool34', patternCreator () { return advancedRegexCreator('tofcoo[il|]34'); } },
  { name: 'vinsstyle', patternCreator () { return defaultRegexCreator(this.name); } },
];

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

module.exports = (file) => {
  const ocrResult = execSync(`tesseract -psm 4 ${file} stdout`, { encoding: 'utf8' }).replace(/\n$/, '');
  const parseableLines = _.filter(ocrResult.split('\n'), line => /^\[([0-9]+)]/.test(line));

  return _.reduce(
    users,
    (seed, user) => ({ ...seed, ...scoreUser(user, parseableLines) }),
    {},
  );
};

