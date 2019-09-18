#!/usr/bin/env node

const getEvents = require('./getEvents');

const main = async () => {
  const events = await getEvents({ calendarId: 'leplusfortcestgaston@gmail.com' });
  console.log(events);
};

main();
