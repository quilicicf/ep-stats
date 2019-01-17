const { execSync } = require('child_process');

module.exports = command => execSync(command, { encoding: 'utf8' }).replace(/\n$/, '');
