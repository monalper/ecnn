import React from 'react';
import { Link } from 'react-router-dom';
import { FaEye, FaClock } from 'react-icons/fa';

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
      <div className="w-full aspect-[5/4] bg-black dark:bg-slate-800 relative overflow-hidden">
        <img
          src={article.coverImage || placeholderImage}
          alt={`Kapak görseli: ${article.title}`}
          className="w-full h-full object-cover object-center"
          style={{ display: 'block' }}
          onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = placeholderImage; }}
          loading="lazy"
        />
      </div>
      
      <div className="px-0 pt-4 pb-1 text-left">
        <h3 className="text-[20px] font-extrabold text-[#181818] dark:text-slate-200 mb-2 leading-snug">{article.title}</h3>
        <p className="text-[15px] text-[#7b7b7b] dark:text-slate-400 line-clamp-2 leading-normal font-bold mb-3">{displayDescription}</p>
        
        {/* Time ago and view count */}
        <div className="flex items-center gap-4 text-[13px] text-[#7b7b7b] dark:text-slate-400">
          {article.createdAt && (
            <span className="flex items-center gap-1">
              <FaClock className="text-slate-500" size={12} />
              {getTimeAgo(article.createdAt)}
            </span>
          )}
          <span className="flex items-center gap-1">
            <FaEye className="text-slate-500" size={12} />
            {article.viewCount || 0} görüntülenme
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;
