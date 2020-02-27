const { createWorker } = require('tesseract.js');

const initializeWorker = async () => {
  const worker = createWorker();
  await worker.load();
  await worker.loadLanguage('eng');
  await worker.initialize('eng');
  await worker.setParameters({});
  return worker;
};

const workerPromise = initializeWorker();

module.exports = async (filePath) => {
  const worker = await workerPromise;
  const { data: { text } } = await worker.recognize(filePath);
  return text;
};
