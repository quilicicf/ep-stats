const _ = require('lodash');

const performOneMatchingStep = require('./performOneMatchingStep');

module.exports = (initialRemainingLines, initialRemainingMembers) => {
  const stepsNumber = Math.min(_.size(initialRemainingLines), _.size(initialRemainingMembers));

  const { remainingLines, remainingMembers, memberScores } = _.chain(Array(stepsNumber))
    .map((whatever, index) => index)
    .reduce(
      (seed, stepIndex) => performOneMatchingStep(seed, stepIndex, stepsNumber),
      {
        shouldStopEarly: false,
        remainingLines: initialRemainingLines,
        remainingMembers: initialRemainingMembers,
        memberScores: {},
      },
    )
    .value();

  return {
    forsakenLines: remainingLines,
    forsakenMembers: remainingMembers,
    miracleMemberScores: memberScores,
  };
};
