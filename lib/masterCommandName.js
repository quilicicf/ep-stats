const _ = require('lodash');

const { bin } = require('../package.json');

module.exports = _.chain(bin)
  .toPairs()
  .map(([ programName ]) => programName)
  .value();
