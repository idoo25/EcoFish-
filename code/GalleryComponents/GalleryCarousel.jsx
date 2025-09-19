import React, { useState, useEffect, useRef } from 'react';

// Kinneret photos (public domain or free to use)
const photos = [
  'https://kids.gov.il/sababa/sababa_pool/images/water_kineret-tveria-marina_1.jpg',
  'https://www.picshare.co.il/s_pictures/img128006.jpg',
  'https://ynet-pic1.yit.co.il/picserver5/wcm_upload/2024/01/18/ry8IsexDta/8.jpg',
  'https://media.istockphoto.com/id/898542012/photo/the-coast-of-the-sea-of-galilee-near-ein-eyov-waterfall-in-tabgha-israel.jpg?s=612x612&w=0&k=20&c=BVW5gTGip0NUEQGzK_GJlDqk-5cV1uTo_4ER4RSPvXs=',
  'https://static-cdn.toi-media.com/www/uploads/2017/12/F1700423IH009-e1513122189152.jpg'
];

const GalleryCarousel = () => {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  // Auto transition disabled - manual only

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrent((prev) => (prev + 1) % photos.length);
      setIsTransitioning(false);
    }, 100);
  };

  const handlePrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrent((prev) => (prev - 1 + photos.length) % photos.length);
      setIsTransitioning(false);
    }, 100);
  };

  const handleDotClick = (index) => {
    if (isTransitioning || index === current) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrent(index);
      setIsTransitioning(false);
    }, 100);
  };

  // Swipe handlers
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  
  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };
  
  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 50) {
      handleNext();
    } else if (distance < -50) {
      handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Helper to get previous and next indices (circular)
  const getIndices = () => {
    const prev = (current - 1 + photos.length) % photos.length;
    const next = (current + 1) % photos.length;
    return [prev, current, next];
  };

  const [prevIdx, centerIdx, nextIdx] = getIndices();

  return (
    <div className="w-full max-w-7xl mx-auto py-4">
      <div
        className="relative h-[34rem] flex items-start justify-center overflow-visible perspective-1000"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Left side image (small) */}
        <div 
          className={`absolute left-20 top-12 cursor-pointer
            transition-all duration-700 ease-out hover:scale-110 hover:opacity-95
            ${isTransitioning ? 'scale-75 opacity-40 blur-sm' : 'scale-95 opacity-80'}`}
          onClick={handlePrev}
          style={{
            width: '20rem',
            height: '24rem',
            transform: `rotateY(15deg) translateZ(-50px) ${isTransitioning ? 'scale(0.75)' : 'scale(0.9)'}`,
            filter: 'brightness(0.8) contrast(1.1)',
            zIndex: 1
          }}
        >
          <img
            src={photos[prevIdx]}
            alt={`תמונה ${prevIdx + 1} של הכנרת`}
            className="w-full h-full object-cover rounded-2xl shadow-2xl"
            style={{
              boxShadow: '0 25px 50px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.1)'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-transparent rounded-2xl animate-pulse"></div>
        </div>

        {/* Center image (large) */}
        <div 
          className={`absolute left-[72%] top-[80%] transform -translate-x-1/2 -translate-y-1/2
            transition-all duration-700 ease-out
            ${isTransitioning ? 'scale-98 opacity-90 drop-shadow-2xl' : 'scale-100 opacity-100 drop-shadow-2xl'}`}
          style={{
            width: '32rem',
            height: '24rem',
            zIndex: 5,
            transform: `translate(-50%, -50%) ${isTransitioning ? 'scale(0.95) rotateX(5deg)' : 'scale(1)'}`,
            filter: 'brightness(1.05) saturate(1.1)'
          }}
        >
          <div className="relative w-full h-full">
            <img
              src={photos[centerIdx]}
              alt={`תמונה ${centerIdx + 1} של הכנרת`}
              className="w-full h-full object-cover rounded-3xl shadow-2xl"
              style={{
                boxShadow: '0 40px 80px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.2)'
              }}
            />
            {/* Cool glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/40 via-transparent to-purple-500/30 rounded-3xl"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/5 rounded-3xl"></div>
          </div>
        </div>

        {/* Right side image (small) */}
        <div 
          className={`absolute right-20 top-12 cursor-pointer
            transition-all duration-700 ease-out hover:scale-110 hover:opacity-95
            ${isTransitioning ? 'scale-75 opacity-40 blur-sm' : 'scale-95 opacity-80'}`}
          onClick={handleNext}
          style={{
            width: '20rem',
            height: '24rem',
            transform: `rotateY(-15deg) translateZ(-50px) ${isTransitioning ? 'scale(0.75)' : 'scale(0.9)'}`,
            filter: 'brightness(0.8) contrast(1.1)',
            zIndex: 1
          }}
        >
          <img
            src={photos[nextIdx]}
            alt={`תמונה ${nextIdx + 1} של הכנרת`}
            className="w-full h-full object-cover rounded-2xl shadow-2xl"
            style={{
              boxShadow: '0 25px 50px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.1)'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-l from-purple-500/20 to-transparent rounded-2xl animate-pulse"></div>
        </div>

  {/* Navigation buttons */}
        <button
          onClick={handlePrev}
          disabled={isTransitioning}
          className="absolute left-4 top-56 z-10
            w-12 h-12 bg-gradient-to-br from-blue-400/80 to-purple-400/80 backdrop-blur-sm rounded-full shadow-lg
            flex items-center justify-center transition-all duration-300
            hover:from-blue-500 hover:to-purple-500 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backdropFilter: 'blur(10px)' }}
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={handleNext}
          disabled={isTransitioning}
          className="absolute right-4 top-56 z-10
            w-12 h-12 bg-gradient-to-bl from-purple-400/80 to-blue-400/80 backdrop-blur-sm rounded-full shadow-lg
            flex items-center justify-center transition-all duration-300
            hover:from-purple-500 hover:to-blue-500 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backdropFilter: 'blur(10px)' }}
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

  {/* Background glow effect */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(90deg, rgba(59,130,246,0.08) 0%, rgba(147,51,234,0.08) 100%)`,
            zIndex: -1
          }}
        ></div>
      </div>

      {/* No info box, no Hebrew text */}
    </div>
  );
};

export default GalleryCarousel;