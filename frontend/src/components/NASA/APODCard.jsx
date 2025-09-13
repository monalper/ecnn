import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../LoadingSpinner';

const APODCard = ({ className = '' }) => {
  const [apodData, setApodData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // NASA API key - in production, this should be in environment variables
  const NASA_API_KEY = import.meta.env.VITE_NASA_API_KEY || 'DEMO_KEY';

  useEffect(() => {
    const fetchAPODData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(
          `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`
        );
        
        if (!response.ok) {
          if (response.status === 429) {
            throw new Error('API rate limit aşıldı');
          }
          throw new Error(`NASA API hatası: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error.message || 'Bilinmeyen hata');
        }
        
        setApodData(data);
      } catch (err) {
        console.error('APOD data fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAPODData();
  }, [NASA_API_KEY]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className={`relative ${className}`}>
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <LoadingSpinner size="small" text="Yükleniyor..." />
          </div>
        </div>
        <div className="mt-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`relative ${className}`}>
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <div className="text-center p-4">
              <div className="text-4xl mb-2">🌌</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Veri yüklenemedi</p>
            </div>
          </div>
        </div>
        <div className="mt-3">
          <h3 className="font-bold text-gray-900 dark:text-white text-base">
            NASA Günün Fotoğrafı
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">
            Veri yüklenemedi
          </p>
        </div>
      </div>
    );
  }

  if (!apodData) {
    return null;
  }

  // Check if it's a video
  const isVideo = apodData.media_type === 'video';

  return (
    <Link to="/apod" className={`block ${className}`}>
      <div className="relative cursor-pointer">
        {/* 16:9 Aspect Ratio Container */}
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <div className="absolute inset-0 bg-black rounded-lg overflow-hidden">
            {isVideo ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-900">
                <div className="text-center text-white">
                  <div className="text-4xl mb-2">🎥</div>
                  <p className="text-sm">Video İçerik</p>
                </div>
              </div>
            ) : (
              <img
                src={apodData.url}
                alt={apodData.title}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  e.target.src = 'https://placehold.co/800x450/1a1a2e/ffffff?text=NASA+APOD';
                }}
              />
            )}
            
          </div>
        </div>

        {/* Card info */}
        <div className="mt-3">
          <h3 className="font-bold text-gray-900 dark:text-white text-base line-clamp-2 leading-tight">
            {apodData.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-xs mt-1 opacity-50">
            {formatDate(apodData.date)} - Günün Astronomi Fotoğrafı
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-xs mt-1 opacity-50">
            NASA tarafından
          </p>
        </div>
      </div>
    </Link>
  );
};

export default APODCard;
