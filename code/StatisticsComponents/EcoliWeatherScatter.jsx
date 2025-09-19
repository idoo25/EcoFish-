import React from 'react';
import { Scatter } from 'react-chartjs-2';

// Example props: ecoliWeatherData = [{ date, ecoli, rainfall, temperature }]
const EcoliWeatherScatter = ({ ecoliWeatherData }) => {
  if (!ecoliWeatherData || ecoliWeatherData.length === 0) {
    return <div className="text-center text-gray-500">No E.coli/weather data available</div>;
  }

  // Prepare data for chart
  const rainfallPoints = ecoliWeatherData.map(d => ({ x: d.rainfall, y: d.ecoli }));
  const tempPoints = ecoliWeatherData.map(d => ({ x: d.temperature, y: d.ecoli }));

  const data = {
    datasets: [
      {
        label: 'E.coli vs Rainfall',
        data: rainfallPoints,
        backgroundColor: 'rgba(59,130,246,0.7)',
        borderColor: 'rgba(59,130,246,1)',
        pointRadius: 5,
      },
      {
        label: 'E.coli vs Temperature',
        data: tempPoints,
        backgroundColor: 'rgba(251,191,36,0.7)',
        borderColor: 'rgba(251,191,36,1)',
        pointRadius: 5,
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: 'E.coli Correlation with Rainfall & Temperature',
        font: { size: 18 }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.dataset.label;
            const x = context.parsed.x;
            const y = context.parsed.y;
            if (label === 'E.coli vs Rainfall') {
              return `Rainfall: ${x} mm, E.coli: ${y} CFU/100mL`;
            }
            return `Temp: ${x}°C, E.coli: ${y} CFU/100mL`;
          }
        }
      }
    },
    scales: {
      x: {
        title: { display: true, text: 'Rainfall (mm) / Temperature (°C)' },
        grid: { color: 'rgba(59,130,246,0.1)' }
      },
      y: {
        title: { display: true, text: 'E.coli (CFU/100mL)' },
        grid: { color: 'rgba(239,68,68,0.1)' }
      }
    }
  };

  return (
    <div className="w-full">
      <Scatter data={data} options={options} />
      <div className="mt-4 text-sm text-gray-600 text-center">
        This scatter plot shows how E.coli levels correlate with rainfall and temperature. Look for clusters or trends indicating environmental impact.
      </div>
    </div>
  );
};

export default EcoliWeatherScatter;
