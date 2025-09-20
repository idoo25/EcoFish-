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
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { size: 12, family: 'inherit', weight: 'bold' },
          padding: 12,
          boxWidth: 16,
          color: '#374151',
        },
      },
      title: {
        display: true,
        text: 'Heavy Metals vs Safety Thresholds',
        font: { size: 16, weight: 'bold' },
        color: '#1e293b',
        padding: { top: 10, bottom: 10 },
      },
      tooltip: {
        bodyFont: { size: 12 },
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
        title: {
          display: true,
          text: 'Concentration (µg/L)',
          font: { size: 13, weight: 'bold' },
        },
        ticks: {
          font: { size: 11 },
        },
        grid: { color: 'rgba(239,68,68,0.1)' }
      },
      x: {
        title: {
          display: true,
          text: 'Metal',
          font: { size: 13, weight: 'bold' },
        },
        ticks: {
          font: { size: 11 },
        },
        grid: { color: 'rgba(59,130,246,0.1)' }
      }
    }
  };

  const metalExplanations = {
    Cd: 'Cadmium (Cd): Toxic to kidneys and aquatic life. Safety threshold: 0.005 µg/L.',
    Pb: 'Lead (Pb): Affects nervous system, dangerous for children and wildlife. Safety threshold: 0.01 µg/L.',
    Hg: 'Mercury (Hg): Causes neurological and developmental problems. Safety threshold: 1 µg/L.',
    Cu: 'Copper (Cu): Can cause gastrointestinal distress and is toxic to fish. Safety threshold: 1 µg/L.',
    Zn: 'Zinc (Zn): Essential but toxic at high concentrations. Safety threshold: 10 µg/L.',
    Fe: 'Iron (Fe): Excess can affect taste and stain water, but is less toxic. Safety threshold: 300 µg/L.',
    Mn: 'Manganese (Mn): Can affect taste and stain water, high levels may be neurotoxic. Safety threshold: 50 µg/L.',
    Al: 'Aluminum (Al): Can be toxic to fish and affect water clarity. Safety threshold: 200 µg/L.'
  };

  return (
    <div className="w-full px-2 sm:px-4 md:px-6">
      <div className="w-full h-[22rem] sm:h-[26rem] md:h-[30rem]">
        <Bar data={data} options={options} />
      </div>
      <div className="mt-4 text-xs sm:text-sm md:text-base text-gray-600 text-left break-words">
        Bars above the blue line exceed safety thresholds and may pose health risks. Green bars are safe, red bars are unsafe.
      </div>
      <ul className="mt-4 text-xs sm:text-sm md:text-base text-gray-700 text-left break-words">
        {metalsThresholds.map((metal) => (
          <li key={metal.metal} className="mb-2">
            <b className="font-semibold text-xs sm:text-sm md:text-base">{metal.label}</b> <span className="font-mono">({metal.metal})</span>: {metalExplanations[metal.metal]}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HeavyMetalsThresholdsChart;
