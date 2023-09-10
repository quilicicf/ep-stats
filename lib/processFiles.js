const _ = require('lodash');

const processOneFile = require('./processOneFile');

module.exports = async (files, screenshotProfile, members, initialCache, holidays) => {
  const orderedScreenshots = _.chain(files)
    .values()
    .sortBy('date')
    .value();

  const filesNumber = _.size(files);
  return _.reduce(
    orderedScreenshots,
    (seed, screenshot, index) => seed
      .then((cache) => {
        const progressAsString = `${index + 1}/${filesNumber}`;
        return processOneFile(cache, screenshot, screenshotProfile, members, holidays, progressAsString);
      }),
    Promise.resolve(initialCache),
  );
};
