// Script to count valid samples with both flood_in_month and Ecoli as numbers
const fs = require('fs');
const data = require('./db-20.9.json');

let count = 0;
let samples = [];
if (data.Ecolifloods && typeof data.Ecolifloods === 'object') {
  Object.entries(data.Ecolifloods).forEach(([year, arr]) => {
    if (!Array.isArray(arr)) return;
    arr.forEach(monthObj => {
      if (!monthObj || typeof monthObj !== 'object') return;
      Object.entries(monthObj).forEach(([month, arr2]) => {
        if (!Array.isArray(arr2)) return;
        arr2.forEach(sample => {
          if (
            sample && typeof sample === 'object' &&
            typeof sample.flood_in_month === 'number' &&
            typeof sample.Ecoli === 'number'
          ) {
            count++;
            samples.push({ year, month, flood_in_month: sample.flood_in_month, Ecoli: sample.Ecoli });
          }
        });
      });
    });
  });
}
console.log('Valid samples with both flood_in_month and Ecoli as numbers:', count);
if (count > 0) {
  console.log('First 5 samples:', samples.slice(0, 5));
}
