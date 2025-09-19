import React from 'react';

const PollutionFactorCard = ({ factor, onClick, getSeverityColor }) => (
  <div
    className={`group relative bg-gradient-to-br ${factor.color} p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105`}
    onClick={() => onClick(factor)}
  >
    <div className="text-white">
      <div className="flex items-center justify-between mb-4">
        <span className="text-4xl">{factor.icon}</span>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getSeverityColor(factor.severity)}`}>
          {factor.severity.toUpperCase()}
        </span>
      </div>
      <h3 className="text-2xl font-bold mb-3 tracking-tight">{factor.title}</h3>
      <p className="text-white/95 text-base leading-relaxed font-light">{factor.description}</p>
      <div className="mt-6 flex items-center text-white/90 text-sm font-medium">
        <span className="tracking-wide">Click to learn more</span>
        <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  </div>
);

export default PollutionFactorCard;
