import React from 'react';
import { Line } from 'react-chartjs-2';

// Example props: metalsTrends = [{ depth, year, metal, value }]
const HeavyMetalsTrendsChart = ({ metalsTrends }) => {
  if (!metalsTrends || metalsTrends.length === 0) {
    return <div className="text-center text-gray-500">No heavy metals trend data available</div>;
  }

  // Group by metal and depth
  const metals = Array.from(new Set(metalsTrends.map(d => d.metal)));
  const depths = Array.from(new Set(metalsTrends.map(d => d.depth)));
  const years = Array.from(new Set(metalsTrends.map(d => d.year))).sort();

  // Prepare datasets for each metal-depth combination
  const datasets = [];
  metals.forEach(metal => {
    depths.forEach(depth => {
      const dataPoints = years.map(year => {
        const found = metalsTrends.find(d => d.metal === metal && d.depth === depth && d.year === year);
        return found ? found.value : null;
      });
      datasets.push({
        label: `${metal} (${depth}m)`,
        data: dataPoints,
        borderColor: `hsl(${(depth*40)%360},70%,50%)`,
        backgroundColor: `hsla(${(depth*40)%360},70%,50%,0.1)`,
        tension: 0.3,
        fill: false,
        spanGaps: true,
      });
    });
  });

  const data = {
    labels: years,
    datasets
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: 'Heavy Metals Trends by Depth',
        font: { size: 18 }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y} µg/L`;
          }
        }
      }
    },
    scales: {
      y: {
        title: { display: true, text: 'Concentration (µg/L)' },
        grid: { color: 'rgba(239,68,68,0.1)' }
      },
      x: {
        title: { display: true, text: 'Year' },
        grid: { color: 'rgba(59,130,246,0.1)' }
      }
    }
  };

  return (
    <div className="w-full">
      <Line data={data} options={options} />
      <div className="mt-4 text-sm text-gray-600 text-center">
        This chart shows how heavy metal concentrations change over time at different depths. Use the legend to highlight specific metals or depths.
      </div>
    </div>
  );
};

export default HeavyMetalsTrendsChart;
