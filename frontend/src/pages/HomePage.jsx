// ECNN - Kopya/frontend/src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import ArticleCard from '../components/article/ArticleCard';
import VideoCard from '../components/VideoCard';
import AdvertisementCard from '../components/AdvertisementCard';
import MetaTags from '../components/seo/MetaTags';
import SchemaMarkup from '../components/seo/SchemaMarkup';
import api from '../services/api';
import { Link } from 'react-router-dom';
import heroVideo from '../assets/hero.mp4';

const HomePage = () => {
  const [latestArticles, setLatestArticles] = useState([]);
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [latestVideos, setLatestVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      setError(null);
      try {
        // Son eklenen 6 makaleyi getir
        const latestResponse = await api.get('/articles?limit=6&sort=newest');
        setLatestArticles(latestResponse.data);

        // Öne çıkan makaleleri getir
        const featuredResponse = await api.get('/articles/highlighted');
        setFeaturedArticles(featuredResponse.data);

        // Son eklenen 6 videoyu getir
        const latestVideosResponse = await api.get('/videos?limit=6&sort=newest');
        setLatestVideos(latestVideosResponse.data);
      } catch (err) {
        console.error("Makaleler yüklenirken hata:", err);
        setError(err.response?.data?.message || 'Makaleler yüklenemedi.');
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
        title="OpenWall - Entellektüel İçerikler ve Makaleler"
        description="OpenWall, teknoloji, felsefe, sanat, spor, siyaset, ekonomi, sağlık, eğitim, çevre, sosyoloji, psikoloji, din, müzik, sinema, seyahat ve yemek gibi çeşitli alanlarda kaliteli içerikler sunan kapsamlı bir platformdur. Güncel makaleler, öne çıkan yazılar ve entellektüel tartışmalar."
        keywords="teknoloji, felsefe, sanat, spor, siyaset, ekonomi, sağlık, eğitim, çevre, sosyoloji, psikoloji, din, müzik, sinema, seyahat, yemek, makale, haber, içerik, blog, entellektüel, düşünce, analiz, araştırma"
        type="website"
      />
      <SchemaMarkup type="WebSite" />
      <SchemaMarkup type="Organization" />
      
      {/* Hero Section - OpenWall Grid Style */}
      <div className="px-3 sm:px-4 lg:px-8">
        <div className="relative rounded-2xl sm:rounded-3xl transition-colors mb-6 sm:mb-8 hero-section-border" style={{ border: '1px solid transparent' }}>
          <div className="relative h-[375px] sm:h-[475px] md:h-[575px] lg:h-[675px] xl:h-[750px] flex items-center justify-center bg-[#101624] rounded-2xl sm:rounded-3xl overflow-hidden">
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
            <div className="relative z-10 text-center w-full flex flex-col items-center justify-center px-4">
              <div 
                className="text-white text-4xl sm:text-5xl md:text-6xl font-bold font-sans tracking-tight"
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
      </div>

      {/* Son Eklenen Makaleler Section */}
      <div className="px-6 sm:px-8 lg:px-12 xl:px-16 py-8 sm:py-12">
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
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
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
            {latestArticles.slice(0, 4).map(article => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        )}
      </div>

      {/* Son Eklenen Videolar Section */}
      <div className="px-6 sm:px-8 lg:px-12 xl:px-16 py-8 sm:py-12">
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
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
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
            {latestVideos.slice(0, 8).map((video, index) => (
              <React.Fragment key={video.id}>
                <VideoCard video={video} />
                {/* Show advertisement card every 7 videos, starting after the 7th video */}
                {(index + 1) % 7 === 0 && (
                  <AdvertisementCard />
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      {/* Öne Çıkan Makaleler Section */}
      <div className="px-6 sm:px-8 lg:px-12 xl:px-16 py-8 sm:py-12">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white mb-2">
            Öne Çıkan Makaleler
          </h2>
        </div>

        {featuredArticles.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <div className="text-4xl sm:text-6xl mb-4">⭐</div>
            <h3 className="text-xl sm:text-2xl font-semibold text-slate-800 dark:text-white mb-2">
              Henüz Öne Çıkan Makale Yok
            </h3>
            <p className="text-sm sm:text-base text-slate-600 dark:text-[#f5f5f5] px-4">
              En popüler içerikler burada görünecek!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
            {featuredArticles.map(article => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
