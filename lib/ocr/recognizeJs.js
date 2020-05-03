const { createWorker } = require('tesseract.js');

const initializeWorker = async () => {
  const worker = createWorker();
  await worker.load();
  await worker.loadLanguage('eng');
  await worker.initialize('eng');
  await worker.setParameters({});
  return worker;
};

let worker = null;

module.exports = async (filePath) => {
  if (!worker) { worker = await initializeWorker(); }
  const { data: { text } } = await worker.recognize(filePath);
  return text;
};
