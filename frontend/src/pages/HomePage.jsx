// ECNN - Kopya/frontend/src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import ArticleCard from '../components/article/ArticleCard';
import VideoCard from '../components/VideoCard';
import AdvertisementCard from '../components/AdvertisementCard';
import MetaTags from '../components/seo/MetaTags';
import SchemaMarkup from '../components/seo/SchemaMarkup';
import LoadingSpinner from '../components/LoadingSpinner';
import { APODCard, MoonPhaseCard } from '../components/NASA';
import AsteroidCard from '../components/NASA/AsteroidCard';
import api, { getCached } from '../services/api';
import { Link } from 'react-router-dom';
import heroVideo from '../assets/hero.mp4';

const HomePage = () => {
  const [latestArticles, setLatestArticles] = useState([]);
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [latestVideos, setLatestVideos] = useState([]);
  const [heroArticles, setHeroArticles] = useState([]);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      setError(null);
      try {
        // Paralel API çağrıları ile hızlandırma
        const [allArticlesResponse, featuredResponse, videosResponse] = await Promise.all([
          getCached('/articles', {}, 2 * 60 * 1000), // 2 dakika cache
          getCached('/articles/highlighted', {}, 5 * 60 * 1000), // 5 dakika cache
          getCached('/videos', {}, 10 * 60 * 1000) // 10 dakika cache
        ]);

        const allArticles = allArticlesResponse.data;
        
        if (allArticles.length > 0) {
          // Hero carousel için ilk 5 makaleyi al (veya varsa)
          const heroCount = Math.min(5, allArticles.length);
          setHeroArticles(allArticles.slice(0, heroCount));
          
          // Son eklenen 6 makaleyi al
          setLatestArticles(allArticles.slice(0, 6));
        }

        setFeaturedArticles(featuredResponse.data);

        const allVideos = videosResponse.data;
        if (allVideos.length > 0) {
          // Videoları oluşturulma tarihine göre sırala
          const sortedVideos = allVideos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setLatestVideos(sortedVideos.slice(0, 6));
        }
      } catch (err) {
        console.error("Makaleler yüklenirken hata:", err);
        setError(err.response?.data?.message || 'Makaleler yüklenemedi.');
        setHeroArticles([]);
        setLatestArticles([]);
        setFeaturedArticles([]);
        setLatestVideos([]);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  // Auto-rotate hero carousel every 7 seconds
  useEffect(() => {
    if (heroArticles.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentHeroIndex((prevIndex) => (prevIndex + 1) % heroArticles.length);
    }, 7000); // 7 seconds

    return () => clearInterval(interval);
  }, [heroArticles.length]);

  // Split "openwall" text into individual letters for animation
  const heroText = "openwall";
  const letters = heroText.split('');

  // Calculate reading time based on content length
  const calculateReadingTime = (content) => {
    if (!content) return 0;
    const wordsPerMinute = 200; // Average reading speed
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

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

  // Get time ago text
  const getTimeAgo = (dateString) => {
    if (!dateString) return '';
    
    const now = new Date();
    const publishedDate = new Date(dateString);
    const diffInMs = now - publishedDate;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInWeeks = Math.floor(diffInDays / 7);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInDays / 365);

    if (diffInYears > 0) {
      return `${diffInYears} yıl önce`;
    } else if (diffInMonths > 0) {
      return `${diffInMonths} ay önce`;
    } else if (diffInWeeks > 0) {
      return `${diffInWeeks} hafta önce`;
    } else if (diffInDays > 0) {
      return `${diffInDays} gün önce`;
    } else {
      return 'Bugün';
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <LoadingSpinner size="medium" text="Makaleler Yükleniyor..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 px-4">
        <h2 className="text-2xl font-semibold text-red-600 mb-4">Bir Hata Oluştu</h2>
        <p className="text-text-muted">{error}</p>
      </div>
    );
  }
  
  // Son yazılan makale için dinamik description oluştur
  const getDynamicDescription = () => {
    if (latestArticles.length > 0) {
      const latestArticle = latestArticles[0]; // En son makale (zaten sıralı geliyor)
      return `Yazılmış son makale olan **${latestArticle.title}**'ye göz atın.`;
    }
    return "Openwall, teknoloji, felsefe, sanat, spor, siyaset, ekonomi, sağlık, eğitim, çevre, sosyoloji, psikoloji, din, müzik, sinema, seyahat ve yemek gibi çeşitli alanlarda kaliteli içerikler sunan kapsamlı bir platformdur.";
  };

  return (
    <div className="min-h-screen bg-site-background dark:bg-dark-primary overflow-x-hidden">
      <MetaTags
        title="The Openwall"
        description={getDynamicDescription()}
        keywords="teknoloji, felsefe, sanat, spor, siyaset, ekonomi, sağlık, eğitim, çevre, sosyoloji, psikoloji, din, müzik, sinema, seyahat, yemek, makale, haber, içerik, blog, entellektüel, düşünce, analiz, araştırma"
        type="website"
        isHomepage={true}
      />
      <SchemaMarkup type="WebSite" />
      <SchemaMarkup type="Organization" />
      
      {/* Hero Section - Full Width */}
      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
        {heroArticles.length > 0 ? (
          <Link to={`/articles/${heroArticles[currentHeroIndex].slug}`} className="block">
              <div className="relative transition-colors overflow-hidden cursor-pointer hover:opacity-95 transition-opacity duration-300 bg-black" style={{ margin: '0' }}>
              {/* Grid Overlay - Desktop */}
              <div className="hidden md:block hero-grid-overlay"></div>
              {/* Grid Overlay - Mobile */}
              <div className="md:hidden hero-grid-overlay-mobile"></div>
              {/* Desktop Layout: Split */}
              <div className="hidden md:flex h-[70vh] lg:h-[80vh] min-h-[500px] lg:min-h-[600px]">
                {/* Left Side - Content */}
                <div className="flex-1 flex flex-col justify-center p-8 lg:p-12 xl:p-16">
                  <div className="max-w-2xl">
                    {/* Date */}
                    {heroArticles[currentHeroIndex].createdAt && (
                      <div className="text-orange-500 text-[20px] font-bold mb-2">
                        {formatDate(heroArticles[currentHeroIndex].createdAt)}
                      </div>
                    )}
                    
                    {/* Title */}
                    <h1 className="text-[48px] font-inter text-white font-bold leading-tight mb-3">
                      {heroArticles[currentHeroIndex].title || 'OpenWall'}
                    </h1>
                    
                    {/* Description */}
                    {(heroArticles[currentHeroIndex].description || heroArticles[currentHeroIndex].content) && (
                      <p className="text-[20px] text-white/70 font-inter font-bold leading-relaxed mb-4 line-clamp-2">
                        {heroArticles[currentHeroIndex].description || (heroArticles[currentHeroIndex].content ? heroArticles[currentHeroIndex].content.substring(0, 200) + '...' : '')}
                      </p>
                    )}
                    
                    {/* Meta Information */}
                    <div className="flex items-center gap-6 text-sm text-white/80 font-bold">
                      {heroArticles[currentHeroIndex].createdAt && (
                        <span>{getTimeAgo(heroArticles[currentHeroIndex].createdAt)}</span>
                      )}
                      
                      <span>{heroArticles[currentHeroIndex].viewCount || 0} görüntülenme</span>
                      
                      <span>{calculateReadingTime(heroArticles[currentHeroIndex].content || '')} dk okuma süresi</span>
                    </div>
                  </div>
                </div>
                
                {/* Right Side - Image */}
                <div className="flex-1 relative">
                  <img
                    src={heroArticles[currentHeroIndex].coverImage || `https://placehold.co/800x500/E2E8F0/A0AEC0?text=${encodeURIComponent(heroArticles[currentHeroIndex].title?.substring(0,20) || 'OpenWall')}`}
                    alt={heroArticles[currentHeroIndex].title || 'OpenWall'}
                    className="w-full h-full object-cover object-center"
                    onError={(e) => {
                      e.target.src = `https://placehold.co/800x500/E2E8F0/A0AEC0?text=${encodeURIComponent(heroArticles[currentHeroIndex].title?.substring(0,20) || 'OpenWall')}`;
                    }}
                  />
                  {/* Gradient transition from left (black) to transparent */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 via-black/60 via-black/40 via-black/20 to-transparent"></div>
                </div>
              </div>
              
              {/* Mobile Layout: Overlay */}
              <div className="block md:hidden relative h-[55vh] min-h-[400px] max-h-[500px]">
                {/* Background Image */}
                <div className="absolute inset-0 bg-black">
                  <img
                    src={heroArticles[currentHeroIndex].coverImage || `https://placehold.co/800x500/E2E8F0/A0AEC0?text=${encodeURIComponent(heroArticles[currentHeroIndex].title?.substring(0,20) || 'OpenWall')}`}
                    alt={heroArticles[currentHeroIndex].title || 'OpenWall'}
                    className="w-full h-full object-cover object-center"
                    onError={(e) => {
                      e.target.src = `https://placehold.co/800x500/E2E8F0/A0AEC0?text=${encodeURIComponent(heroArticles[currentHeroIndex].title?.substring(0,20) || 'OpenWall')}`;
                    }}
                  />
                  {/* Gradient overlay from bottom to top */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 via-black/70 via-black/40 via-black/20 to-transparent"></div>
                  {/* Additional subtle gradient from left */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent"></div>
                </div>
                
                {/* Content - Positioned at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-6 pb-8 z-10">
                  <div className="max-w-2xl">
                    {/* Date */}
                    {heroArticles[currentHeroIndex].createdAt && (
                      <div className="text-orange-500 text-[16px] sm:text-[18px] font-bold mb-2">
                        {formatDate(heroArticles[currentHeroIndex].createdAt)}
                      </div>
                    )}
                    
                    {/* Title */}
                    <h1 className="text-[32px] sm:text-[40px] font-inter text-white font-bold leading-tight mb-3">
                      {heroArticles[currentHeroIndex].title || 'OpenWall'}
                    </h1>
                    
                    {/* Description */}
                    {(heroArticles[currentHeroIndex].description || heroArticles[currentHeroIndex].content) && (
                      <p className="text-[16px] sm:text-[18px] text-white/80 font-inter font-semibold leading-relaxed line-clamp-2">
                        {heroArticles[currentHeroIndex].description || (heroArticles[currentHeroIndex].content ? heroArticles[currentHeroIndex].content.substring(0, 150) + '...' : '')}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Carousel Indicators */}
              {heroArticles.length > 1 && (
                <div className="absolute bottom-4 left-6 md:left-8 lg:left-12 xl:left-16 flex items-center gap-2 z-20">
                  {heroArticles.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentHeroIndex(index);
                      }}
                      className={`relative overflow-hidden transition-all duration-300 rounded-full ${
                        index === currentHeroIndex
                          ? 'w-8 h-2'
                          : 'w-2 h-2'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    >
                      {index === currentHeroIndex ? (
                        <>
                          {/* Background bar */}
                          <div className="absolute inset-0 bg-white/30 rounded-full"></div>
                          {/* Progress bar */}
                          <div 
                            className="absolute inset-0 bg-white origin-left rounded-full"
                            style={{
                              animation: 'heroProgress 7s linear forwards',
                              animationPlayState: 'running'
                            }}
                            key={`progress-${currentHeroIndex}`}
                          ></div>
                        </>
                      ) : (
                        <div className="absolute inset-0 bg-white/50 hover:bg-white/75 transition-colors rounded-full"></div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </Link>
        ) : (
          <div className="relative transition-colors" style={{ border: '1px solid transparent', margin: '0' }}>
            <div className="relative h-[250px] sm:h-[300px] md:h-[400px] lg:h-[500px] xl:h-[600px] 2xl:h-[700px] flex items-center justify-center bg-[#101624] overflow-hidden">
              {/* Grid Overlay - Mobile only since this is fallback with video */}
              <div className="hero-grid-overlay-mobile"></div>
              {/* Video background */}
              <div className="absolute inset-0 z-0">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                  style={{ filter: 'brightness(0.6) contrast(1.1)' }}
                >
                  <source src={heroVideo} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              
              {/* Centered text with letter-by-letter animation */}
              <div className="relative z-10 text-center w-full flex flex-col items-center justify-center px-3 sm:px-4">
                <div 
                  className="text-white text-[48px] font-bold font-sans tracking-tight"
                  style={{ 
                    fontFamily: 'Inter, sans-serif', 
                    fontWeight: 700, 
                    letterSpacing: '-0.04em',
                    mixBlendMode: 'exclusion',
                    isolation: 'isolate'
                  }}
                >
                  {letters.map((letter, index) => (
                    <span
                      key={index}
                      className="animate-letter-reveal inline-block"
                      style={{
                        animationDelay: `${index * 0.1}s`,
                        animationFillMode: 'both'
                      }}
                    >
                      {letter}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Son Eklenen Makaleler Section */}
      <div className="px-0 sm:px-12 lg:px-20 xl:px-32 py-8 sm:py-12">
        <div className="mb-6 sm:mb-8 flex flex-row items-center gap-4 px-3 sm:px-0">
          <h2 className="text-[20px] font-bold text-slate-800 dark:text-white mb-0">
            Son Eklenen Makaleler
          </h2>
          <Link 
            to="/articles" 
            className="text-[20px] text-slate-500 dark:text-slate-500 font-bold hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
          >
            Tüm makaleleri gör
          </Link>
        </div>

        {latestArticles.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <div className="text-4xl sm:text-6xl mb-4">📝</div>
            <h3 className="text-xl sm:text-2xl font-semibold text-slate-800 dark:text-white mb-2">
              Henüz Makale Yok
            </h3>
            <p className="text-sm sm:text-base text-slate-600 dark:text-[#f5f5f5] px-4">
              Yakında burada harika içerikler olacak!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 sm:gap-4 md:gap-6 lg:gap-8">
            {latestArticles.slice(0, 6).map(article => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        )}
      </div>

      {/* Son Eklenen Videolar Section */}
      <div className="px-0 sm:px-12 lg:px-20 xl:px-32 py-8 sm:py-12">
        <div className="mb-6 sm:mb-8 flex flex-row items-center gap-4 px-3 sm:px-0">
          <h2 className="text-[20px] font-bold text-slate-800 dark:text-white mb-0">
            Son Eklenen Videolar
          </h2>
          <Link 
            to="/videos" 
            className="text-[20px] text-slate-500 dark:text-slate-500 font-bold hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
          >
            Tüm videoları gör
          </Link>
        </div>

        {latestVideos.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <div className="text-4xl sm:text-6xl mb-4">🎥</div>
            <h3 className="text-xl sm:text-2xl font-semibold text-slate-800 dark:text-white mb-2">
              Henüz Video Yok
            </h3>
            <p className="text-sm sm:text-base text-slate-600 dark:text-[#f5f5f5] px-4">
              Yakında burada harika videolar olacak!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
            {latestVideos.slice(0, 6).map((video, index) => (
              <VideoCard 
                key={video.id}
                video={video} 
                layout="horizontal"
                mobileLayout={true}
                showDuration={true}
                showUploadTime={true}
              />
            ))}
          </div>
        )}
      </div>

      {/* Astronomi Section */}
      <div className="px-0 sm:px-12 lg:px-20 xl:px-32 py-8 sm:py-12">
        <div className="mb-6 sm:mb-8 flex flex-row items-center gap-4 px-3 sm:px-0">
          <h2 className="text-[20px] font-bold text-slate-800 dark:text-white mb-0">
            Astronomi
          </h2>
          <Link 
            to="/apod" 
            className="text-[20px] text-slate-500 dark:text-slate-500 font-bold hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
          >
            Tüm astronomi verilerini gör
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
          <APODCard />
          <MoonPhaseCard />
          <AsteroidCard />
        </div>
      </div>
    </div>
  );
};

export default HomePage;