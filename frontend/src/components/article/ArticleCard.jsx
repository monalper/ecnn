import React from 'react';
import { Link } from 'react-router-dom';

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
      <div className="w-full aspect-[5/4] bg-dark-secondary relative overflow-hidden">
        <img
          src={article.coverImage || placeholderImage}
          alt={`Kapak görseli: ${article.title}`}
          className="w-full h-full object-cover object-center"
          style={{ display: 'block' }}
          onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = placeholderImage; }}
          loading="lazy"
        />
      </div>
      
      <div className="px-0 pt-3 sm:pt-4 pb-1 text-left">
        <h3 className="text-sm md:text-[20px] font-semibold md:font-bold text-slate-900 dark:text-white leading-tight mb-2">
          {article.title}
        </h3>
        <p className="text-[10px] sm:text-xs md:text-sm lg:text-[15px] text-[#7b7b7b] dark:text-slate-400 line-clamp-2 leading-normal font-bold mb-2 sm:mb-3">{displayDescription}</p>
        
        {/* Time ago and view count */}
        <div className="flex items-center gap-1 sm:gap-2 md:gap-4 text-[10px] sm:text-xs md:text-[13px] text-[#7b7b7b] dark:text-slate-400">
          {article.createdAt && (
            <div className="font-bold truncate">
              {getTimeAgo(article.createdAt)}
            </div>
          )}
          {article.createdAt && <span className="text-slate-500 flex-shrink-0">•</span>}
          <span className="font-bold truncate">
            {article.viewCount || 0} görüntülenme
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;
