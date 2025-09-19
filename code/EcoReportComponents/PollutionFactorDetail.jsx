import React from 'react';

const PollutionFactorDetail = ({ selectedFactor, onClose }) => {
  if (!selectedFactor) return null;
  return (
    <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 lg:p-8 border border-white/30 animate-in slide-in-from-bottom duration-500 overflow-hidden">
      {/* Animated Background Waves */}
      <div className="absolute inset-0 opacity-10">
        <div className={`absolute inset-0 bg-gradient-to-r ${selectedFactor.color}`}></div>
        <svg className="absolute bottom-0 left-0 w-full h-32 animate-pulse" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60 L1200,120 L0,120 Z" className="fill-current text-blue-200 opacity-30"></path>
        </svg>
        <svg className="absolute bottom-0 left-0 w-full h-24 animate-bounce" style={{animationDuration: '3s'}} viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,80 C200,40 400,100 600,80 C800,60 1000,100 1200,80 L1200,120 L0,120 Z" className="fill-current text-cyan-300 opacity-20"></path>
        </svg>
      </div>
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-8 gap-4">
          <div className="flex-1 min-w-0">
            <h2 className={`text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold bg-gradient-to-r ${selectedFactor.color} bg-clip-text text-transparent tracking-tight leading-tight break-words`}>
              {selectedFactor.cleanTitle}
            </h2>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-shrink-0 p-3 rounded-full bg-gradient-to-r from-red-400 to-pink-500 text-white hover:from-red-500 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {selectedFactor.loading ? (
            <div className="col-span-2 text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Generating AI-powered analysis...</p>
            </div>
          ) : selectedFactor.details ? (
            <>
              {/* Overview and Primary Sources */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 tracking-tight">Overview</h3>
                  <p className="text-gray-700 leading-relaxed font-light text-lg">{selectedFactor.details.overview}</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 tracking-tight">Primary Sources</h3>
                  <ul className="space-y-2">
                    {selectedFactor.details.sources.map((source, index) => (
                      <li key={index} className="flex items-center text-gray-700 font-medium">
                        <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mr-4 shadow-sm"></div>
                        <span className="text-lg">{source}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              {/* Impacts and Measurements */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 tracking-tight">Environmental Impacts</h3>
                  <ul className="space-y-3">
                    {selectedFactor.details.impacts.map((impact, index) => (
                      <li key={index} className="flex items-center text-gray-700 font-medium">
                        <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-full mr-4 shadow-sm"></div>
                        <span className="text-lg">{impact}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 tracking-tight">Monitored Parameters</h3>
                  <div className="flex flex-wrap gap-3">
                    {selectedFactor.details.measurements.map((measurement, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-50 text-gray-800 rounded-full text-base font-semibold border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                      >
                        {measurement}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default PollutionFactorDetail;
