import React from 'react';
import { MapPin, AlertTriangle } from 'lucide-react';
import BackgroundEffects from './BackgroundEffects';
import PollutionCards from './PollutionCards';
import FactsSection from './FactsSection';

const HomeContent = ({ contaminants, algaeBloom, kinneretFacts, currentFact, setCurrentFact }) => {
  return (
    <div className="relative min-h-[800px] overflow-hidden">
      <BackgroundEffects contaminants={contaminants} algaeBloom={algaeBloom} />

      <div className="relative z-10 text-center py-8 sm:py-20 px-4">
        <div>
          <div className="mb-6 sm:mb-8 relative">
            <div className="flex items-center justify-center mb-2 sm:mb-4">
              <MapPin className="w-5 h-5 sm:w-8 sm:h-8 text-red-500 mr-2 sm:mr-3 animate-pulse" />
              <span className="text-sm sm:text-xl text-blue-800 font-black tracking-wider drop-shadow-lg">Sea of Galilee (Kinneret), Israel</span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-2 sm:mb-4 bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-600 bg-clip-text text-transparent drop-shadow-2xl tracking-tight leading-tight">
              Kinneret Pollution Report
            </h2>
            <div className="absolute -top-2 -right-4 sm:-top-4 sm:-right-16">
              <AlertTriangle className="w-8 h-8 sm:w-16 sm:h-16 text-red-500 animate-bounce" />
            </div>
          </div>
          
          <p className="text-base sm:text-xl md:text-2xl text-gray-800 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed font-medium tracking-wide drop-shadow-sm px-2">
            Comprehensive environmental monitoring of Lake Kinneret including heavy metals analysis, chemical contamination tracking, and flood impact assessment with real-time data visualization
          </p>
          
          <PollutionCards />
          <FactsSection 
            kinneretFacts={kinneretFacts} 
            currentFact={currentFact} 
            setCurrentFact={setCurrentFact} 
          />
        </div>
      </div>
    </div>
  );
};

export default HomeContent;