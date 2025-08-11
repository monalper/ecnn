import React from 'react';
import reklamImage from '../assets/reklam.png';

const AdvertisementCard = ({ className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      {/* 16:9 Aspect Ratio Container - exactly like VideoCard */}
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <div className="absolute inset-0 bg-black rounded-lg overflow-hidden">
          <img
            src={reklamImage}
            alt="Reklam"
            className="w-full h-full object-cover"
            loading="lazy"
          />
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