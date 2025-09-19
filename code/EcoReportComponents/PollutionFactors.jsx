import React, { useState } from 'react';
import aiService from '../services/aiService';
import PollutionFactorCard from './PollutionFactorCard';
import PollutionFactorDetail from './PollutionFactorDetail';
import OverviewStats from './OverviewStats';
import ChatPopup from './ChatPopup';

const PollutionFactors = () => {
  const [selectedFactor, setSelectedFactor] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiGeneratedData, setAiGeneratedData] = useState({});
  const [chatMessages, setChatMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);
  // No greeting state needed
  const [suggestions, setSuggestions] = useState([]);

  const pollutionFactors = [
    {
      id: 1,
      title: 'Heavy Metals Concentration',
      cleanTitle: 'Heavy Metals',
      icon: '🧪',
      description: 'Monitor toxic metal levels in water that can bioaccumulate in marine life',
      color: 'from-red-500 via-red-600 to-red-700',
      severity: 'high',
      details: {
        overview: 'Heavy metals such as lead, mercury, and cadmium are toxic pollutants that can accumulate in aquatic organisms, causing serious health issues and disrupting the marine food chain.',
        dataSource: 'Real-time water quality sensors and laboratory analysis',
        sources: [
          'Industrial discharge and wastewater',
          'Agricultural runoff with pesticides',
          'Urban stormwater and street runoff',
          'Mining activities and processing plants'
        ],
        impacts: [
          'Bioaccumulation in fish and marine life',
          'Disruption of marine ecosystems',
          'Human health risks through seafood consumption',
          'Reduced biodiversity in affected areas'
        ],
        measurements: [
          'Lead (Pb)', 'Mercury (Hg)', 'Cadmium (Cd)', 'Chromium (Cr)', 
          'Copper (Cu)', 'Zinc (Zn)', 'Nickel (Ni)', 'Arsenic (As)'
        ]
      }
    },
    {
      id: 2,
      title: 'E.coli Bacterial Levels',
      cleanTitle: 'E.coli Bacteria',
      icon: '🦠',
      description: 'Track harmful bacterial contamination indicating sewage pollution',
      color: 'from-orange-500 via-orange-600 to-red-600',
      severity: 'high',
      details: {
        overview: 'Escherichia coli (E.coli) serves as an indicator of fecal contamination in water bodies, signaling the presence of sewage and potential health hazards for both marine life and humans.',
        dataSource: 'Bacterial culture analysis and rapid detection methods',
        sources: [
          'Sewage overflow and treatment plant discharge',
          'Animal waste from livestock operations',
          'Urban runoff carrying pet waste',
          'Failing septic systems and infrastructure'
        ],
        impacts: [
          'Waterborne disease transmission',
          'Beach and recreational area closures',
          'Shellfish harvesting restrictions',
          'Tourism and economic impact'
        ],
        measurements: [
          'CFU count per 100ml', 'Coliform bacteria', 'Enterococcus levels'
        ]
      }
    },
    {
      id: 3,
      title: 'Chemical Pollutants',
      cleanTitle: 'Chemical Pollutants',
      icon: '⚗️',
      description: 'Detect industrial chemicals and synthetic compounds in water',
      color: 'from-purple-500 via-purple-600 to-indigo-600',
      severity: 'medium',
      details: {
        overview: 'Various industrial chemicals, pesticides, and synthetic compounds can contaminate water bodies, affecting marine ecosystems and posing long-term environmental and health risks.',
        dataSource: 'Advanced spectroscopy and chromatography analysis',
        sources: [
          'Industrial manufacturing processes',
          'Agricultural pesticide application',
          'Household chemical disposal',
          'Pharmaceutical waste from healthcare'
        ],
        impacts: [
          'Endocrine disruption in marine species',
          'Reduced reproductive success in fish',
          'Contamination of food chain',
          'Long-term ecosystem degradation'
        ],
        measurements: [
          'Pesticide residues', 'PCBs', 'PAHs', 'Pharmaceuticals', 'Plasticizers'
        ]
      }
    },
    {
      id: 4,
      title: 'Nutrient Overload',
      cleanTitle: 'Nutrient Pollution',
      icon: '🌱',
      description: 'Monitor excessive nutrients causing algal blooms and oxygen depletion',
      color: 'from-green-500 via-teal-600 to-blue-600',
      severity: 'medium',
      details: {
        overview: 'Excess nutrients, particularly nitrogen and phosphorus, lead to eutrophication, causing harmful algal blooms, oxygen depletion, and disruption of aquatic ecosystems.',
        dataSource: 'Continuous nutrient monitoring and satellite imagery',
        sources: [
          'Agricultural fertilizer runoff',
          'Urban lawn and garden fertilizers',
          'Sewage treatment plant discharge',
          'Animal feeding operations'
        ],
        impacts: [
          'Harmful algal bloom formation',
          'Oxygen depletion (hypoxia)',
          'Fish kills and marine life death',
          'Degraded water quality for recreation'
        ],
        measurements: [
          'Nitrates', 'Nitrites', 'Phosphates', 'Ammonia', 'Chlorophyll-a'
        ]
      }
    }
  ];

  // AI-powered data generation
  const generateAIData = async (factor) => {
    if (aiGeneratedData[factor.id]) {
      return aiGeneratedData[factor.id];
    }

    setLoadingAI(true);
    try {
      const aiData = await aiService.generatePollutionFactorData(factor.title);
      const updatedData = {
        ...aiGeneratedData,
        [factor.id]: aiData
      };
      setAiGeneratedData(updatedData);
      return aiData;
    } catch (error) {
      console.error('Failed to generate AI data:', error);
      // Fallback to predefined data
      return factor.details;
    } finally {
      setLoadingAI(false);
    }
  };

  const handleFactorClick = async (factor) => {
    if (selectedFactor?.id === factor.id) {
      setSelectedFactor(null);
      setShowChat(false);
      setChatMessages([]);
      return;
    }

    // Set factor immediately with loading state
    setSelectedFactor({ ...factor, details: null, loading: true });
    setShowChat(false);
    setChatMessages([]);
    
    // Generate AI data
    const aiData = await generateAIData(factor);
    setSelectedFactor({ ...factor, details: aiData, loading: false });
    
    // Load chat suggestions
    const chatSuggestions = await aiService.getQuickSuggestions(factor);
    setSuggestions(chatSuggestions);
  };

  const handleChatSubmit = async (question = userInput) => {
    if (!question.trim()) return;

    const userMessage = { type: 'user', content: question, timestamp: Date.now() };
    setChatMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setChatLoading(true);

    try {
      const aiResponse = await aiService.chatWithBot(question, selectedFactor);
      const botMessage = { 
        type: 'bot', 
        content: aiResponse, 
        timestamp: Date.now() 
      };
      setChatMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      let errorMessage = 'Sorry, I had trouble processing your question. Please try again.';
      // More specific error messages
      if (error.message.includes('API key')) {
        errorMessage = 'There seems to be an issue with the API configuration. Please check the console for details.';
      } else if (error.message.includes('rate limit')) {
        errorMessage = 'I\'m receiving too many requests. Please wait a moment and try again.';
      } else if (error.message.includes('Invalid request')) {
        errorMessage = 'Your question might be too long or contain unsupported content. Try rephrasing it.';
      }
      const errorMsg = { 
        type: 'bot', 
        content: errorMessage, 
        timestamp: Date.now() 
      };
      setChatMessages(prev => [...prev, errorMsg]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setUserInput(suggestion);
    handleChatSubmit(suggestion);
  };

  const toggleChat = async () => {
    setShowChat(!showChat);
    // No greeting message, just open chat
  };


  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border border-green-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden p-4 lg:p-6">
      {/* Animated Wave Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-green-50 to-teal-50">
        <svg className="absolute bottom-0 left-0 w-full h-96 animate-pulse opacity-30" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60 L1200,120 L0,120 Z" className="fill-current text-blue-300"></path>
        </svg>
        <svg className="absolute bottom-0 left-0 w-full h-80 animate-bounce opacity-20" style={{animationDuration: '4s'}} viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,80 C200,40 400,100 600,80 C800,60 1000,100 1200,80 L1200,120 L0,120 Z" className="fill-current text-teal-400"></path>
        </svg>
        <svg className="absolute bottom-0 left-0 w-full h-64 animate-pulse opacity-25" style={{animationDuration: '6s'}} viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,40 C300,80 500,20 800,60 C900,80 1100,40 1200,60 L1200,120 L0,120 Z" className="fill-current text-green-300"></path>
        </svg>
      </div>
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto mb-8">
          <div className="text-center mb-8 px-4">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-teal-600 to-green-600 bg-clip-text text-transparent mb-6 tracking-tight leading-tight">
              EcoFish Water Quality Investigation 🌊
            </h1>
            <p className="text-lg lg:text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-light px-2">
              Real-time monitoring and analysis of key pollution factors affecting aquatic ecosystems through our comprehensive data collection system
            </p>
          </div>
          <OverviewStats />
        </div>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {pollutionFactors.map((factor) => (
              <PollutionFactorCard
                key={factor.id}
                factor={factor}
                onClick={handleFactorClick}
                getSeverityColor={getSeverityColor}
              />
            ))}
          </div>
          {selectedFactor && (
            <PollutionFactorDetail
              selectedFactor={selectedFactor}
              onClose={() => setSelectedFactor(null)}
            />
          )}
        </div>
        {/* Floating Chat Button - Only show when a factor is selected */}
        {selectedFactor && (
          <div className="fixed bottom-4 right-4 z-50">
            <button
              onClick={toggleChat}
              className={`w-20 h-20 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 active:animate-pulse ${
                showChat 
                  ? 'bg-gradient-to-r from-green-500 to-teal-600' 
                  : 'bg-gradient-to-r from-orange-500 to-pink-600 hover:shadow-orange-500/25'
              } border-4 border-white`}
            >
              <div className="flex items-center justify-center w-full h-full text-white">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
            </button>
            <ChatPopup
              showChat={showChat}
              chatMessages={chatMessages}
              chatLoading={chatLoading}
              suggestions={suggestions}
              userInput={userInput}
              setUserInput={setUserInput}
              handleChatSubmit={handleChatSubmit}
              handleSuggestionClick={handleSuggestionClick}
              selectedFactor={selectedFactor}
              setShowChat={setShowChat}
            />
            {/* Chat notification badge when new messages available */}
            {!showChat && chatMessages.length > 0 && (
              <div className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white text-sm rounded-full flex items-center justify-center animate-pulse font-bold">
                {chatMessages.filter(msg => msg.type === 'bot').length}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PollutionFactors;