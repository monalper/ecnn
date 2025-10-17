import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { savedArticlesAPI } from '../services/api';
import ArticleCard from '../components/article/ArticleCard';
import LoadingSpinner from '../components/LoadingSpinner';
import MetaTags from '../components/seo/MetaTags';

const SavedArticlesPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Arama ve sıralama state'leri
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }

    const fetchSavedArticles = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const data = await savedArticlesAPI.getSavedArticles();
        setArticles(data);
      } catch (err) {
        console.error('Error fetching saved articles:', err);
        setError('Kaydedilen makaleler yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    fetchSavedArticles();
  }, [user, authLoading, navigate]);

  // Filtrelenmiş ve sıralanmış makaleler
  const filteredArticles = useMemo(() => {
    let filtered = [...articles];
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(article => {
        const titleMatch = article.title?.toLowerCase().includes(query);
        const descriptionMatch = article.description?.toLowerCase().includes(query);
        const contentMatch = article.content?.toLowerCase().includes(query);
        return titleMatch || descriptionMatch || contentMatch;
      });
    }
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title, 'tr'));
        break;
      default:
        break;
    }
    return filtered;
  }, [articles, searchQuery, sortBy]);

  if (authLoading || loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <MetaTags
        title="Kaydedilen Makaleler - OpenWall"
        description="Daha sonra okumak için kaydettiğiniz makaleler"
        path="/saved-articles"
      />
      <div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12 pt-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
              Kaydedilenler
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Daha sonra okumak için kaydettiğiniz makaleler
            </p>
          </div>

          {/* Filtreler */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Arama Inputu */}
              <input
                type="text"
                placeholder="Ara..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-56 px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-full text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-colors"
              />
              {/* Sıralama Seçici */}
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="ml-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-full text-sm text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="newest">En Yeni</option>
                <option value="oldest">En Eski</option>
                <option value="title">Alfabetik</option>
              </select>
            </div>
            {/* Sonuç Sayısı */}
            <div className="text-sm text-slate-400 dark:text-slate-500 flex-shrink-0">
              {filteredArticles.length === articles.length ? (
                <span>{articles.length} makale</span>
              ) : (
                <span>{filteredArticles.length} / {articles.length} makale</span>
              )}
            </div>
          </div>

          {/* Articles Grid */}
          {filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {filteredArticles.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                Henüz kaydedilmiş makale yok
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Makaleleri daha sonra okumak için kaydedin
              </p>
              <button
                onClick={() => navigate('/articles')}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-colors duration-200"
              >
                Makalelere Göz At
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SavedArticlesPage;

