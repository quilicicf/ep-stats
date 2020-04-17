const _ = require('lodash');
const axios = require('axios');
const {
  getDate: getDayOfMonth,
  getMonth,
  getYear,
  parseISO,
} = require('date-fns');

const { PHOTOS_API_URL } = require('./constants');

const authorize = require('../authorization/authorize');

const toBase1 = number => number + 1;

const toGoogleDate = date => ({
  day: getDayOfMonth(date),
  month: toBase1(getMonth(date)),
  year: getYear(date),
});

module.exports = async (fromDate, toDate) => {
  const oauthClient = await authorize();

  const headers = await oauthClient.getRequestHeaders(PHOTOS_API_URL);
  const { data: { mediaItems } } = await axios.request({
    url: PHOTOS_API_URL,
    method: 'POST',
    data: {
      pageSize: 100,
      pageToken: null,
      filters: {
        dateFilter: {
          ranges: [
            {
              startDate: toGoogleDate(fromDate),
              endDate: toGoogleDate(toDate),
            },
          ],
        },
        contentFilter: { includedContentCategories: [ 'SCREENSHOTS' ] },
        mediaTypeFilter: { mediaTypes: [ 'PHOTO' ] },
      },
    },
    headers,
  });

  return _.map(mediaItems, ({ filename, baseUrl, mediaMetadata: { creationTime, width, height } }) => {
    const date = parseISO(creationTime);
    const fileName = filename.replace(/\.png$/, '');
    return {
      fileName, url: baseUrl, date, width, height,
    };
  });
};

