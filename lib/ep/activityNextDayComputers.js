const _ = require('lodash');
const parse = require('date-fns/parse');
const getDay = require('date-fns/getDay');
const addDays = require('date-fns/addDays');

const { WAR, TITAN } = require('./activityTypes');
const { DATE_FORMAT } = require('../google/constants');

const DAY_OF_WEEKS = { WEDNESDAY: 3, SATURDAY: 6 };

const isWarDay = (date) => {
  const dayCode = getDay(date);
  return dayCode === DAY_OF_WEEKS.WEDNESDAY || dayCode === DAY_OF_WEEKS.SATURDAY;
};

const getLastWednesdayOrSaturday = lastDate => (
  _([ -4, -3, -2, -1, 0 ])
    .map(diff => addDays(lastDate, diff))
    .filter(isWarDay)
    .last()
);

const getNextWednesdayOrSaturday = lastDate => (
  _([ 1, 2, 3, 4, 5 ])
    .map(diff => addDays(lastDate, diff))
    .filter(isWarDay)
    .first()
);

const parseDate = dateAsString => parse(dateAsString, DATE_FORMAT, new Date());

module.exports = {
  getLastWednesdayOrSaturday,
  getNextWednesdayOrSaturday,
  [ TITAN ] (lastDateAsString) {
    if (!lastDateAsString) { return new Date(); }

    const lastDate = parseDate(lastDateAsString);
    return addDays(lastDate, 1);
  },
  [ WAR ] (lastDateAsString) {
    if (!lastDateAsString) { return getLastWednesdayOrSaturday(new Date()); }

    const lastDate = parseDate(lastDateAsString);
    return getNextWednesdayOrSaturday(lastDate);
  },
};
