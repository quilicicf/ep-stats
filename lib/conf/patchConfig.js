const _ = require('lodash');
const { prompt } = require('inquirer');

const appConfigQuestions = require('./appConfigQuestions');

module.exports = async (currentConfig) => {
  const questions = _(appConfigQuestions)
    .filter(({ question }) => _.isEmpty(currentConfig[ question.name ]))
    .filter(({ isRequired }) => isRequired)
    .map(({ question }) => question)
    .value();

  return {
    ...currentConfig,
    ...(await prompt(questions)),
  };
};
