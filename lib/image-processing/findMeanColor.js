const _ = require('lodash');
const { execSync } = require('child_process');

module.exports = (imagePath) => {
  const colorInformation = execSync(`identify -verbose ${imagePath}`, { encoding: 'utf8' });
  const [ red, green, blue ] = _(colorInformation)
    .split('\n')
    .filter(line => /^[ ]+mean:/.test(line))
    .take(3)
    .map(line => /mean: ([0-9.]+) /.exec(line)[ 1 ])
    .map(colorAsString => parseInt(colorAsString, 10))
    .value();

  return { red, green, blue };
};
