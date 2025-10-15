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
import HeroApple from '../components/hero/HeroApple';

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
        const [allArticlesResponse, featuredResponse, videosResponse] = await Promise.all([
          getCached('/articles', {}, 2 * 60 * 1000),
          getCached('/articles/highlighted', {}, 5 * 60 * 1000),
          getCached('/videos', {}, 10 * 60 * 1000)
        ]);

        const allArticles = allArticlesResponse.data;
        if (allArticles.length > 0) {
          const heroCount = Math.min(5, allArticles.length);
          setHeroArticles(allArticles.slice(0, heroCount));
          setLatestArticles(allArticles.slice(0, 6));
        }

        setFeaturedArticles(featuredResponse.data);

        const allVideos = videosResponse.data;
        if (allVideos.length > 0) {
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

  useEffect(() => {
    if (heroArticles.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentHeroIndex((prevIndex) => (prevIndex + 1) % heroArticles.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [heroArticles.length]);

  const heroText = "openwall";
  const letters = heroText.split('');

  const calculateReadingTime = (content) => {
    if (!content) return 0;
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return '';
    const now = new Date();
    const publishedDate = new Date(dateString);
    const diffInMs = now - publishedDate;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInWeeks = Math.floor(diffInDays / 7);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInDays / 365);

    if (diffInYears > 0) return `${diffInYears} yıl önce`;
    else if (diffInMonths > 0) return `${diffInMonths} ay önce`;
    else if (diffInWeeks > 0) return `${diffInWeeks} hafta önce`;
    else if (diffInDays > 0) return `${diffInDays} gün önce`;
    else return 'Bugün';
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

  const getDynamicDescription = () => {
    if (latestArticles.length > 0) {
      const latestArticle = latestArticles[0];
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

      <HeroApple article={heroArticles?.[0]} fallbackVideo={heroVideo} />

      {/* Son Eklenen Makaleler Section */}
      <div id="main-content" className="px-0 sm:px-12 lg:px-20 xl:px-32 py-8 sm:py-12">
        <div className="mb-6 sm:mb-8 flex flex-row items-center gap-4 px-3 sm:px-0">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800 dark:text-white mb-0">
            Son Eklenen Makaleler
          </h2>
          <Link 
            to="/articles" 
            className="text-sm sm:text-base md:text-lg text-slate-500 dark:text-slate-500 font-bold hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
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
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800 dark:text-white mb-0">
            Son Eklenen Videolar
          </h2>
          <Link 
            to="/videos" 
            className="text-sm sm:text-base md:text-lg text-slate-500 dark:text-slate-500 font-bold hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
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
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800 dark:text-white mb-0">
            Astronomi
          </h2>
          <Link 
            to="/apod" 
            className="text-sm sm:text-base md:text-lg text-slate-500 dark:text-slate-500 font-bold hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
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
