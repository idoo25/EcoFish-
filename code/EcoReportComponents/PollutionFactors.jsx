import React, { useState, useEffect } from 'react';
import aiService from '../services/aiService';

const PollutionFactors = () => {
  const [selectedFactor, setSelectedFactor] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiGeneratedData, setAiGeneratedData] = useState({});
  const [chatMessages, setChatMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);
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
      const botMessage = { type: 'bot', content: aiResponse, timestamp: Date.now() };
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
    if (!showChat && chatMessages.length === 0) {
      // Add welcome message
      const welcomeMessage = {
        type: 'bot',
        content: `Hi! I'm EcoFish AI. I can answer questions about ${selectedFactor?.title || 'water pollution'} and environmental monitoring. What would you like to know?`,
        timestamp: Date.now()
      };
      setChatMessages([welcomeMessage]);
    }
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
      
      {/* Content with relative positioning */}
      <div className="relative z-10">
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-8">
        <div className="text-center mb-8 px-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-teal-600 to-green-600 bg-clip-text text-transparent mb-6 tracking-tight leading-tight">
            EcoFish Water Quality Investigation 🌊 
          </h1>
          <p className="text-lg lg:text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-light px-2">
            Real-time monitoring and analysis of key pollution factors affecting aquatic ecosystems through our comprehensive data collection system
          </p>
        </div>

        {/* Data Overview Stats */}
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
      </div>

      {/* Pollution Factors Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {pollutionFactors.map((factor) => (
            <div
              key={factor.id}
              className={`group relative bg-gradient-to-br ${factor.color} p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105`}
              onClick={() => handleFactorClick(factor)}
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
          ))}
        </div>

        {/* Detailed View */}
        {selectedFactor && (
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
                    onClick={() => setSelectedFactor(null)}
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
        )}
      </div>
      </div>

      {/* Floating Chat Button - Only show when a factor is selected */}
      {selectedFactor && (
        <div className="fixed bottom-4 right-4 z-50">
          {/* Chat Popup */}
          {showChat && (
            <div className="absolute bottom-24 right-0 w-96 max-w-[calc(100vw-4rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 mb-4 animate-in slide-in-from-bottom-2 duration-300">
              {/* Chat Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-2xl">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">EcoFish AI Assistant</h3>
                    <p className="text-xs text-white/80">{selectedFactor.cleanTitle}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowChat(false)}
                  className="p-2 bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg"
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
              </div>

              {/* Chat Messages */}
              <div className="h-80 overflow-y-auto p-4 space-y-3">
                {chatMessages.map((message, index) => (
                  <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] px-3 py-2 rounded-2xl ${
                      message.type === 'user' 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-md' 
                        : 'bg-gray-100 text-gray-800 rounded-bl-md'
                    }`}>
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-800 px-3 py-2 rounded-2xl rounded-bl-md">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Suggestions */}
              {suggestions.length > 0 && chatMessages.length <= 1 && (
                <div className="px-4 pb-3">
                  <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
                  <div className="flex flex-wrap gap-1">
                    {suggestions.slice(0, 3).map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors border border-blue-200"
                      >
                        {suggestion.length > 40 ? suggestion.substring(0, 40) + '...' : suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Chat Input */}
              <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
                    placeholder="Ask about the Kinneret..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    disabled={chatLoading}
                  />
                  <button
                    onClick={() => handleChatSubmit()}
                    disabled={chatLoading || !userInput.trim()}
                    className="px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm font-medium"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Floating Chat Button - Much Bigger */}
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

          {/* Chat notification badge when new messages available */}
          {!showChat && chatMessages.length > 0 && (
            <div className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white text-sm rounded-full flex items-center justify-center animate-pulse font-bold">
              {chatMessages.filter(msg => msg.type === 'bot').length}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PollutionFactors;