const _ = require('lodash');

const processors = require('./imageProcessors');

module.exports = (imageHeader) => {
  const result = _.find(processors, processor => processor.imageHeader === imageHeader);
  if (!result) { throw Error('Could not find image info'); }
  return result;
};
