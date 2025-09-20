const fs = require('fs');

function pearsonCorrelation(x, y) {
  const n = x.length;
  if (n !== y.length || n === 0) return null;
  const avgX = x.reduce((a, b) => a + b, 0) / n;
  const avgY = y.reduce((a, b) => a + b, 0) / n;
  let num = 0, denomX = 0, denomY = 0;
  for (let i = 0; i < n; i++) {
    num += (x[i] - avgX) * (y[i] - avgY);
    denomX += (x[i] - avgX) ** 2;
    denomY += (y[i] - avgY) ** 2;
  }
  return num / Math.sqrt(denomX * denomY);
}

const filePath = 'code/StatisticsComponents/db-20.9.json';
const json = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Flatten Ecolifloods samples
function flattenEcoliFloods(data) {
  const samples = [];
  if (!data || typeof data !== 'object') return samples;
  Object.entries(data).forEach(([year, arr]) => {
    if (!Array.isArray(arr)) return;
    arr.forEach(monthObj => {
      if (!monthObj || typeof monthObj !== 'object') return;
      Object.entries(monthObj).forEach(([month, arr2]) => {
        let flood = null;
        let flood_in_month = null;
        if (monthObj.flood !== undefined) flood = monthObj.flood;
        if (monthObj.flood_in_month !== undefined) flood_in_month = monthObj.flood_in_month;
        if (!Array.isArray(arr2)) return;
        arr2.forEach(sample => {
          if (sample && typeof sample === 'object') {
            samples.push({ ...sample, year, month, flood, flood_in_month });
          }
        });
      });
    });
  });
  return samples;
}

const ecoliSamples = flattenEcoliFloods(json.Ecolifloods);

// Use all samples with valid Ecoli value, treat flood as boolean indicator

const floodVals = [];
const ecoliVals = [];
let floodCount = 0;
let nonFloodCount = 0;
ecoliSamples.forEach(s => {
  let isFlood = 0;
  if ((typeof s.flood_in_month === 'number' && s.flood_in_month) || (typeof s.flood === 'number' && s.flood)) {
    isFlood = 1;
    floodCount++;
  } else {
    nonFloodCount++;
  }
  if (typeof s.Ecoli === 'number' && !isNaN(s.Ecoli)) {
    floodVals.push(isFlood);
    ecoliVals.push(s.Ecoli);
  }
});
let correlation = null;
if (floodVals.length > 1 && ecoliVals.length > 1 && floodCount > 0 && nonFloodCount > 0) {
  correlation = pearsonCorrelation(floodVals, ecoliVals);
}
json.flood_ecoli_correlation = correlation;
fs.writeFileSync(filePath, JSON.stringify(json, null, 2));
console.log('Correlation calculated and added:', correlation);
console.log('Flood samples:', floodCount, 'Non-flood samples:', nonFloodCount, 'Total valid:', floodVals.length);
