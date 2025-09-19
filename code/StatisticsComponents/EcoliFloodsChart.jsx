import React from 'react';
import { Line } from 'react-chartjs-2';

// Example props: chartData.ecoliFloods = [{ date, ecoli, rainfall }]
const EcoliFloodsChart = ({ ecoliFloods }) => {
  if (!ecoliFloods || ecoliFloods.length === 0) {
    return <div className="text-center text-gray-500">No E.coli flood data available</div>;
  }

  // Prepare data for chart
  const dates = ecoliFloods.map(d => d.date);
  const ecoliLevels = ecoliFloods.map(d => d.ecoli);
  const rainfall = ecoliFloods.map(d => d.rainfall);

  const data = {
    labels: dates,
    datasets: [
      {
        label: 'E.coli (CFU/100mL)',
        data: ecoliLevels,
        borderColor: 'rgba(239,68,68,1)',
        backgroundColor: 'rgba(239,68,68,0.2)',
        yAxisID: 'y',
        tension: 0.5,
        pointRadius: 0,
        fill: true,
      },
      {
        label: 'Rainfall (mm)',
        data: rainfall,
        borderColor: 'rgba(59,130,246,1)',
        backgroundColor: 'rgba(59,130,246,0.1)',
        yAxisID: 'y1',
        type: 'bar',
        barPercentage: 0.5,
        categoryPercentage: 0.5,
      }
    ]
  };

  const options = {
    responsive: true,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: 'E.coli Spikes After Floods/Rainfall',
        font: { size: 18 }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            if (context.dataset.label === 'Rainfall (mm)') {
              return `Rainfall: ${context.parsed.y} mm`;
            }
            return `E.coli: ${context.parsed.y} CFU/100mL`;
          }
        }
      }
    },
    scales: {
      y: {
        type: 'linear',
        position: 'left',
        title: { display: true, text: 'E.coli (CFU/100mL)' },
        grid: { color: 'rgba(239,68,68,0.1)' }
      },
      y1: {
        type: 'linear',
        position: 'right',
        title: { display: true, text: 'Rainfall (mm)' },
        grid: { drawOnChartArea: false },
      }
    }
  };

  return (
    <div className="w-full">
      <Line data={data} options={options} />
      <div className="mt-4 text-sm text-gray-600 text-center">
        This chart shows E.coli spikes after rainfall/flooding events. High rainfall often correlates with increased E.coli contamination.
      </div>
    </div>
  );
};

export default EcoliFloodsChart;
