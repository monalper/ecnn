// ECNN - Kopya/frontend/src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import ArticleCard from '../components/article/ArticleCard';
import MetaTags from '../components/seo/MetaTags';
import SchemaMarkup from '../components/seo/SchemaMarkup';
import api from '../services/api';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [latestArticles, setLatestArticles] = useState([]);
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      setError(null);
      try {
        // Son eklenen 4 makaleyi getir
        const latestResponse = await api.get('/articles?limit=4&sort=newest');
        setLatestArticles(latestResponse.data);

        // Öne çıkan makaleleri getir
        const featuredResponse = await api.get('/articles/highlighted');
        setFeaturedArticles(featuredResponse.data);
      } catch (err) {
        console.error("Makaleler yüklenirken hata:", err);
        setError(err.response?.data?.message || 'Makaleler yüklenemedi.');
        setLatestArticles([]);
        setFeaturedArticles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

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
    <div className="min-h-screen bg-site-background dark:bg-slate-900">
      <MetaTags
        title="OpenWall - Teknoloji, Felsefe, Sanat, Spor ve Daha Fazlası"
        description="OpenWall, teknoloji, felsefe, sanat, spor, siyaset, ekonomi, sağlık, eğitim, çevre, sosyoloji, psikoloji, din, müzik, sinema, seyahat ve yemek gibi çeşitli alanlarda kaliteli içerikler sunan kapsamlı bir platformdur."
        keywords="teknoloji, felsefe, sanat, spor, siyaset, ekonomi, sağlık, eğitim, çevre, sosyoloji, psikoloji, din, müzik, sinema, seyahat, yemek, makale, haber, içerik, blog"
      />
      <SchemaMarkup />
      
      {/* Hero Section - OpenWall Grid Style */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl transition-colors dark:border dark:border-white/20 mb-8">
          <div className="relative h-[340px] md:h-[400px] flex items-center justify-center bg-[#101624] rounded-3xl overflow-hidden">
            {/* Grid background */}
            <div className="absolute inset-0 z-0">
              <svg width="100%" height="100%">
                <defs>
                  <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                    <path
                      d="M 60 0 L 0 0 0 60"
                      fill="none"
                      stroke="#2a3140"
                      strokeWidth="2"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>
            {/* Centered text */}
            <div className="relative z-10 text-center w-full flex flex-col items-center justify-center">
              <span className="text-white text-5xl md:text-6xl font-bold font-sans tracking-tight" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, letterSpacing: '-0.04em' }}>
                openwall
              </span>
              <div className="mt-8">
                <Link
                  to="/articles"
                  className="px-6 py-3 bg-brand-orange hover:bg-brand-orange/90 text-white font-semibold rounded-xl transition-colors"
                >
                  Makaleleri Keşfet
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Son Eklenen Makaleler Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            Son Eklenen Makaleler
          </h2>
        </div>

        {latestArticles.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-2">
              Henüz Makale Yok
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Yakında burada harika içerikler olacak!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {latestArticles.slice(0, 4).map(article => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        )}
      </div>

      {/* Öne Çıkan Makaleler Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            Öne Çıkan Makaleler
          </h2>
        </div>

        {featuredArticles.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">⭐</div>
            <h3 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-2">
              Henüz Öne Çıkan Makale Yok
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              En popüler içerikler burada görünecek!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
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
