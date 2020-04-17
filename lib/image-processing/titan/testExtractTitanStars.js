#!/usr/bin/env node

const extractTitanStars = require('./extractTitanStars');
const profile = require('../profiles/1536x2048');

const main = async () => {
  const stars = await extractTitanStars('/tmp/IMG_1809.PNG', 'IMG_1809', profile);
  console.log(stars);
};

main();
