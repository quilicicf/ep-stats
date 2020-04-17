const _ = require('lodash');

module.exports = items => _.map(items, item => `${item}`);
