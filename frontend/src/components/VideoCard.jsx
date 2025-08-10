import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import thumbPlaceholder from '../assets/ThumbPlaceholder.png';

const VideoCard = ({ 
  video, 
  layout = 'vertical', // 'vertical' | 'horizontal'
  showDuration = true,
  showUploadTime = true,
  className = ''
}) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef(null);
  const hoverTimeoutRef = useRef(null);

  const handleClick = () => {
    navigate(`/videos/${video.id}`);
  };

  const handleMouseEnter = () => {
    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    // Start video after a short delay (YouTube-like behavior)
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(true);
      if (videoRef.current && video.videoUrl) {
        videoRef.current.currentTime = 0; // Start from beginning
        videoRef.current.play().catch(error => {
          console.log('Video autoplay failed:', error);
        });
      }
    }, 200); // 200ms delay like YouTube
  };

  const handleMouseLeave = () => {
    // Clear timeout if mouse leaves before delay
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0; // Reset to beginning
    }
  };

  const handleVideoLoad = () => {
    setIsVideoLoaded(true);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatUploadTime = (timestamp) => {
    if (!timestamp) return '';
    
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return '';
      
      const now = new Date();
      const diffTime = now.getTime() - date.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 0) return '';
      if (diffDays === 0) return 'bugün';
      if (diffDays === 1) return '1 gün önce';
      if (diffDays < 7) return `${diffDays} gün önce`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} hafta önce`;
      if (diffDays < 365) return `${Math.floor(diffDays / 30)} ay önce`;
      return `${Math.floor(diffDays / 365)} yıl önce`;
    } catch (error) {
      return '';
    }
  };

  if (layout === 'horizontal') {
    // Yatay düzen - video detay sayfası için
    return (
      <div
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`cursor-pointer hover:opacity-80 transition-opacity flex space-x-3 ${className}`}
      >
        {/* Thumbnail/Video Container */}
        <div className="relative flex-shrink-0" style={{ width: '160px', height: '90px' }}>
          <div className="w-full h-full bg-black rounded-lg overflow-hidden">
            {isHovered && video.videoUrl ? (
              <video
                ref={videoRef}
                src={video.videoUrl}
                className="w-full h-full object-cover"
                muted
                playsInline
                onLoadedData={handleVideoLoad}
                style={{ display: isVideoLoaded ? 'block' : 'none' }}
              />
            ) : (
              <img
                src={video.thumbnailUrl || thumbPlaceholder}
                alt={video.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            )}
          </div>
          
          {/* Duration badge */}
          {showDuration && video.duration && (
            <div className="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white text-xs px-1 py-0.5 rounded">
              {formatDuration(video.duration)}
            </div>
          )}
        </div>

        {/* Video info */}
        <div className="flex-1 min-w-0">
          <h4 className="text-base font-bold text-gray-900 dark:text-white mb-2 leading-tight line-clamp-2">
            {video.title}
          </h4>
          {showUploadTime && video.createdAt && (
            <p className="text-sm text-gray-500 dark:text-gray-400 opacity-50">
              {formatUploadTime(video.createdAt)}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Dikey düzen - anasayfa ve videos sayfası için
  return (
    <div
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative cursor-pointer ${className}`}
    >
      {/* 16:9 Aspect Ratio Container */}
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <div className="absolute inset-0 bg-black rounded-lg overflow-hidden">
          {isHovered && video.videoUrl ? (
            <video
              ref={videoRef}
              src={video.videoUrl}
              className="w-full h-full object-cover"
              muted
              playsInline
              onLoadedData={handleVideoLoad}
              style={{ display: isVideoLoaded ? 'block' : 'none' }}
            />
          ) : (
            <img
              src={video.thumbnailUrl || thumbPlaceholder}
              alt={video.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          )}
        </div>
        
        {/* Duration badge */}
        {showDuration && video.duration && (
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
            {formatDuration(video.duration)}
          </div>
        )}
      </div>

      {/* Video info */}
      <div className="mt-3">
        <h3 className="font-bold text-gray-900 dark:text-white text-base line-clamp-2 leading-tight">
          {video.title}
        </h3>
        {showUploadTime && video.createdAt && (
          <p className="text-gray-600 dark:text-gray-400 text-xs mt-1 opacity-50">
            {formatUploadTime(video.createdAt)}
          </p>
        )}
      </div>
    </div>
  );
};

export default VideoCard; 