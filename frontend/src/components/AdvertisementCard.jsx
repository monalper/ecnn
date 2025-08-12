import React, { useState } from 'react';
import reklamImage from '../assets/reklam.png';

const AdvertisementCard = ({ className = '' }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  // SVG-based advertisement icon that won't be blocked
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
    <div className={`relative ${className}`}>
      {/* 16:9 Aspect Ratio Container - exactly like VideoCard */}
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <div className="absolute inset-0 bg-black rounded-lg overflow-hidden">
          {!imageError ? (
            <img
              src={reklamImage}
              alt="Reklam"
              className="w-full h-full object-cover"
              loading="lazy"
              onError={handleImageError}
              onLoad={handleImageLoad}
              style={{ display: imageLoaded ? 'block' : 'none' }}
            />
          ) : null}
          
          {/* Fallback content when image is blocked or fails to load */}
          {imageError && (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
              <div className="text-center text-white">
                <AdIcon />
                <div className="text-sm font-medium mt-2">Reklam Alanı</div>
                <div className="text-xs opacity-75">Openwall</div>
              </div>
            </div>
          )}
          
          {/* Loading state */}
          {!imageLoaded && !imageError && (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
              <div className="animate-pulse text-gray-400">
                <AdIcon />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Advertisement info - exactly like video info */}
      <div className="mt-3">
        <h3 className="font-bold text-gray-900 dark:text-white text-base line-clamp-2 leading-tight">
          Reklam
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-3 opacity-50">
          Openwall tarafından
        </p>
      </div>
    </div>
  );
};

export default AdvertisementCard; 