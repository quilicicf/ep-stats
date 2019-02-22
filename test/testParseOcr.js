const { resolve: resolvePath } = require('path');

const readFile = require('../lib/fs/readFile');
const parseOcr = require('../lib/ep/parseOcr');

const members = {
  Argonythe: { pseudo: 'Argonythe', regexAsString: '' },
  Berserker: { pseudo: 'Berserker', regexAsString: '' },
  ImMaryPoppinsYall: { pseudo: 'ImMaryPoppinsYall', regexAsString: '[I|l]mMaryPoppinsYa[I|l]{2}' },
  kg1: { pseudo: 'kg1', regexAsString: '' },
  Lightcreed: { pseudo: 'Lightcreed', regexAsString: '' },
  Medusa: { pseudo: 'Medusa', regexAsString: '' },
  Nappier: { pseudo: 'Nappier', regexAsString: '' },
  'petit scarabée': { pseudo: 'petit scarabée', regexAsString: '' },
  Rob: { pseudo: 'Rob', regexAsString: '' },
  Taco7788999: { pseudo: 'Taco7788999', regexAsString: '' },
};

const dataPath = resolvePath(__dirname, 'data', 'ocrTest.txt');

const main = async () => {
  const ocrResult = await readFile(dataPath);
  const result = await parseOcr(members, ocrResult);
  console.log(JSON.stringify(result, null, 2));
};

try {
  main();
} catch (error) {
  throw error;
}
