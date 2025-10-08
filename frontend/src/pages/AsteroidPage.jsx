import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import MetaTags from '../components/seo/MetaTags';
import SchemaMarkup from '../components/seo/SchemaMarkup';
import LoadingSpinner from '../components/LoadingSpinner';
import DatePicker from '../components/DatePicker';
import AsteroidDetailModal from '../components/NASA/AsteroidDetailModal';

const AsteroidPage = () => {
  const navigate = useNavigate();
  const [asteroidData, setAsteroidData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [scrollPercent, setScrollPercent] = useState(0);
  const [selectedAsteroid, setSelectedAsteroid] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // NASA API key - in production, this should be in environment variables
  const NASA_API_KEY = import.meta.env.VITE_NASA_API_KEY || 'DEMO_KEY';

  // Scroll progress tracking
  useEffect(() => {
    const handleScroll = () => {
      const articleContent = document.querySelector('.prose');
      if (articleContent) {
        const rect = articleContent.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        if (rect.top <= windowHeight) {
          const contentHeight = articleContent.scrollHeight;
          const contentTop = articleContent.offsetTop;
          const scrollTop = window.scrollY;
          
          const contentScrollTop = Math.max(0, scrollTop - contentTop);
          const contentVisibleHeight = Math.min(contentHeight, windowHeight);
          
          let percent = 0;
          if (contentScrollTop > 0) {
            percent = Math.min(100, (contentScrollTop / (contentHeight - contentVisibleHeight)) * 100);
          }
          
          setScrollPercent(Math.max(0, Math.min(100, percent)));
        } else {
          setScrollPercent(0);
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch asteroid data
  useEffect(() => {
    const fetchAsteroidData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(
          `https://api.nasa.gov/neo/rest/v1/feed?start_date=${selectedDate}&end_date=${selectedDate}&api_key=${NASA_API_KEY}`
        );
        
        if (!response.ok) {
          if (response.status === 429) {
            throw new Error('NASA API rate limit aşıldı. Lütfen daha sonra tekrar deneyin veya kendi API anahtarınızı kullanın.');
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

  // Format approach distance
  const formatDistance = (distance) => {
    if (!distance) return 'Bilinmiyor';
    const dist = parseFloat(distance);
    if (dist > 1000000) {
      return `${(dist / 1000000).toFixed(1)} milyon km`;
    } else if (dist > 1000) {
      return `${(dist / 1000).toFixed(1)} bin km`;
    }
    return `${dist.toFixed(0)} km`;
  };

  // Format velocity
  const formatVelocity = (velocity) => {
    if (!velocity) return 'Bilinmiyor';
    const vel = parseFloat(velocity);
    return `${vel.toFixed(0)} km/s`;
  };

  // Navigation functions
  const goToPreviousDay = () => {
    const currentDate = new Date(selectedDate);
    const previousDate = new Date(currentDate);
    previousDate.setDate(previousDate.getDate() - 1);
    const dateString = previousDate.toISOString().split('T')[0];
    setSelectedDate(dateString);
  };

  const goToNextDay = () => {
    const currentDate = new Date(selectedDate);
    const nextDate = new Date(currentDate);
    nextDate.setDate(nextDate.getDate() + 1);
    const dateString = nextDate.toISOString().split('T')[0];
    setSelectedDate(dateString);
  };

  const goToToday = () => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
  };

  // Handle date picker change
  const handleDateChange = (newDate) => {
    const year = newDate.getFullYear();
    const month = String(newDate.getMonth() + 1).padStart(2, '0');
    const day = String(newDate.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    setSelectedDate(dateString);
  };

  // Handle asteroid detail modal
  const handleAsteroidClick = (asteroid) => {
    setSelectedAsteroid(asteroid);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAsteroid(null);
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <LoadingSpinner size="medium" text="Asteroid Verileri Yükleniyor..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="max-w-2xl mx-auto px-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Hata</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          
          {error.includes('rate limit') && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">API Anahtarı Nasıl Alınır?</h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
                NASA API'si ücretsizdir ve kendi anahtarınızı alabilirsiniz:
              </p>
              <ol className="text-sm text-yellow-700 dark:text-yellow-300 list-decimal list-inside space-y-1">
                <li><a href="https://api.nasa.gov/" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">https://api.nasa.gov/</a> adresine gidin</li>
                <li>Formu doldurarak ücretsiz API anahtarı alın</li>
                <li>Anahtarı proje ortam değişkenlerine ekleyin: <code className="bg-yellow-100 dark:bg-yellow-800 px-1 rounded">VITE_NASA_API_KEY</code></li>
              </ol>
            </div>
          )}
          
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  if (!asteroidData) {
    return (
      <div className="text-center py-20">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Veri Bulunamadı</h1>
          <p className="text-gray-600 dark:text-gray-400">Bu tarih için asteroid verisi bulunamadı.</p>
        </div>
      </div>
    );
  }

  const todayAsteroids = asteroidData.near_earth_objects[selectedDate] || [];
  const totalCount = asteroidData.element_count || 0;

  // Page metadata
  const pageTitle = `Asteroid İzleme - ${selectedDate} Tarihli Dünya'ya Yakın Asteroidler`;
  const pageDescription = `${selectedDate} tarihinde tespit edilen ${totalCount} asteroid hakkında detaylı bilgiler. NASA'nın Near Earth Object Web Service verileri.`;
  const pageUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/asteroid`
    : '';

  return (
    <>
      <MetaTags
        title={pageTitle}
        description={pageDescription}
        keywords="asteroid, NASA, uzay, göktaşı, dünya yakını, NEO, asteroid izleme, uzay bilimi, astronomi"
        url={pageUrl}
        type="article"
        author="NASA"
        publishedTime={selectedDate}
        section="Astronomy"
        tags={["Asteroid", "NASA", "Space", "Astronomy", "Science", "Bilim", "Uzay"]}
      />
      
      <SchemaMarkup
        type="AsteroidPage"
        data={{
          title: pageTitle,
          description: pageDescription,
          url: pageUrl,
          author: "NASA",
          publishedTime: selectedDate,
          section: "Astronomy",
          keywords: "asteroid, NASA, uzay, göktaşı, dünya yakını, NEO, asteroid izleme, uzay bilimi, astronomi",
          asteroidCount: totalCount,
          date: selectedDate
        }}
        breadcrumbs={[
          { name: 'Ana Sayfa', url: 'https://openwall.com.tr' },
          { name: 'Asteroid İzleme', url: 'https://openwall.com.tr/asteroid' }
        ]}
      />

      <Header scrollPercent={scrollPercent} customTitle="asteroid" />

      {/* Hero Section - Large Header with Asteroid Background */}
      <div className="relative w-full h-[90vw] md:aspect-[4/3] md:h-[90vh] lg:h-[100vh] md:min-h-[650px] lg:min-h-[750px] bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-900">
        {/* Asteroid background image */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://www.esa.int/var/esa/storage/images/esa_multimedia/images/2024/04/asteroid_apophis/26021615-4-eng-GB/Asteroid_Apophis_pillars.jpg"
            alt="Asteroid Background"
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              e.target.src = 'https://placehold.co/1920x1080/1a1a2e/ffffff?text=Asteroid+Background';
            }}
          />
        </div>
        
        {/* Overlay with title */}
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Gradient overlay for better text readability */}
        <div className="hidden md:block absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-black via-black/90 via-black/80 via-black/70 via-black/60 via-black/50 via-black/40 via-black/30 via-black/20 via-black/10 via-black/5 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 lg:p-12">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
            <h1 className="hidden md:block text-[72px] font-garamond text-white font-medium leading-none max-w-4xl mb-4">
              Asteroid İzleme
            </h1>
            <p className="hidden md:block text-base md:text-lg lg:text-xl text-white/90 font-inter leading-relaxed max-w-3xl">
              {new Date(selectedDate).toLocaleDateString('tr-TR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })} - Dünya'ya Yakın Asteroidler
            </p>
          </div>
        </div>

        {/* Navigation arrows */}
        <div className="absolute top-1/2 left-4 right-4 flex justify-between transform -translate-y-1/2">
          <button
            onClick={goToPreviousDay}
            className="bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200 backdrop-blur-sm"
            title="Önceki gün"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNextDay}
            className="bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200 backdrop-blur-sm"
            title="Sonraki gün"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Today button */}
        <div className="absolute top-4 right-4">
          <button
            onClick={goToToday}
            className="bg-black/50 hover:bg-black/70 text-white px-4 py-2 rounded-full transition-all duration-200 backdrop-blur-sm text-sm"
            title="Bugün"
          >
            Bugün
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto py-6 md:py-8 lg:py-12">
          <div className="block lg:grid lg:grid-cols-4 lg:gap-12">
            
            {/* Mobile: Top, Desktop: Left - Metadata Sidebar */}
            <div className="order-1 lg:order-1 mb-8 lg:mb-0">
              <div className="lg:sticky lg:top-28 lg:self-start">
                {/* Mobile: Title and meta card */}
                <div className="block lg:hidden mb-6">
                  <h1 className="text-[42px] md:text-4xl lg:text-5xl xl:text-6xl font-garamond text-gray-900 dark:text-white font-medium leading-none max-w-4xl mb-4">
                    Asteroid İzleme
                  </h1>
                  
                  {/* Mobile Date Picker */}
                  <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tarih Seç
            </label>
                    <DatePicker
                      selectedDate={new Date(selectedDate + 'T00:00:00')}
                      onDateChange={handleDateChange}
                      minDate="1995-01-01"
                      maxDate={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <div>NASA Near Earth Object Web Service</div>
                    <div>{new Date(selectedDate).toLocaleDateString('tr-TR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</div>
                    <div>{totalCount} Asteroid Tespit Edildi</div>
                  </div>
                </div>

                {/* Desktop: Full metadata sidebar */}
                <div className="hidden lg:block">
                  {/* Article Title - Only visible when hero title is not visible */}
                  {scrollPercent > 1 && (
                    <div className="pb-3 mb-4 lg:mb-0">
                      <h1 className="text-xl font-inter font-bold text-gray-900 dark:text-white leading-tight">
                        Asteroid İzleme
                      </h1>
                    </div>
                  )}
                  
                  {/* NASA Information */}
                  <div className="pb-3 mb-4 lg:mb-0">
                    <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                      NASA Near Earth Object Web Service
                    </p>
                  </div>

                  {/* Date */}
                  <div className="pb-3 mb-4 lg:mb-0">
                    <p className="text-sm md:text-base text-gray-700">
                      {new Date(selectedDate).toLocaleDateString('tr-TR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>

                  {/* Asteroid Count */}
                  <div className="pb-3 mb-4 lg:mb-0">
                    <p className="text-sm md:text-base text-gray-700">
                      {totalCount} Asteroid Tespit Edildi
                    </p>
                  </div>

                  {/* Categories */}
                  <div className="pb-3 mb-4 lg:mb-0">
                    <div className="text-sm md:text-base text-black dark:text-white opacity-40">
                      #Asteroid #NASA #Space #Astronomy
                    </div>
                  </div>

                  {/* Date Picker */}
                  <div className="pb-4 mb-4 lg:mb-0">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tarih Seç
                    </label>
                    <DatePicker
                      selectedDate={new Date(selectedDate + 'T00:00:00')}
                      onDateChange={handleDateChange}
                      minDate="1995-01-01"
                      maxDate={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile: Bottom, Desktop: Right - Main Content */}
            <div className="order-2 lg:col-span-3">
              {/* Content with Initial Cap */}
              <div className="prose prose-sm md:prose-base lg:prose-lg max-w-none lg:-mt-8">
                <div className="relative mb-6 md:mb-8">
                  <div className="float-left mr-2 md:mr-3 mb-0">
                    <span 
                      className="article-initial-cap text-4xl md:text-5xl lg:text-8xl xl:text-9xl leading-none"
                      style={{ 
                        lineHeight: '0.8',
                        verticalAlign: 'top',
                        display: 'block'
                      }}
                    >
                      A
                    </span>
                  </div>
                  <div className="text-lg md:text-xl lg:text-[22px] leading-tight text-gray-800 dark:text-gray-200">
                    <p>
                      {selectedDate} tarihinde NASA'nın Near Earth Object Web Service verilerine göre toplam {totalCount} asteroid Dünya'ya yakın geçiş yapmıştır. Bu asteroidlerin detaylı bilgileri aşağıda listelenmektedir. Her asteroid için çap, yaklaşma mesafesi, hız ve potansiyel tehlike durumu gibi önemli bilgiler sunulmaktadır.
                    </p>
                  </div>
                </div>
          </div>

          {/* Asteroid List */}
              <div className="mt-8 md:mt-12">
                <h2 className="text-xl md:text-2xl font-inter font-bold text-gray-900 dark:text-white mb-4 md:mb-6">
              {selectedDate} Tarihli Asteroidler
            </h2>
            
            {todayAsteroids.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🌌</div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                  Bu Tarihte Asteroid Bulunamadı
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Seçilen tarihte Dünya'ya yakın geçen asteroid tespit edilmedi.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {todayAsteroids.map((asteroid, index) => {
                  const danger = getDangerLevel(asteroid);
                  const approachData = asteroid.close_approach_data?.[0];
                  
                  return (
                    <div key={asteroid.id || index} className="bg-gray-700 dark:bg-gray-700 rounded-lg p-6 hover:bg-gray-600 dark:hover:bg-gray-600 transition-colors duration-200 relative">
                      {/* Asteroid Designation - Top Left */}
                      <div className="mb-2">
                        <h3 className="text-xl font-bold text-white leading-tight">
                          {asteroid.name || `Asteroid ${index + 1}`}
                        </h3>
                        <p className="text-sm text-white/80">
                          ID: {asteroid.id || 'N/A'}
                        </p>
                      </div>
                      
                      {/* Risk Level */}
                      <div className="mb-6">
                        <span className={`text-sm font-semibold ${
                          danger.level === 'Yüksek' ? 'text-red-400' : 
                          danger.level === 'Orta' ? 'text-yellow-400' : 
                          'text-green-400'
                        }`}>
                          Risk: {danger.level}
                        </span>
                      </div>
                      
                      {/* Data Labels and Values */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-white text-sm">Çap</span>
                          <span className="text-white font-semibold">
                            {formatAsteroidSize(asteroid.estimated_diameter?.kilometers)}
                          </span>
                        </div>
                        
                        {approachData && (
                          <>
                            <div className="flex justify-between items-center">
                              <span className="text-white text-sm">Hız</span>
                              <span className="text-white font-semibold">
                                {formatVelocity(approachData.relative_velocity?.kilometers_per_second)}
                              </span>
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <span className="text-white text-sm">Yaklaşma</span>
                              <span className="text-white font-semibold">
                                {new Date(approachData.close_approach_date).toLocaleDateString('tr-TR')}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                      
                      {/* Arrow Icon - Bottom Right */}
                      <div className="absolute bottom-4 right-4">
                        <div 
                          onClick={() => handleAsteroidClick(asteroid)}
                          className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                        >
                          <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Asteroid Detail Modal */}
      <AsteroidDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        asteroid={selectedAsteroid}
      />
    </>
  );
};

export default AsteroidPage;
