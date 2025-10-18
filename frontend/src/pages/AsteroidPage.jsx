// frontend/src/pages/AsteroidPage.jsx
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../components/layout/Header';
import MetaTags from '../components/seo/MetaTags';
import SchemaMarkup from '../components/seo/SchemaMarkup';
import LoadingSpinner from '../components/LoadingSpinner';
import AsteroidDetailModal from '../components/NASA/AsteroidDetailModal';

const AsteroidPage = () => {
  const [asteroidData, setAsteroidData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [scrollPercent, setScrollPercent] = useState(0);
  const [bottomBarVisible, setBottomBarVisible] = useState(false);
  const [selectedAsteroid, setSelectedAsteroid] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const NASA_API_KEY = import.meta.env.VITE_NASA_API_KEY || 'DEMO_KEY';

  useEffect(() => {
    const handleScroll = () => {
      const articleContent = document.querySelector('.prose');
      if (articleContent) {
        const rect = articleContent.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const scrollTop = window.scrollY;
        const contentTop = rect.top;
        const contentBottom = rect.bottom;
        const shouldShowBottomBar =
          scrollTop > 100 && contentTop < windowHeight && contentBottom > 0;
        setBottomBarVisible(shouldShowBottomBar);
        const contentHeight = articleContent.scrollHeight;
        const contentTopOffset = articleContent.offsetTop;
        const contentScrollTop = Math.max(0, scrollTop - contentTopOffset);
        const contentVisibleHeight = Math.min(contentHeight, windowHeight);
        let percent = 0;
        if (contentScrollTop > 0) {
          percent = Math.min(
            100,
            (contentScrollTop / (contentHeight - contentVisibleHeight)) * 100
          );
        }
        setScrollPercent(Math.max(0, Math.min(100, percent)));
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchAsteroidData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://api.nasa.gov/neo/rest/v1/feed?start_date=${selectedDate}&end_date=${selectedDate}&api_key=${NASA_API_KEY}`
        );
        if (!response.ok) throw new Error(`NASA API hatası: ${response.status}`);
        const data = await response.json();
        setAsteroidData(data);
      } catch (err) {
        console.error('Asteroid data fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAsteroidData();
  }, [selectedDate, NASA_API_KEY]);

  const formatAsteroidSize = (diameter) => {
    if (!diameter) return 'Bilinmiyor';
    const avg =
      (diameter.estimated_diameter_min + diameter.estimated_diameter_max) / 2;
    return avg < 1 ? `${(avg * 1000).toFixed(0)} m` : `${avg.toFixed(1)} km`;
  };

  const formatDistance = (d) => {
    if (!d) return 'Bilinmiyor';
    const dist = parseFloat(d);
    if (dist > 1000000) return `${(dist / 1000000).toFixed(1)} milyon km`;
    if (dist > 1000) return `${(dist / 1000).toFixed(1)} bin km`;
    return `${dist.toFixed(0)} km`;
  };

  const formatVelocity = (v) => {
    if (!v) return 'Bilinmiyor';
    return `${parseFloat(v).toFixed(0)} km/s`;
  };

  const getDangerLevel = (a) => {
    const d = a.estimated_diameter?.kilometers?.estimated_diameter_max || 0;
    const dist = a.close_approach_data?.[0]?.miss_distance?.kilometers || 0;
    if (d > 1 && dist < 1000000) return { level: 'Yüksek' };
    if (d > 0.5 && dist < 5000000) return { level: 'Orta' };
    return { level: 'Düşük' };
  };

  const goToPreviousDay = () => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() - 1);
    setSelectedDate(date.toISOString().split('T')[0]);
  };
  const goToNextDay = () => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + 1);
    setSelectedDate(date.toISOString().split('T')[0]);
  };
  const goToToday = () =>
    setSelectedDate(new Date().toISOString().split('T')[0]);

  const handleAsteroidClick = (a) => {
    setSelectedAsteroid(a);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAsteroid(null);
  };

  if (loading)
    return (
      <div className="text-center py-20">
        <LoadingSpinner size="medium" text="Asteroid Verileri Yükleniyor..." />
      </div>
    );
  if (error)
    return (
      <div className="text-center py-20 text-red-600">
        Hata: {error}
      </div>
    );

  const todayAsteroids = asteroidData?.near_earth_objects[selectedDate] || [];
  const totalCount = asteroidData?.element_count || 0;

  const coverImage =
    'https://www.esa.int/var/esa/storage/images/esa_multimedia/images/2024/04/asteroid_apophis/26021615-4-eng-GB/Asteroid_Apophis_pillars.jpg';

  const pageTitle = `Asteroid İzleme — ${new Date(
    selectedDate
  ).toLocaleDateString('tr-TR')}`;
  const pageDescription = `${selectedDate} tarihinde tespit edilen ${totalCount} asteroid.`;
  const pageUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/asteroid`
      : '';

  return (
    <>
      <MetaTags
        title={pageTitle}
        description={pageDescription}
        image={coverImage}
        url={pageUrl}
      />
      <SchemaMarkup
        type="Article"
        data={{
          title: pageTitle,
          description: pageDescription,
          image: coverImage,
        }}
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Asteroid İzleme',
            description: pageDescription,
            url: pageUrl,
          })}
        </script>
      </Helmet>

      <Header scrollPercent={scrollPercent} />

      {/* Başlık + Kapak */}
      <div className="px-4 sm:px-6 lg:px-8 pt-20 md:pt-24 pb-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <div className="text-[20px] text-orange-500 font-medium mb-2">
              {new Date(selectedDate).toLocaleDateString('tr-TR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
              Asteroid İzleme
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              NASA NEO verilerine göre {totalCount} asteroidin özet ve detayları.
            </p>
          </div>

          <div className="w-full h-[50vw] md:h-[400px] lg:h-[500px] rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 relative">
            <img
              src={coverImage}
              alt="Asteroid"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-4 flex justify-between">
              <button
                onClick={goToPreviousDay}
                className="bg-black/50 hover:bg-black/70 text-white p-3 rounded-full backdrop-blur-sm"
                title="Önceki"
              >
                ←
              </button>
              <button
                onClick={goToNextDay}
                className="bg-black/50 hover:bg-black/70 text-white p-3 rounded-full backdrop-blur-sm"
                title="Sonraki"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* İçerik */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto pt-4 pb-12">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            NASA Near Earth Object Web Service •{' '}
            {new Date(selectedDate).toLocaleDateString('tr-TR')} • {totalCount}{' '}
            asteroid
          </div>

          <p className="text-lg text-gray-800 dark:text-gray-200 mb-8">
            {selectedDate} tarihinde tespit edilen nesnelerin çap, hız, yaklaşma
            tarihi ve potansiyel tehlike seviyeleri aşağıda listelenmiştir.
          </p>

          <section>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {selectedDate} Tarihli Asteroidler
            </h2>

            {todayAsteroids.length === 0 ? (
              <div className="text-center py-12 text-gray-600 dark:text-gray-400">
                🌌 Bu tarihte asteroid bulunamadı.
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {todayAsteroids.map((asteroid, i) => {
                  const danger = getDangerLevel(asteroid);
                  const approach = asteroid.close_approach_data?.[0];
                  return (
                    <div
                      key={asteroid.id || i}
                      className="rounded-xl bg-white dark:bg-gray-800 p-5 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white leading-tight">
                              {asteroid.name || `Asteroid ${i + 1}`}
                            </h3>
                            <p className="text-xs text-gray-500 mt-0.5">
                              ID: {asteroid.id || 'N/A'}
                            </p>
                          </div>
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                              danger.level === 'Yüksek'
                                ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300'
                                : danger.level === 'Orta'
                                ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300'
                                : 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
                            }`}
                          >
                            {danger.level}
                          </span>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-300">
                              Çap
                            </span>
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {formatAsteroidSize(
                                asteroid.estimated_diameter?.kilometers
                              )}
                            </span>
                          </div>

                          {approach && (
                            <>
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-300">
                                  Hız
                                </span>
                                <span className="font-semibold text-gray-900 dark:text-white">
                                  {formatVelocity(
                                    approach.relative_velocity
                                      ?.kilometers_per_second
                                  )}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-300">
                                  Yaklaşma
                                </span>
                                <span className="font-semibold text-gray-900 dark:text-white">
                                  {new Date(
                                    approach.close_approach_date
                                  ).toLocaleDateString('tr-TR')}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-300">
                                  Mesafe
                                </span>
                                <span className="font-semibold text-gray-900 dark:text-white">
                                  {formatDistance(
                                    approach.miss_distance?.kilometers
                                  )}
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="mt-5 flex justify-end">
                        <button
                          onClick={() => handleAsteroidClick(asteroid)}
                          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-gray-900 dark:text-gray-100 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
                        >
                          Detay
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Sticky bottom bar */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-black backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50 transition-transform duration-300"
        style={{
          transform: bottomBarVisible ? 'translateY(0)' : 'translateY(100%)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="hidden md:flex items-center justify-between py-3 gap-4">
            <div className="flex items-center gap-3 text-sm">
              <h1 className="font-medium text-gray-900 dark:text-white">
                Asteroid İzleme
              </h1>
              <span className="text-gray-400">•</span>
              <div className="text-gray-600 dark:text-gray-400">
                {new Date(selectedDate).toLocaleDateString('tr-TR')}
              </div>
              <span className="text-gray-400">•</span>
              <div className="text-gray-600 dark:text-gray-400">
                {totalCount} asteroid
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={goToPreviousDay}
                className="px-3 py-1.5 rounded-full border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm"
              >
                ←
              </button>
              <button
                onClick={goToToday}
                className="px-3 py-1.5 rounded-full border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm"
              >
                Bugün
              </button>
              <button
                onClick={goToNextDay}
                className="px-3 py-1.5 rounded-full border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm"
              >
                →
              </button>
            </div>
          </div>
        </div>
        <div className="w-full h-1 bg-gray-200/50 dark:bg-gray-700/50">
          <div
            className="h-full transition-all duration-300"
            style={{
              width: `${scrollPercent}%`,
              backgroundColor: '#4B5563',
            }}
          />
        </div>
      </div>

      <AsteroidDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        asteroid={selectedAsteroid}
      />
    </>
  );
};

export default AsteroidPage;
