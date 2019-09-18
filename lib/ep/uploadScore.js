const buildTitanUploadPayload = require('./buildTitanUploadPayload');
const buildWarUploadPayload = require('./buildWarUploadPayload');

const append = require('../google/gsheet/append');
const { TITAN, WAR } = require('../ep/activityTypes');

const PAYLOAD_BUILDERS = {
  [ TITAN ]: buildTitanUploadPayload,
  [ WAR ]: buildWarUploadPayload,
};

module.exports = async (info, hits, { sheetId }, dateToPush) => {
  const payloadBuilder = PAYLOAD_BUILDERS[ info.activityType ];
  const payload = payloadBuilder(dateToPush, info, hits);

  await append(sheetId, info.gsheetRange, payload);
  return payload;
};
