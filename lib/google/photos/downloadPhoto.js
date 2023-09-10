const axios = require('axios');
const { tmpdir } = require('os');
const { resolve: resolvePath } = require('path');
const { writeFileSync, existsSync } = require('fs');

const authorize = require('../authorization/authorize');

const { PHOTOS_API_URL } = require('./constants');

// eslint-disable-next-line object-curly-newline
module.exports = async ({ fileName, url, width, height }) => {
  const temporaryFilePath = resolvePath(tmpdir(), fileName);

  if (existsSync(temporaryFilePath)) {
    return temporaryFilePath; // Already downloaded (useful when debugging)
  }

  const oauthClient = await authorize();

  const headers = await oauthClient.getRequestHeaders(PHOTOS_API_URL);
  const { data } = await axios.request({
    url: `${url}=w${width}-h${height}`,
    method: 'GET',
    headers,
    responseType: 'arraybuffer',
  });

  writeFileSync(temporaryFilePath, data);
  return temporaryFilePath;
};
