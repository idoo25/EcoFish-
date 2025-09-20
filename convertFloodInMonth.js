const fs = require('fs');

const filePath = 'code/StatisticsComponents/db-20.9.json';
const json = JSON.parse(fs.readFileSync(filePath, 'utf8'));

function convertFloodInMonth(obj) {
  if (Array.isArray(obj)) {
    obj.forEach(convertFloodInMonth);
  } else if (obj && typeof obj === 'object') {
    for (const key in obj) {
      if (key === 'flood_in_month') {
        if (obj[key] === true) obj[key] = 1;
        else if (obj[key] === false) obj[key] = 0;
      } else {
        convertFloodInMonth(obj[key]);
      }
    }
  }
}

convertFloodInMonth(json);
fs.writeFileSync(filePath, JSON.stringify(json, null, 2));
console.log('Converted flood_in_month true/false to 1/0');
