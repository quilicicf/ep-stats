const { existsSync } = require('fs');
const addDays = require('date-fns/addDays');
const parseISO = require('date-fns/parseISO');
const { prompt, registerPrompt } = require('inquirer');
registerPrompt('datetime', require('inquirer-datepicker-prompt'));

const { CACHE_PATH, DEFAULT_CACHE } = require('./constants');

const readFile = require('../fs/readFile');

module.exports = async () => {
  const cache = existsSync(CACHE_PATH)
    ? await readFile(CACHE_PATH, (data) => JSON.parse(data))
    : DEFAULT_CACHE;

  if (cache.lastCheck) {
    cache.lastCheck = parseISO(cache.lastCheck);
  } else {
    const { lastCheck } = await prompt({
      type: 'datetime',
      name: 'lastCheck',
      message: 'Which date should I start from?',
      initial: new Date(),
      format: [ 'yyyy', '/', 'mm', '/', 'dd' ],
    });
    cache.lastCheck = addDays(lastCheck, -1); // We want to start now, not consider we already did the day
  }

  return cache;
};
