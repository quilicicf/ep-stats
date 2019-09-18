const _ = require('lodash');
const { compareTwoStrings } = require('string-similarity');
const parse = require('date-fns/parse');
const isWithinInterval = require('date-fns/isWithinInterval');

const EVENT_PSEUDO_MIN_SIMILARITY = 0.8;

const parseEventDate = eventDateAsString => parse(eventDateAsString, 'yyyy-MM-dd', new Date());

const eventConcernsUser = (memberPseudo, eventSummary) => _(eventSummary)
  .split(',')
  .some(eventPseudo => compareTwoStrings(memberPseudo, eventPseudo) >= EVENT_PSEUDO_MIN_SIMILARITY);

module.exports = (pseudo, holidays, date) => _(holidays)
  .filter(event => eventConcernsUser(pseudo, event.summary))
  .map(event => ({ start: parseEventDate(event.start.date), end: parseEventDate(event.end.date) }))
  .some(interval => isWithinInterval(date, interval));
