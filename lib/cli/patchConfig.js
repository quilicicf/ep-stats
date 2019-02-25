const _ = require('lodash');
const { prompt } = require('inquirer');

const readFile = require('../fs/readFile');
const writeFile = require('../fs/writeFile');

const APP_CONFIG = require('./appConfig');

module.exports = async (configPath) => {
  const currentConfig = await readFile(configPath, JSON.parse);
  const questions = _(APP_CONFIG)
    .filter(({ question }) => _.isEmpty(currentConfig[ question.name ]))
    .filter(({ isRequired }) => isRequired)
    .map(({ question }) => question)
    .value();

  const newConfig = {
    ...currentConfig,
    ...(await prompt(questions)),
  };
  await writeFile(configPath, JSON.stringify(newConfig, null, 2));
  return newConfig;
};
