const { format: formatDate } = require('date-fns');

const append = require('../gsheet/append');
const { PROCESSOR_TYPES } = require('../image-processing/imageProcessors');

const getFormattedDate = () => {
  const now = Date.now();
  const month = formatDate(now, 'MM');
  const day = formatDate(now, 'dd');
  return `${month}_${day}`;
};

module.exports = async (result, { sheetId }) => {
  const info = result[ PROCESSOR_TYPES.INFO ];
  const hits = result[ PROCESSOR_TYPES.HITS ];

  const valuesToUpload = [
    getFormattedDate(),
    hits.totalScore,
    ...info.valuesForUpload,
    ...hits.valuesForUpload,
  ];

  try {
    await append(sheetId, info.gsheetRange, valuesToUpload);
  } catch (gsheetError) {
    process.stderr.write(gsheetError);
  }
};
