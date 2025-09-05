// ECNN - Kopya/frontend/src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import ArticleCard from '../components/article/ArticleCard';
import VideoCard from '../components/VideoCard';
import AdvertisementCard from '../components/AdvertisementCard';
import MetaTags from '../components/seo/MetaTags';
import SchemaMarkup from '../components/seo/SchemaMarkup';
import api, { getCached } from '../services/api';
import { Link } from 'react-router-dom';
import heroVideo from '../assets/hero.mp4';

const HomePage = () => {
  const [latestArticles, setLatestArticles] = useState([]);
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [latestVideos, setLatestVideos] = useState([]);
  const [heroArticle, setHeroArticle] = useState(null);
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
          // Rastgele bir makale seç
          const randomIndex = Math.floor(Math.random() * allArticles.length);
          setHeroArticle(allArticles[randomIndex]);
          
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
        setHeroArticle(null);
        setLatestArticles([]);
        setFeaturedArticles([]);
        setLatestVideos([]);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  // Split "openwall" text into individual letters for animation
  const heroText = "openwall";
  const letters = heroText.split('');

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange mx-auto"></div>
        <p className="mt-4 text-lg font-semibold text-text-muted">Makaleler Yükleniyor...</p>
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
  
  return (
    <div className="min-h-screen bg-site-background dark:bg-dark-primary">
      <MetaTags
        title="Home"
        description="OpenWall, teknoloji, felsefe, sanat, spor, siyaset, ekonomi, sağlık, eğitim, çevre, sosyoloji, psikoloji, din, müzik, sinema, seyahat ve yemek gibi çeşitli alanlarda kaliteli içerikler sunan kapsamlı bir platformdur. Güncel makaleler, öne çıkan yazılar ve entellektüel tartışmalar."
        keywords="teknoloji, felsefe, sanat, spor, siyaset, ekonomi, sağlık, eğitim, çevre, sosyoloji, psikoloji, din, müzik, sinema, seyahat, yemek, makale, haber, içerik, blog, entellektüel, düşünce, analiz, araştırma"
        type="website"
      />
      <SchemaMarkup type="WebSite" />
      <SchemaMarkup type="Organization" />
      
      {/* Hero Section - Random Article Display */}
      <div className="px-2 sm:px-4 lg:px-8">
        {heroArticle ? (
          <Link to={`/articles/${heroArticle.slug}`} className="block">
            <div className="relative rounded-xl sm:rounded-2xl lg:rounded-3xl transition-colors mb-4 sm:mb-6 lg:mb-8 overflow-hidden cursor-pointer hover:opacity-95 transition-opacity duration-300">
              <div className="relative w-full h-[90vw] md:aspect-[4/3] md:h-[70vh] lg:h-[80vh] md:min-h-[500px] lg:min-h-[600px] bg-black">
                <img
                  src={heroArticle.coverImage || `https://placehold.co/800x500/E2E8F0/A0AEC0?text=${encodeURIComponent(heroArticle.title?.substring(0,20) || 'OpenWall')}`}
                  alt={heroArticle.title || 'OpenWall'}
                  className="w-full h-full object-cover object-center opacity-90"
                  onError={(e) => {
                    e.target.src = `https://placehold.co/800x500/E2E8F0/A0AEC0?text=${encodeURIComponent(heroArticle.title?.substring(0,20) || 'OpenWall')}`;
                  }}
                />
                {/* Overlay with title */}
                <div className="absolute inset-0 bg-black/30"></div>
                {/* Gradient overlay for better text readability - hidden on mobile */}
                <div className="hidden md:block absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-black via-black/90 via-black/80 via-black/70 via-black/60 via-black/50 via-black/40 via-black/30 via-black/20 via-black/10 via-black/5 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 lg:p-12">
                  <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
                    {/* Desktop title - hidden on mobile */}
                    <h1 className="hidden md:block text-4xl lg:text-5xl xl:text-[72px] font-['EB_Garamond'] text-white font-medium leading-tight max-w-4xl mb-4">
                      {heroArticle.title || 'OpenWall'}
                    </h1>
                    {/* Desktop description - hidden on mobile */}
                    {(heroArticle.description || heroArticle.content) && (
                      <p className="hidden md:block text-base md:text-lg lg:text-xl text-white/90 font-inter leading-relaxed max-w-3xl">
                        {heroArticle.description || (heroArticle.content ? heroArticle.content.substring(0, 180) + '...' : '')}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Mobile: Title and meta card - shown below hero on mobile */}
            <div className="block md:hidden mb-6">
              <h1 className="text-[42px] font-['EB_Garamond'] text-gray-900 dark:text-white font-medium leading-none max-w-4xl mb-4">
                {heroArticle.title || 'OpenWall'}
              </h1>
              {(heroArticle.description || heroArticle.content) && (
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {heroArticle.description || (heroArticle.content ? heroArticle.content.substring(0, 120) + '...' : '')}
                </p>
              )}
            </div>
          </Link>
        ) : (
          <div className="relative rounded-xl sm:rounded-2xl lg:rounded-3xl transition-colors mb-4 sm:mb-6 lg:mb-8 hero-section-border" style={{ border: '1px solid transparent' }}>
            <div className="relative h-[250px] sm:h-[300px] md:h-[400px] lg:h-[500px] xl:h-[600px] 2xl:h-[700px] flex items-center justify-center bg-[#101624] rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden">
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
                  className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold font-sans tracking-tight"
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
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 px-3 sm:px-0">
          <h2 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white mb-0">
            Son Eklenen Makaleler
          </h2>
          <Link 
            to="/articles" 
            className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 hover:text-brand-orange dark:hover:text-brand-orange font-normal transition-colors duration-200 self-start sm:self-auto"
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
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 px-3 sm:px-0">
          <h2 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white mb-0">
            Son Eklenen Videolar
          </h2>
          <Link 
            to="/videos" 
            className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 hover:text-brand-orange dark:hover:text-brand-orange font-normal transition-colors duration-200 self-start sm:self-auto"
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
    </div>
  );
};

export default HomePage;
