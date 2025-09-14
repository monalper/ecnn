import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../LoadingSpinner';

const AsteroidCard = ({ className = '' }) => {
  const [asteroidData, setAsteroidData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // NASA API key - in production, this should be in environment variables
  const NASA_API_KEY = import.meta.env.VITE_NASA_API_KEY || 'DEMO_KEY';

  useEffect(() => {
    const fetchAsteroidData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Get today's date
        const today = new Date().toISOString().split('T')[0];
        
        // Fetch today's near earth objects
        const response = await fetch(
          `https://api.nasa.gov/neo/rest/v1/feed?start_date=${today}&end_date=${today}&api_key=${NASA_API_KEY}`
        );
        
        if (!response.ok) {
          if (response.status === 429) {
            throw new Error('API rate limit aşıldı');
          }
          if (response.status === 404) {
            throw new Error('Zamanda seyehat edemezsin.');
          }
          throw new Error(`NASA API hatası: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error.message || 'Bilinmeyen hata');
        }
        
        // Process asteroid data
        const todayAsteroids = data.near_earth_objects[today] || [];
        const processedData = {
          count: todayAsteroids.length,
          asteroids: todayAsteroids.slice(0, 3), // Show first 3 asteroids
          totalCount: data.element_count || 0
        };
        
        setAsteroidData(processedData);
      } catch (err) {
        console.error('Asteroid data fetch error:', err);
        // Fallback data if API fails
        setAsteroidData({
          count: 0,
          asteroids: [],
          totalCount: 0,
          isFallback: true
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAsteroidData();
  }, [NASA_API_KEY]);

  // Format asteroid size
  const formatAsteroidSize = (diameter) => {
    if (!diameter) return 'Bilinmiyor';
    const avgDiameter = (diameter.estimated_diameter_min + diameter.estimated_diameter_max) / 2;
    if (avgDiameter < 1) {
      return `${(avgDiameter * 1000).toFixed(0)} m`;
    }
    return `${avgDiameter.toFixed(1)} km`;
  };

  // Get danger level based on size and approach distance
  const getDangerLevel = (asteroid) => {
    const diameter = asteroid.estimated_diameter?.kilometers?.estimated_diameter_max || 0;
    const approachDistance = asteroid.close_approach_data?.[0]?.miss_distance?.kilometers || 0;
    
    if (diameter > 1 && approachDistance < 1000000) {
      return { level: 'Yüksek', color: 'text-red-500', bgColor: 'bg-red-100 dark:bg-red-900' };
    } else if (diameter > 0.5 && approachDistance < 5000000) {
      return { level: 'Orta', color: 'text-yellow-500', bgColor: 'bg-yellow-100 dark:bg-yellow-900' };
    } else {
      return { level: 'Düşük', color: 'text-green-500', bgColor: 'bg-green-100 dark:bg-green-900' };
    }
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

  if (error || !asteroidData) {
    return (
      <div className={`relative ${className}`}>
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <div className="text-center p-4">
              <div className="text-4xl mb-2">☄️</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Veri yüklenemedi</p>
            </div>
          </div>
        </div>
        <div className="mt-3">
          <h3 className="font-bold text-gray-900 dark:text-white text-base">
            Asteroid İzleme
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">
            Veri yüklenemedi
          </p>
        </div>
      </div>
    );
  }

  const { count, asteroids, totalCount, isFallback } = asteroidData;

  return (
    <Link to="/asteroid" className={`block ${className}`}>
      <div className="relative cursor-pointer">
        {/* 16:9 Aspect Ratio Container */}
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <div className="absolute inset-0 rounded-lg overflow-hidden">
            <img
              src="https://www.esa.int/var/esa/storage/images/esa_multimedia/images/2024/04/asteroid_apophis/26021615-4-eng-GB/Asteroid_Apophis_pillars.jpg"
              alt="Asteroid"
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                e.target.src = 'https://placehold.co/800x450/1a1a2e/ffffff?text=Asteroid';
              }}
            />
            
          </div>
        </div>

        {/* Card info */}
        <div className="mt-3">
          <h3 className="font-bold text-gray-900 dark:text-white text-base line-clamp-2 leading-tight">
            {isFallback ? 'Asteroid Verileri' : `${count} Asteroid Tespit Edildi`}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-xs mt-1 opacity-50">
            {new Date().toLocaleDateString('tr-TR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-xs mt-1 opacity-50">
            NASA tarafından
          </p>
        </div>
      </div>
    </Link>
  );
};

export default AsteroidCard;
