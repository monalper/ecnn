import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '../components/layout/Header';
import MetaTags from '../components/seo/MetaTags';
import SchemaMarkup from '../components/seo/SchemaMarkup';
import LoadingSpinner from '../components/LoadingSpinner';
import DatePicker from '../components/DatePicker';

const ApodPage = () => {
  const { date } = useParams();
  const navigate = useNavigate();
  const [apodData, setApodData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scrollPercent, setScrollPercent] = useState(0);

  // NASA API key - in production, this should be in environment variables
  const NASA_API_KEY = import.meta.env.VITE_NASA_API_KEY || 'DEMO_KEY'; // You can get a free key from https://api.nasa.gov/

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

  // Fetch APOD data
  useEffect(() => {
    const fetchApodData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Validate date format (YYYY-MM-DD)
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        const targetDate = date || new Date().toISOString().split('T')[0];
        
        if (date && !dateRegex.test(date)) {
          throw new Error('Geçersiz tarih formatı. Lütfen YYYY-MM-DD formatında bir tarih girin.');
        }

        const response = await fetch(
          `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}&date=${targetDate}`
        );
        
        if (!response.ok) {
          if (response.status === 429) {
            throw new Error('NASA API rate limit aşıldı. Lütfen daha sonra tekrar deneyin veya kendi API anahtarınızı kullanın.');
          }
          throw new Error(`NASA API hatası: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error.message || 'Bilinmeyen hata');
        }
        
        setApodData(data);
      } catch (err) {
        // If it's a rate limit error and we're using DEMO_KEY, show a helpful message
        if (err.message.includes('rate limit') && NASA_API_KEY === 'DEMO_KEY') {
          setError('NASA API rate limit aşıldı. Lütfen daha sonra tekrar deneyin veya kendi API anahtarınızı kullanın.');
        } else {
          setError(err.message);
        }
        console.error('APOD data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchApodData();
  }, [date, NASA_API_KEY]);

  // Navigation functions
  const goToPreviousDay = () => {
    const currentDate = date ? new Date(date) : new Date();
    const previousDate = new Date(currentDate);
    previousDate.setDate(previousDate.getDate() - 1);
    const dateString = previousDate.toISOString().split('T')[0];
    navigate(`/apod/${dateString}`);
  };

  const goToNextDay = () => {
    const currentDate = date ? new Date(date) : new Date();
    const nextDate = new Date(currentDate);
    nextDate.setDate(nextDate.getDate() + 1);
    const dateString = nextDate.toISOString().split('T')[0];
    navigate(`/apod/${dateString}`);
  };

  const goToToday = () => {
    navigate('/apod');
  };

  // Handle date picker change
  const handleDateChange = (selectedDate) => {
    // Use local date to avoid timezone issues
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    navigate(`/apod/${dateString}`);
  };


  if (loading) {
    return (
      <div className="text-center py-20">
        <LoadingSpinner size="medium" text="NASA Fotoğrafı Yükleniyor..." />
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
          
          <div className="space-x-4">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Tekrar Dene
            </button>
            <button
              onClick={() => navigate('/apod')}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              Bugünün Fotoğrafı
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!apodData) {
    return (
      <div className="text-center py-20">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Veri Bulunamadı</h1>
          <p className="text-gray-600 dark:text-gray-400">Bu tarih için NASA fotoğrafı bulunamadı.</p>
        </div>
      </div>
    );
  }

  // Format date for display
  const displayDate = new Date(apodData.date).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Check if it's a video
  const isVideo = apodData.media_type === 'video';

  // Page metadata
  const pageTitle = `${apodData.title} - NASA Günün Astronomi Fotoğrafı`;
  const pageDescription = apodData.explanation?.substring(0, 160) || 'NASA Günün Astronomi Fotoğrafı';
  const pageUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/apod/${apodData.date}`
    : '';

  return (
    <>
      <MetaTags
        title={pageTitle}
        description={pageDescription}
        image={apodData.hdurl || apodData.url}
        url={pageUrl}
        type="article"
        author="NASA"
        publishedTime={apodData.date}
      />
      
      <SchemaMarkup
        type="Article"
        data={{
          title: apodData.title,
          description: pageDescription,
          image: apodData.hdurl || apodData.url,
          url: pageUrl,
          author: "NASA",
          publishedTime: apodData.date,
          section: "Astronomy",
          keywords: ["NASA", "APOD", "Astronomy", "Space", "Science"],
          content: apodData.explanation,
          tags: ["NASA", "APOD", "Astronomy", "Space"]
        }}
        breadcrumbs={[
          { name: 'Ana Sayfa', url: 'https://openwall.com.tr' },
          { name: 'NASA APOD', url: 'https://openwall.com.tr/apod' },
          { name: apodData.title, url: pageUrl }
        ]}
      />

      <Header scrollPercent={scrollPercent} customTitle="apod" />

      {/* Hero Section - Large Header Image/Video */}
      <div className="relative w-full h-[90vw] md:aspect-[4/3] md:h-[90vh] lg:h-[100vh] md:min-h-[650px] lg:min-h-[750px] bg-black">
        {isVideo ? (
          <iframe
            src={apodData.url}
            title={apodData.title}
            className="w-full h-full object-cover object-center"
            frameBorder="0"
            allowFullScreen
          />
        ) : (
          <img
            src={apodData.hdurl || apodData.url}
            alt={apodData.title}
            className="w-full h-full object-cover object-center opacity-90"
          />
        )}
        
        {/* Overlay with title */}
        <div className="absolute inset-0 bg-black/30"></div>
        
        {/* Gradient overlay for better text readability */}
        <div className="hidden md:block absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-black via-black/90 via-black/80 via-black/70 via-black/60 via-black/50 via-black/40 via-black/30 via-black/20 via-black/10 via-black/5 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 lg:p-12">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
            <h1 className="hidden md:block text-[72px] font-garamond text-white font-medium leading-none max-w-4xl mb-4">
              {apodData.title}
            </h1>
            <p className="hidden md:block text-base md:text-lg lg:text-xl text-white/90 font-inter leading-relaxed max-w-3xl">
              {displayDate} - NASA Günün Astronomi Fotoğrafı
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
                    {apodData.title}
                  </h1>
                  
                  {/* Mobile Date Picker */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tarih Seç
                    </label>
                    <DatePicker
                      selectedDate={date ? new Date(date + 'T00:00:00') : new Date()}
                      onDateChange={handleDateChange}
                      minDate="1995-06-16"
                      maxDate={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <div>NASA Günün Astronomi Fotoğrafı</div>
                    <div>{displayDate}</div>
                    {apodData.copyright && (
                      <div>© {apodData.copyright}</div>
                    )}
                  </div>
                </div>

                {/* Desktop: Full metadata sidebar */}
                <div className="hidden lg:block">
                  {/* Article Title - Only visible when hero title is not visible */}
                  {scrollPercent > 1 && (
                    <div className="pb-3 mb-4 lg:mb-0">
                      <h1 className="text-xl font-inter font-bold text-gray-900 dark:text-white leading-tight">
                        {apodData.title}
                      </h1>
                    </div>
                  )}
                  
                  {/* NASA Information */}
                  <div className="pb-3 mb-4 lg:mb-0">
                    <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                      NASA Günün Astronomi Fotoğrafı
                    </p>
                  </div>

                  {/* Date */}
                  <div className="pb-3 mb-4 lg:mb-0">
                    <p className="text-sm md:text-base text-gray-700">
                      {displayDate}
                    </p>
                  </div>

                  {/* Copyright */}
                  {apodData.copyright && (
                    <div className="pb-3 mb-4 lg:mb-0">
                      <p className="text-sm md:text-base text-gray-700">
                        © {apodData.copyright}
                      </p>
                    </div>
                  )}


                  {/* Categories */}
                  <div className="pb-3 mb-4 lg:mb-0">
                    <div className="text-sm md:text-base text-black dark:text-white opacity-40">
                      #Nasa #Apod #Astronomy
                    </div>
                  </div>

                  {/* Date Picker */}
                  <div className="pb-4 mb-4 lg:mb-0">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tarih Seç
                    </label>
                    <DatePicker
                      selectedDate={date ? new Date(date + 'T00:00:00') : new Date()}
                      onDateChange={handleDateChange}
                      minDate="1995-06-16"
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
                      {(apodData.explanation?.trim().charAt(0) || 'A').toUpperCase()}
                    </span>
                  </div>
                  <div 
                    className="text-lg md:text-xl lg:text-[22px] leading-tight text-gray-800 dark:text-gray-200"
                    dangerouslySetInnerHTML={{ 
                      __html: apodData.explanation?.replace(/^./, '') || '' 
                    }}
                  />
                </div>
              </div>

              {/* High Resolution Image Link */}
              {!isVideo && apodData.hdurl && (
                <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-gray-200">
                  <h2 className="text-xl md:text-2xl font-inter font-bold text-gray-900 dark:text-white mb-4 md:mb-6">
                    Yüksek Çözünürlük
                  </h2>
                  
                  {/* High Resolution Image Preview */}
                  <div className="mb-6">
                    <img
                      src={apodData.hdurl}
                      alt={`${apodData.title} - Yüksek Çözünürlük`}
                      className="w-full max-w-2xl rounded-lg shadow-lg"
                    />
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300 mb-6">
                    Bu fotoğraf NASA'nın resmi Günün Astronomi Fotoğrafı (APOD) sayfasından alınmıştır. Fotoğrafın yüksek çözünürlüklü versiyonunu yeni sekmede açmak için:
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href={apodData.hdurl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 transition-colors"
                    >
                      Yüksek Çözünürlüklü Görsel
                    </a>
                    <a
                      href="https://apod.nasa.gov/apod/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-gray-600 dark:bg-gray-700 text-white font-bold rounded-full hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
                    >
                      NASA APOD Resmi Sayfası
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ApodPage;
