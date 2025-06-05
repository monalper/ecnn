// ECNN - Kopya/frontend/src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import ArticleCard from '../components/article/ArticleCard';
import api from '../services/api';

const HomePage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get('/articles');
        setArticles(response.data);
      } catch (err) {
        console.error("Makaleler yüklenirken hata:", err.response?.data?.message || err.message);
        setError(err.response?.data?.message || 'Makaleler yüklenemedi.');
        setArticles([]);
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
    <div className="min-h-screen bg-site-background">
      {/* Hero Section - OpenWall Grid Style */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative h-[340px] md:h-[400px] flex items-center justify-center bg-[#101624] rounded-3xl overflow-hidden">
          {/* Grid background */}
          <div className="absolute inset-0 z-0">
            <svg width="100%" height="100%">
              <defs>
                <pattern
                  id="grid"
                  width="60"
                  height="60"
                  patternUnits="userSpaceOnUse"
                >
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
          <div className="relative z-10 text-center w-full">
            <span className="text-white text-5xl md:text-6xl font-bold">
              Open
              <span className="italic font-serif font-normal">Wall</span>
            </span>
          </div>
        </div>
      </div>

      {/* Articles Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {articles.length === 0 && !loading && (
          <div className="text-center py-10">
            <h2 className="text-2xl font-semibold text-text-muted">Henüz Makale Yok</h2>
            <p className="text-slate-500 mt-2">Yakında burada harika içerikler olacak!</p>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {articles.map(article => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
