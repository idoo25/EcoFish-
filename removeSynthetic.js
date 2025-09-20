const fs = require('fs');

function removeSyntheticFields(obj) {
  if (Array.isArray(obj)) {
    return obj.map(removeSyntheticFields);
  } else if (obj && typeof obj === 'object') {
    const newObj = {};
    for (const key in obj) {
      if (key !== 'synthetic' && key !== 'synthetic_source') {
        newObj[key] = removeSyntheticFields(obj[key]);
      }
    }
    return newObj;
  }
  return obj;
}

const filePath = 'code/StatisticsComponents/db-20.9.json';
const json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
const cleaned = removeSyntheticFields(json);
fs.writeFileSync(filePath, JSON.stringify(cleaned, null, 2));
console.log('synthetic fields removed!');
