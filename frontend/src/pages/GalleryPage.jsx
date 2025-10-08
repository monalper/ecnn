import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../services/api';

const GalleryPage = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already authenticated from localStorage
    const savedAuth = localStorage.getItem('galleryAuthenticated');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchGalleryItems();
    }
  }, [isAuthenticated]);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === 'goofygoober') {
      setIsAuthenticated(true);
      setPasswordError('');
      // Save authentication state to localStorage
      localStorage.setItem('galleryAuthenticated', 'true');
    } else {
      setPasswordError('Yanlış şifre! Lütfen tekrar deneyin.');
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setGalleryItems([]);
    setLoading(true);
    // Remove authentication from localStorage
    localStorage.removeItem('galleryAuthenticated');
  };

  const fetchGalleryItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/gallery');
      
      // Ensure we always have an array
      const items = Array.isArray(response.data) ? response.data : [];
      setGalleryItems(items);
    } catch (err) {
      console.error('Galeri yüklenirken hata:', err);
      setError('Galeri yüklenirken bir hata oluştu.');
      setGalleryItems([]); // Ensure it's an empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = (item) => {
    navigate(`/gallery/${item.id}`);
  };

  // Password prompt component
  if (!isAuthenticated) {
    return (
      <>
        <Helmet>
          <title>Galeri</title>
          <meta name="description" content="Openwall galeri sayfası - Projelerimizden görseller" />
          <meta property="og:title" content="Galeri - Openwall" />
          <meta property="og:description" content="Openwall galeri sayfası - Projelerimizden görseller" />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://openwall.com.tr/gallery" />
        </Helmet>

        {/* Background gallery content with blur */}
        <div className="px-4 py-8 blur-sm pointer-events-none">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Görseller
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Placeholder gallery items for background */}
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="relative">
                <div className="relative w-full" style={{ paddingBottom: '75%' }}>
                  <div className="absolute inset-0 w-full h-full bg-gray-200 dark:bg-gray-700 rounded-lg shadow-lg"></div>
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
                  Galeri Erişimi
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Galeriye erişmek için şifre gerekli
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
          <LoadingSpinner size="medium" text="Galeri yükleniyor..." />
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
            onClick={fetchGalleryItems}
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
        <title>Galeri</title>
        <meta name="description" content="OpenWall galeri sayfası - Projelerimizden görseller" />
        <meta property="og:title" content="Galeri - OpenWall" />
        <meta property="og:description" content="OpenWall galeri sayfası - Projelerimizden görseller" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://openwall.com.tr/gallery" />
      </Helmet>

      <div className="px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Görseller
          </h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
          >
            Çıkış Yap
          </button>
        </div>

        {!Array.isArray(galleryItems) || galleryItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📷</div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Henüz görsel eklenmemiş
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Yakında burada güzel görseller göreceksiniz.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {galleryItems.map((item) => (
              <div
                key={item.id}
                className="relative cursor-pointer transform transition-all duration-300"
                onClick={() => handleImageClick(item)}
              >
                {/* 4:3 Aspect Ratio Container */}
                <div className="relative w-full" style={{ paddingBottom: '75%' }}>
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover shadow-lg"
                    loading="lazy"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default GalleryPage; 