import React, { useState, useEffect } from 'react'; 
import { Link } from 'react-router-dom';
import LoadingSpinner from '../LoadingSpinner';

const AsteroidCard = ({ className = '' }) => {
  const [asteroidData, setAsteroidData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const NASA_API_KEY = import.meta.env.VITE_NASA_API_KEY || 'DEMO_KEY';

  useEffect(() => {
    const fetchAsteroidData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const today = new Date().toISOString().split('T')[0];
        const response = await fetch(
          `https://api.nasa.gov/neo/rest/v1/feed?start_date=${today}&end_date=${today}&api_key=${NASA_API_KEY}`
        );
        
        if (!response.ok) {
          if (response.status === 429) throw new Error('API rate limit aşıldı');
          if (response.status === 404) throw new Error('Zamanda seyehat edemezsin.');
          throw new Error(`NASA API hatası: ${response.status}`);
        }
        
        const data = await response.json();
        if (data.error) throw new Error(data.error.message || 'Bilinmeyen hata');
        
        const todayAsteroids = data.near_earth_objects[today] || [];
        const processedData = {
          count: todayAsteroids.length,
          asteroids: todayAsteroids.slice(0, 3),
          totalCount: data.element_count || 0
        };
        setAsteroidData(processedData);
      } catch (err) {
        console.error('Asteroid data fetch error:', err);
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

  if (loading) {
    return (
      <div className={`relative ${className}`}>
        <div className="relative w-full" style={{ paddingBottom: '75%' }}>
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 rounded-none md:rounded-lg flex items-center justify-center">
            <LoadingSpinner size="small" text="Yükleniyor..." />
          </div>
        </div>
        <div className="px-4 md:px-0 mt-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3"></div>
        </div>
      </div>
    );
  }

  if (error || !asteroidData) {
    return (
      <div className={`relative ${className}`}>
        <div className="relative w-full" style={{ paddingBottom: '75%' }}>
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 rounded-none md:rounded-lg flex items-center justify-center">
            <div className="text-center p-4">
              <div className="text-4xl mb-2">☄️</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Veri yüklenemedi</p>
            </div>
          </div>
        </div>
        <div className="px-4 md:px-0 mt-3">
          <h3 className="font-bold text-gray-900 dark:text-white text-[20px]">
            Asteroid İzleme
          </h3>
          <p className="text-gray-400 dark:text-gray-500 text-[17px] mt-1 font-bold">
            Veri yüklenemedi
          </p>
        </div>
      </div>
    );
  }

  const { count, isFallback } = asteroidData;

  return (
    <Link to="/asteroid" className={`block ${className}`}>
      <div className="relative cursor-pointer">
        {/* 4:3 Aspect Ratio Container */}
        <div className="relative w-full" style={{ paddingBottom: '75%' }}>
          <div className="absolute inset-0 rounded-none md:rounded-lg overflow-hidden">
            <img
              src="https://images.aeonmedia.co/images/78cf8853-e080-41a1-b53b-a8470516bb3c/essay-crescent_comet_67p.jpg?width=1920&quality=75&format=auto"
              alt="Asteroid"
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                e.target.src = 'https://placehold.co/800x600/1a1a2e/ffffff?text=Asteroid';
              }}
            />
          </div>
        </div>

        {/* Card info */}
        <div className="px-4 md:px-0 mt-3">
          <h3 className="font-bold text-gray-900 dark:text-white text-[20px] line-clamp-2 leading-tight">
            {isFallback ? 'Asteroid Verileri' : `${count} Asteroid Tespit Edildi`}
          </h3>

          {/* Tarih ve NASA yan yana */}
          <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500 text-[19px] mt-1 font-bold">
            <span>
              {new Date().toLocaleDateString('tr-TR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
            <span>·</span>
            <span>NASA tarafından</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default AsteroidCard;
