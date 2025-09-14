import React from 'react';
import { Link } from 'react-router-dom';
import LazyImage from '../LazyImage';

const ArticleCard = ({ article }) => {
  const displayDescription = article.description || (article.content ? article.content.substring(0, 120) + '...' : '');
  const placeholderImage = `https://placehold.co/400x400/E2E8F0/A0AEC0?text=${encodeURIComponent(article.title.substring(0,15))}`;

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
    <Link
      to={`/articles/${article.slug}`}
      className="overflow-hidden block"
      aria-label={`Makaleyi oku: ${article.title}`}
      style={{ boxShadow: 'none' }}
    >
      <div className="w-full aspect-[16/9] sm:aspect-[16/9] bg-dark-secondary relative overflow-hidden rounded-lg">
        <LazyImage
          src={article.coverImage || placeholderImage}
          alt={`Kapak görseli: ${article.title}`}
          className="w-full h-full object-cover object-center"
          placeholder={placeholderImage}
        />
      </div>
      
      <div className="px-0 pt-3 sm:pt-4 pb-1 text-left">
        <h3 className="text-[22px] sm:text-[22px] font-semibold text-slate-900 dark:text-white leading-tight mb-2">
          {article.title}
        </h3>
        <p className="text-[16px] sm:text-[16px] md:text-[16px] lg:text-[16px] text-[#7b7b7b] dark:text-slate-400 line-clamp-2 leading-normal font-medium mb-2 sm:mb-3">{displayDescription}</p>
        
        {/* Time ago */}
        <div className="flex items-center gap-1 sm:gap-2 md:gap-4 text-[14px] sm:text-xs md:text-[13px] text-[#7b7b7b] dark:text-slate-400">
          {article.createdAt && (
            <div className="font-medium truncate">
              {getTimeAgo(article.createdAt)}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;
