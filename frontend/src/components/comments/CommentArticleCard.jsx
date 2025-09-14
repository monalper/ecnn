import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LazyImage from '../LazyImage';
import api from '../../services/api';

const CommentArticleCard = ({ articleSlug }) => {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/articles/${articleSlug}`);
        setArticle(response.data);
        setError(false);
      } catch (err) {
        console.error('Makale yüklenirken hata:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (articleSlug) {
      fetchArticle();
    }
  }, [articleSlug]);

  if (loading) {
    return (
      <div className="my-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="animate-pulse">
          <div className="flex space-x-4">
            <div className="w-24 h-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div className="flex-1 max-w-md space-y-2">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="my-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
        <p className="text-sm text-red-600 dark:text-red-400">
          Makale yüklenirken bir hata oluştu.
        </p>
      </div>
    );
  }

  const displayDescription = article.description || (article.content ? article.content.substring(0, 100) + '...' : '');
  const placeholderImage = `https://placehold.co/200x120/E2E8F0/A0AEC0?text=${encodeURIComponent(article.title.substring(0, 15))}`;

  // Calculate time since publication
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

  return (
    <div className="my-3 group">
      <Link
        to={`/articles/${article.slug}`}
        className="block p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer relative overflow-hidden"
        aria-label={`Makaleyi oku: ${article.title}`}
      >
        <div className="flex space-x-4 transition-all duration-300 group-hover:blur-sm">
          {/* Thumbnail */}
          <div className="flex-shrink-0 w-24 h-16 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
            <LazyImage
              src={article.coverImage || placeholderImage}
              alt={`Kapak görseli: ${article.title}`}
              className="w-full h-full object-cover object-center"
              placeholder={placeholderImage}
            />
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0 max-w-xs">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 leading-tight mb-1">
              {article.title}
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-normal mb-1">
              {displayDescription}
            </p>
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
              {article.createdAt && (
                <span className="font-medium">
                  {getTimeAgo(article.createdAt)}
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
          <span className="text-white font-semibold text-lg">
            Makaleyi oku
          </span>
        </div>
      </Link>
    </div>
  );
};

export default CommentArticleCard;
