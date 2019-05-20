const _ = require('lodash');

module.exports = values => _(values)
  .map(value => _.size(value))
  .reduce((seed, size) => (size > seed ? size : seed), 0);
