const _ = require('lodash');
const axios = require('axios');
const {
  format: formatDate, isAfter,
  getDate: getDayOfMonth, getMonth, getYear,
  parseISO, min, addMonths,
} = require('date-fns');

const log = require('../../conf/log');

const { PHOTOS_API_URL } = require('./constants');
const { DATE_FORMAT_GSHEET } = require('../../conf/constants');

const authorize = require('../authorization/authorize');

const toBase1 = number => number + 1;

const toGoogleDate = date => ({
  day: getDayOfMonth(date),
  month: toBase1(getMonth(date)),
  year: getYear(date),
});

module.exports = async (startDate) => {
  const endDate = min([ new Date(), addMonths(startDate, 1) ]); // ~80 screens each month, 100 pagination on Photos API

  log([ `Will get screenshots for ${formatDate(startDate, DATE_FORMAT_GSHEET)} -> ${formatDate(endDate, DATE_FORMAT_GSHEET)}` ]);

  const oauthClient = await authorize();

  const headers = await oauthClient.getRequestHeaders(PHOTOS_API_URL);
  try {
    const { data: { mediaItems } } = await axios.request({
      url: PHOTOS_API_URL,
      method: 'POST',
      data: {
        pageSize: 100,
        pageToken: null,
        filters: {
          dateFilter: {
            ranges: [ { startDate: toGoogleDate(startDate), endDate: toGoogleDate(endDate) } ],
          },
          contentFilter: { includedContentCategories: [ 'SCREENSHOTS' ] },
          mediaTypeFilter: { mediaTypes: [ 'PHOTO' ] },
        },
      },
      headers,
    });

    const screenshots = _.chain(mediaItems)
      .map(({ filename, baseUrl, mediaMetadata: { creationTime, width, height } }) => {
        const date = parseISO(creationTime);
        const fileName = filename.replace(/\.png$/, '');
        return {
          fileName, url: baseUrl, date, width, height,
        };
      })
      .filter(({ date }) => isAfter(date, startDate)) // Google API checks a precise only to the day
      .value();

    const lastScreenshotDate = _.chain(screenshots)
      .map(({ date }) => date)
      .sortBy()
      .last()
      .value();

    return { screenshots, lastScreenshotDate };
  } catch (e) {
    throw e;
  }
};

