const _ = require('lodash');
const { google } = require('googleapis');
const addYears = require('date-fns/addYears');

const authorize = require('../authorization/authorize');

module.exports = async (calendarId) => {
  if (_.isEmpty(calendarId)) { return []; }

  const oauthClient = await authorize();
  return new Promise((resolve, reject) => {
    const calendar = google.calendar({ version: 'v3', auth: oauthClient });

    const timeMax = new Date().toISOString();
    const timeMin = addYears(new Date(), -1).toISOString();
    calendar.events.list(
      { calendarId, timeMin, timeMax },
      (error, result) => {
        if (error) { return reject(error); }
        return resolve(result.data.items);
      },
    );
  });
};
