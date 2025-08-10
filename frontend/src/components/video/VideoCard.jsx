import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const VideoCard = ({ video }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef(null);
  const hoverTimeoutRef = useRef(null);

  const handleVideoClick = () => {
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
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds} saniye önce`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} dakika önce`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} saat önce`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} gün önce`;
    }
  };

  return (
    <div
      className="relative cursor-pointer"
      onClick={handleVideoClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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
              src={video.thumbnailUrl || `https://placehold.co/400x400/E2E8F0/A0AEC0?text=${encodeURIComponent(video.title.substring(0,15))}`}
              alt={video.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          )}
        </div>
        
        {/* Duration badge */}
        {video.duration && (
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
            {formatDuration(video.duration)}
          </div>
        )}
      </div>

      {/* Video info */}
      <div className="mt-3">
        <h3 className="font-bold text-gray-900 dark:text-white text-base line-clamp-2">
          {video.title}
        </h3>
        
        {/* User info */}
        {video.createdByUsername && (
          <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">
            {video.createdByUsername} tarafından
          </p>
        )}
        
        {/* Upload time */}
        {video.createdAt && (
          <p className="text-gray-600 dark:text-gray-400 text-xs mt-1 opacity-50">
            {formatUploadTime(video.createdAt)}
          </p>
        )}
      </div>
    </div>
  );
};

export default VideoCard; 