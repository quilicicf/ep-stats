#!/usr/bin/env node

const _ = require('lodash');
const parse = require('date-fns/parse');

const getEvents = require('./getEvents');
const isOnHolidays = require('../../ep/isOnHolidays');

const FORMAT = 'dd-MM-yyyy';

const main = async () => {
  const events = await getEvents({ calendarId: 'leplusfortcestgaston@gmail.com' });
  console.log(events);

  _.each(
    [ '05-09-2019', '06-09-2019', '20-09-2019', '21-09-2019' ],
    (date) => {
      const onHolidays = isOnHolidays('Taco7788999', events, parse(date, FORMAT, new Date()));
      console.log(`Date: ${date} => ${onHolidays}`);
    },
  );
};

main();
