const _ = require('lodash');

const { PROCESSORS } = require('./imageProcessors');

module.exports = (imageHeader) => {
  const result = _.find(PROCESSORS, processor => processor.imageHeader === imageHeader);
  if (!result) {
    throw Error('Could not find image info');
  }

  return result;
};
