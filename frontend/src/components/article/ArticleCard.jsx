import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LazyImage from '../LazyImage';
import { useAuth } from '../../contexts/AuthContext';
import { savedArticlesAPI } from '../../services/api';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';

const ArticleCard = ({ article }) => {
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const displayDescription = article.description || (article.content ? article.content.substring(0, 120) + '...' : '');
  const placeholderImage = `https://placehold.co/400x400/F8F8F8/CCCCCC?text=${encodeURIComponent(article.title.substring(0,15))}`;

  // Check if article is saved
  useEffect(() => {
    const checkSaved = async () => {
      if (user && article.slug) {
        try {
          const result = await savedArticlesAPI.checkArticleSaved(article.slug);
          setIsSaved(result.isSaved);
        } catch (error) {
          console.error('Error checking saved status:', error);
        }
      }
    };
    checkSaved();
  }, [user, article.slug]);

  // Toggle save/unsave
  const handleToggleSave = async (e) => {
    e.preventDefault(); // Link'e tıklamayı engelle
    e.stopPropagation();
    
    if (!user) {
      window.location.href = '/login';
      return;
    }

    setIsLoading(true);
    try {
      const action = isSaved ? 'unsave' : 'save';
      await savedArticlesAPI.toggleSavedArticle(article.slug, action);
      setIsSaved(!isSaved);
    } catch (error) {
      console.error('Error toggling save:', error);
      alert(error.response?.data?.message || 'Bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

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

  // Calculate reading time (average 200 words per minute)
  const getReadingTime = (text) => {
    if (!text) return '';
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.round(words / 200));
    return `${minutes} dk okuma`;
  };

  return (
    <div className="block relative group">
      <Link
        to={`/articles/${article.slug}`}
        className="block"
        aria-label={`Makaleyi oku: ${article.title}`}
      >
        {/* Image Container - Apple style */}
        <div className="relative w-full aspect-[16/10] mb-4 overflow-hidden rounded-none md:rounded-2xl bg-gray-50 dark:bg-gray-800">
          <LazyImage
            src={article.coverImage || placeholderImage}
            alt={`Kapak görseli: ${article.title}`}
            className="w-full h-full object-cover object-center"
            placeholder={placeholderImage}
            style={{ 
              display: 'block',
              objectFit: 'cover',
              objectPosition: 'center',
              minHeight: '100%',
              minWidth: '100%'
            }}
          />
          
          {/* Save Button - Top Right */}
          {user && (
            <button
              onClick={handleToggleSave}
              disabled={isLoading}
              className="absolute top-3 right-3 p-2 transition-all duration-200 
                       opacity-0 group-hover:opacity-100
                       disabled:opacity-50 disabled:cursor-not-allowed
                       group/save"
              aria-label={isSaved ? 'Kayıtlardan kaldır' : 'Daha sonra oku için kaydet'}
            >
              {isSaved ? (
                <FaBookmark className="w-5 h-5 text-white dark:text-white drop-shadow-lg" />
              ) : (
                <FaRegBookmark className="w-5 h-5 text-white dark:text-white drop-shadow-lg" />
              )}
            </button>
          )}
        </div>
        
        {/* Content */}
        <div className="px-4 md:px-0 space-y-2">
          {/* Title - Apple-style typography */}
          <h3 className="text-[20px] font-bold text-gray-900 dark:text-white leading-snug tracking-tight">
            {article.title}
          </h3>
          
          {/* Description - Lighter weight */}
          <p className="text-[19px] text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed font-bold">
            {displayDescription}
          </p>
          
          {/* Metadata - Minimal */}
          {article.createdAt && (
            <div className="text-[19px] text-gray-400 dark:text-gray-500 font-bold pt-1 flex items-center gap-2">
              <span>{getTimeAgo(article.createdAt)}</span>
              <span>·</span>
              <span>{getReadingTime(article.content || article.description)}</span>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ArticleCard;
