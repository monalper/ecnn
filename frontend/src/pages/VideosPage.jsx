import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import VideoCard from '../components/VideoCard';
import AdvertisementCard from '../components/AdvertisementCard';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../services/api';
import thumbPlaceholder from '../assets/ThumbPlaceholder.png';

const VideosPage = () => {
  const [videoItems, setVideoItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchVideoItems();
  }, []);

  const fetchVideoItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/videos');
      
      // Ensure we always have an array
      const items = Array.isArray(response.data) ? response.data : [];
      setVideoItems(items);
    } catch (err) {
      console.error('Videolar yüklenirken hata:', err);
      setError('Videolar yüklenirken bir hata oluştu.');
      setVideoItems([]); // Ensure it's an empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleVideoClick = (item) => {
    navigate(`/videos/${item.id}`);
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatUploadTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffSeconds = Math.floor(diffTime / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays < 0) return '';
    if (diffDays === 0) {
      if (diffHours === 0) {
        if (diffMinutes === 0) {
          return `${diffSeconds} saniye önce`;
        }
        return `${diffMinutes} dakika önce`;
      }
      return `${diffHours} saat önce`;
    }
    if (diffDays === 1) return '1 gün önce';
    if (diffDays < 7) return `${diffDays} gün önce`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} hafta önce`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} ay önce`;
    return `${Math.floor(diffDays / 365)} yıl önce`;
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <LoadingSpinner size="medium" text="Videolar Yükleniyor..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 px-4">
        <h2 className="text-2xl font-semibold text-red-600 mb-4">Bir Hata Oluştu</h2>
        <p className="text-text-muted">{error}</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Videolar - OpenWall</title>
        <meta name="description" content="OpenWall video sayfası - Projelerimizden videolar" />
        <meta property="og:title" content="Videolar - OpenWall" />
        <meta property="og:description" content="OpenWall video sayfası - Projelerimizden videolar" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://openwall.com.tr/videos" />
      </Helmet>

      <div className="px-4 py-8">
        {!Array.isArray(videoItems) || videoItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎥</div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Henüz video eklenmemiş
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Yakında burada güzel videolar göreceksiniz.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videoItems.map((item, index) => (
              <React.Fragment key={item.id}>
                <VideoCard
                  video={item}
                  layout="horizontal"
                  mobileLayout={true}
                  showDuration={true}
                  showUploadTime={true}
                />
                {/* Show advertisement card every 7 videos, starting after the 7th video */}
                {(index + 1) % 7 === 0 && (
                  <AdvertisementCard video={item} />
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default VideosPage; 
