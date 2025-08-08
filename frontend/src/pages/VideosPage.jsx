import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import thumbPlaceholder from '../assets/ThumbPlaceholder.png';

const VideosPage = () => {
  const [videoItems, setVideoItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already authenticated from localStorage
    const savedAuth = localStorage.getItem('videosAuthenticated');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchVideoItems();
    }
  }, [isAuthenticated]);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === 'goofygoober') {
      setIsAuthenticated(true);
      setPasswordError('');
      // Save authentication state to localStorage
      localStorage.setItem('videosAuthenticated', 'true');
    } else {
      setPasswordError('Yanlış şifre! Lütfen tekrar deneyin.');
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setVideoItems([]);
    setLoading(true);
    // Remove authentication from localStorage
    localStorage.removeItem('videosAuthenticated');
  };

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

  // Password prompt component
  if (!isAuthenticated) {
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

        {/* Background video content with blur */}
        <div className="container mx-auto px-4 py-8 blur-sm pointer-events-none">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Videolar
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Placeholder video items for background */}
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="relative">
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                  <div className="absolute inset-0 w-full h-full bg-gray-200 dark:bg-gray-700 rounded-lg shadow-lg flex items-center justify-center">
                    <div className="text-4xl text-gray-400">🎥</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Password overlay */}
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
          <div className="max-w-md w-full mx-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-200 dark:border-gray-600">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">🔒</div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Video Erişimi
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Videolara erişmek için şifre gerekli
                </p>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Şifre
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Şifrenizi girin"
                    required
                  />
                </div>

                {passwordError && (
                  <div className="text-red-600 dark:text-red-400 text-sm text-center">
                    {passwordError}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full px-4 py-3 bg-brand-orange text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
                >
                  Giriş Yap
                </button>
              </form>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Videolar yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button 
            onClick={fetchVideoItems}
            className="px-4 py-2 bg-brand-orange text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Tekrar Dene
          </button>
        </div>
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

      <div className="container mx-auto px-4 py-8">
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
            {videoItems.map((item) => (
              <div
                key={item.id}
                className="relative cursor-pointer"
                onClick={() => handleVideoClick(item)}
              >
                {/* 16:9 Aspect Ratio Container */}
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                  <div className="absolute inset-0 bg-black rounded-lg overflow-hidden">
                    <img
                      src={item.thumbnailUrl || thumbPlaceholder}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  
                  {/* Duration badge */}
                  {item.duration && (
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                      {formatDuration(item.duration)}
                    </div>
                  )}
                </div>

                {/* Video info */}
                <div className="mt-3">
                  <h3 className="font-bold text-gray-900 dark:text-white text-base line-clamp-2">
                    {item.title}
                  </h3>
                  {item.createdAt && (
                    <p className="text-gray-600 dark:text-gray-400 text-xs mt-1 opacity-50">
                      {formatUploadTime(item.createdAt)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default VideosPage; 