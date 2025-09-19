import React, { useMemo } from 'react';
import { Scatter } from 'react-chartjs-2';
import data from './FinalDB-16.9.json';

function extractSamples() {
  const samples = [];
  const chemicals = data.Chemicals_Height;
  Object.keys(chemicals).forEach(year => {
    const monthsArr = chemicals[year];
    if (!Array.isArray(monthsArr)) return;
    monthsArr.forEach((monthObj, monthIndex) => {
      if (!monthObj) return;
      Object.keys(monthObj).forEach(dayKey => {
        const daySamples = monthObj[dayKey];
        if (!Array.isArray(daySamples)) return;
        daySamples.forEach(sample => {
          if (!sample) return;
          samples.push({
            year,
            month: monthIndex + 1,
            date: sample.date,
            chl_ug_l_avg: sample.chl_ug_l_avg,
            avg_nitrate: sample.avg_nitrate
          });
        });
      });
    });
  });
  return samples;
}

const samples = extractSamples();

const ChlorophyllVsNitrateScatter = () => {
  const chartData = useMemo(() => ({
    datasets: [{
      label: 'Chlorophyll-a vs. Nitrate',
      data: samples
        .filter(s => s.chl_ug_l_avg != null && s.avg_nitrate != null)
        .map(s => ({ x: s.avg_nitrate, y: s.chl_ug_l_avg })),
      backgroundColor: 'rgba(59,130,246,0.7)',
      pointRadius: 4
    }]
  }), []);

  return (
    <div className="h-[24rem]">
      <h3 className="mb-2 font-semibold text-lg text-gray-800">Chlorophyll-a vs. Nitrate (Scatter)</h3>
      <Scatter
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: ctx => `Nitrate: ${ctx.parsed.x}, Chlorophyll-a: ${ctx.parsed.y}`
              }
            }
          },
          scales: {
            x: { title: { display: true, text: 'Nitrate (mg/L)' } },
            y: { title: { display: true, text: 'Chlorophyll-a (µg/L)' } }
          }
        }}
      />
      <div className="mt-2 text-sm text-gray-600">Shows the relationship between nitrate and chlorophyll-a concentrations. Points clustered together may indicate correlation between nutrient pollution and algal growth.</div>
    </div>
  );
};

export default ChlorophyllVsNitrateScatter;
