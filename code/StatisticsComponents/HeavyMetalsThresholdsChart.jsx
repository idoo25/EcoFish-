import React from 'react';
import { Bar } from 'react-chartjs-2';

// Example props: metalsThresholds = [{ metal, value, threshold }]
const HeavyMetalsThresholdsChart = ({ metalsThresholds }) => {
  if (!metalsThresholds || metalsThresholds.length === 0) {
    return <div className="text-center text-gray-500">No heavy metals threshold data available</div>;
  }

  const metals = metalsThresholds.map(d => d.metal);
  const values = metalsThresholds.map(d => d.value);
  const thresholds = metalsThresholds.map(d => d.threshold);

  const data = {
    labels: metals,
    datasets: [
      {
        label: 'Measured Value (µg/L)',
        data: values,
        backgroundColor: values.map((v, i) => v > thresholds[i] ? 'rgba(239,68,68,0.7)' : 'rgba(34,197,94,0.7)'),
        borderColor: values.map((v, i) => v > thresholds[i] ? 'rgba(239,68,68,1)' : 'rgba(34,197,94,1)'),
        borderWidth: 2,
      },
      {
        label: 'Safety Threshold (µg/L)',
        data: thresholds,
        backgroundColor: 'rgba(59,130,246,0.5)',
        borderColor: 'rgba(59,130,246,1)',
        borderWidth: 2,
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: 'Heavy Metals vs Safety Thresholds',
        font: { size: 18 }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            if (context.dataset.label === 'Safety Threshold (µg/L)') {
              return `Threshold: ${context.parsed.y} µg/L`;
            }
            return `Measured: ${context.parsed.y} µg/L`;
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
        title: { display: true, text: 'Metal' },
        grid: { color: 'rgba(59,130,246,0.1)' }
      }
    }
  };

  return (
    <div className="w-full">
      <Bar data={data} options={options} />
      <div className="mt-4 text-sm text-gray-600 text-center">
        Bars above the blue line exceed safety thresholds and may pose health risks. Green bars are safe, red bars are unsafe.
      </div>
    </div>
  );
};

export default HeavyMetalsThresholdsChart;
