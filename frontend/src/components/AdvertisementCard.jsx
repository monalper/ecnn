import React, { useState } from 'react';

const AdvertisementCard = ({ className = '' }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [currentImagePath, setCurrentImagePath] = useState('/reklam.png');

  // Multiple fallback paths to try
  const imagePaths = [
    '/reklam.png',
    '/assets/reklam.png',
    '../assets/reklam.png',
    './reklam.png'
  ];

  // Log the image path for debugging
  console.log('AdvertisementCard: Current image path is', currentImagePath);

  const handleImageLoad = () => {
    console.log('Reklam image loaded successfully from:', currentImagePath);
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    console.log('Reklam image failed to load from:', currentImagePath);
    
    // Try next fallback path
    const currentIndex = imagePaths.indexOf(currentImagePath);
    if (currentIndex < imagePaths.length - 1) {
      const nextPath = imagePaths[currentIndex + 1];
      console.log('Trying next fallback path:', nextPath);
      setCurrentImagePath(nextPath);
      setImageLoaded(false);
      setImageError(false);
    } else {
      console.log('All fallback paths failed, showing gradient fallback');
      setImageError(true);
      setImageLoaded(false);
    }
  };

  // SVG-based advertisement icon as backup
  const AdIcon = () => (
    <svg 
      className="w-16 h-16 text-white" 
      fill="currentColor" 
      viewBox="0 0 24 24"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      <path d="M12 4c-4.41 0-8 3.59-8 8s3.59 8 8 8 8-3.59 8-8-3.59-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/>
    </svg>
  );

  return (
    <div className={`cursor-pointer hover:opacity-80 transition-opacity rounded-none md:rounded-lg ${className}`}>
      {/* 16:9 Aspect Ratio Container - exactly like VideoCard */}
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <div className="absolute inset-0 bg-black rounded-none md:rounded-lg overflow-hidden">
          {/* Always show the image - it should be visible */}
          <img
            key={currentImagePath}
            src={currentImagePath}
            alt="Reklam"
            className="w-full h-full object-cover reklam-image"
            loading="lazy"
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{ 
              display: 'block !important',
              opacity: imageLoaded ? 1 : 0.8,
              transition: 'opacity 0.3s ease',
              visibility: 'visible !important',
              position: 'relative',
              zIndex: 1,
              maxWidth: '100%',
              height: 'auto',
              minHeight: '100%'
            }}
          />
          {/* Loading state overlay */}
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
              <div className="text-center text-white">
                <AdIcon />
                <div className="text-sm font-medium mt-2">Yükleniyor...</div>
              </div>
            </div>
          )}
          {/* Error fallback - show gradient background with icon */}
          {imageError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 z-20">
              <div className="text-center text-white">
                <AdIcon />
                <div className="text-sm font-medium mt-2">Reklam Alanı</div>
                <div className="text-xs opacity-75">The Openwall</div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Advertisement info - exactly like VideoCard mobil başlık ve alt açıklama */}
      <div className="px-4 md:px-0 mt-4">
        <h3 className="text-[20px] font-bold text-gray-900 dark:text-white line-clamp-2 leading-tight">
          Reklam
        </h3>
        <p className="text-[17px] text-gray-400 dark:text-gray-500 mt-2 font-medium">
          Openwall tarafından
        </p>
      </div>
    </div>
  );
};

export default AdvertisementCard;