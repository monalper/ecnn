import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { savedArticlesAPI } from '../services/api';
import ArticleCard from '../components/article/ArticleCard';
import LoadingSpinner from '../components/LoadingSpinner';
import MetaTags from '../components/seo/MetaTags';
import { FaBookmark } from 'react-icons/fa';

const SavedArticlesPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (authLoading || loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-black pt-20 pb-16">
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
      
      <div className="min-h-screen bg-white dark:bg-black pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12 pt-8">
            <div className="flex items-center gap-3 mb-4">
              <FaBookmark className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                Kaydedilenler
              </h1>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Daha sonra okumak için kaydettiğiniz makaleler
            </p>
          </div>

          {/* Articles Grid */}
          {articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {articles.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <FaBookmark className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
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

