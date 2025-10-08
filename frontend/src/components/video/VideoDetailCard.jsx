import React, { useState } from 'react';
import { FaHeart, FaShare } from 'react-icons/fa';

const VideoDetailCard = ({ 
  title = "Avrupa Yakası",
  source = "Openwall",
  date = "bugün",
  episode = "48. Bölüm",
  onLike,
  onShare,
  isLiked = false,
  className = "",
  likeCount = 0,
  shareCount = 0
}) => {
  const [liked, setLiked] = useState(isLiked);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleLike = () => {
    setIsAnimating(true);
    setLiked(!liked);
    if (onLike) {
      onLike(!liked);
    }
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleShare = () => {
    if (onShare) {
      onShare();
    } else {
      // Varsayılan paylaşım davranışı
      if (navigator.share) {
        navigator.share({
          title: title,
          text: `${title} - ${episode}`,
          url: window.location.href
        });
      } else {
        // Fallback: URL'yi panoya kopyala
        navigator.clipboard.writeText(window.location.href);
        alert('Link panoya kopyalandı!');
      }
    }
  };

  return (
    <div className={`bg-dark-secondary rounded-lg p-6 shadow-lg border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 ${className}`}>
      {/* Başlık */}
      <h1 className="text-2xl font-bold text-white mb-2 hover:text-gray-100 transition-colors duration-200">
        {title}
      </h1>
      
      {/* Meta bilgiler ve aksiyon butonları */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center text-gray-300 text-[17px]">
          <span className="font-medium">{source}</span>
          <span className="mx-2 w-1 h-1 bg-gray-500 rounded-full"></span>
          <span className="font-medium">{date}</span>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Beğen butonu */}
          <button
            onClick={handleLike}
            disabled={isAnimating}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 transform ${
              liked 
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:scale-105' 
                : 'bg-gray-700/50 text-white hover:bg-gray-600/50 hover:scale-105'
            } ${isAnimating ? 'scale-110' : ''}`}
          >
            <FaHeart className={`w-5 h-5 ${liked ? 'text-red-400 fill-current' : 'text-white'} ${isAnimating ? 'animate-pulse' : ''}`} />
            <span className="font-medium">Beğen</span>
            {likeCount > 0 && (
              <span className="text-xs bg-gray-600/50 px-2 py-1 rounded-full">
                {likeCount}
              </span>
            )}
          </button>
          
          {/* Paylaş butonu */}
          <button
            onClick={handleShare}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-700/50 text-white rounded-lg hover:bg-gray-600/50 hover:scale-105 transition-all duration-200"
          >
            <FaShare className="w-5 h-5" />
            <span className="font-medium">Paylaş</span>
            {shareCount > 0 && (
              <span className="text-xs bg-gray-600/50 px-2 py-1 rounded-full">
                {shareCount}
              </span>
            )}
          </button>
        </div>
      </div>
      
      {/* Ayırıcı çizgi */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent mb-4"></div>
      
      {/* Bölüm bilgisi */}
      <div className="text-gray-300 text-lg font-bold">
        {episode}
      </div>
    </div>
  );
};

export default VideoDetailCard; 