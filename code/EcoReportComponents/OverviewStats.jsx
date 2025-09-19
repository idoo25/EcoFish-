import React from 'react';

const OverviewStats = () => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/30">
      <div className="text-center">
        <div className="text-4xl font-black text-red-600 tracking-wider">8</div>
        <div className="text-gray-600 font-medium text-sm uppercase tracking-wide">Heavy Metals</div>
      </div>
    </div>
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/30">
      <div className="text-center">
        <div className="text-4xl font-black text-green-600 tracking-wider">3</div>
        <div className="text-gray-600 font-medium text-sm uppercase tracking-wide">Data Sources</div>
      </div>
    </div>
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/30">
      <div className="text-center">
        <div className="text-3xl font-black text-blue-600 tracking-wide">Multi-Depth</div>
        <div className="text-gray-600 font-medium text-sm uppercase tracking-wide">Sampling</div>
      </div>
    </div>
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/30">
      <div className="text-center">
        <div className="text-4xl font-black text-purple-600 tracking-wider">Beach</div>
        <div className="text-gray-600 font-medium text-sm uppercase tracking-wide">Locations</div>
      </div>
    </div>
  </div>
);

export default OverviewStats;
