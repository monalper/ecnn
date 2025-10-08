import React, { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';

const GifSearchModal = ({ isOpen, onClose, onSelectGif }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [gifs, setGifs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // GIPHY API key - you should replace this with your own API key
  // Get your free API key from: https://developers.giphy.com/dashboard/
  const GIPHY_API_KEY = import.meta.env.VITE_GIPHY_API_KEY || 'P7u0oStJdaBWN6gKa0cwIbPyzamJBbTp'; // Fallback to your API key
  const GIPHY_BASE_URL = 'https://api.giphy.com/v1/gifs';

  // Sample GIFs as fallback when API is not available
  const sampleGifs = [
    {
      id: 'sample1',
      title: 'Happy GIF',
      images: {
        fixed_height: {
          webp: 'https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.webp',
          url: 'https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif'
        }
      }
    },
    {
      id: 'sample2',
      title: 'Thumbs Up GIF',
      images: {
        fixed_height: {
          webp: 'https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.webp',
          url: 'https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif'
        }
      }
    },
    {
      id: 'sample3',
      title: 'Celebration GIF',
      images: {
        fixed_height: {
          webp: 'https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.webp',
          url: 'https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif'
        }
      }
    },
    {
      id: 'sample4',
      title: 'Laughing GIF',
      images: {
        fixed_height: {
          webp: 'https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.webp',
          url: 'https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif'
        }
      }
    },
    {
      id: 'sample5',
      title: 'Love GIF',
      images: {
        fixed_height: {
          webp: 'https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.webp',
          url: 'https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif'
        }
      }
    },
    {
      id: 'sample6',
      title: 'Wow GIF',
      images: {
        fixed_height: {
          webp: 'https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.webp',
          url: 'https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif'
        }
      }
    }
  ];

  // Trending GIFs on component mount
  useEffect(() => {
    if (isOpen && gifs.length === 0) {
      // First show sample GIFs immediately
      setGifs(sampleGifs);
      // Then try to fetch real GIFs
      fetchTrendingGifs();
    }
  }, [isOpen]);

  const fetchTrendingGifs = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${GIPHY_BASE_URL}/trending?api_key=${GIPHY_API_KEY}&limit=20&rating=g`);
      const data = await response.json();
      
      if (data.data) {
        setGifs(data.data);
        setCurrentPage(0);
        setHasMore(data.pagination?.count < data.pagination?.total_count);
      } else {
        setError('GIF verisi alınamadı. Örnek GIF\'ler gösteriliyor.');
        setGifs(sampleGifs);
      }
    } catch (err) {
      console.error('GIF fetch error:', err);
      if (err.message.includes('403') || err.message.includes('Forbidden')) {
        setError('GIPHY API anahtarı geçersiz. Örnek GIF\'ler gösteriliyor.');
        setGifs(sampleGifs);
      } else {
        setError('GIF\'ler yüklenirken bir hata oluştu. Örnek GIF\'ler gösteriliyor.');
        setGifs(sampleGifs);
      }
    } finally {
      setLoading(false);
    }
  };

  const searchGifs = async (query, offset = 0) => {
    if (!query.trim()) {
      fetchTrendingGifs();
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch(
        `${GIPHY_BASE_URL}/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(query)}&limit=20&offset=${offset}&rating=g&lang=tr`
      );
      const data = await response.json();
      
      if (data.data) {
        if (offset === 0) {
          setGifs(data.data);
          setCurrentPage(0);
        } else {
          setGifs(prev => [...prev, ...data.data]);
        }
        setHasMore(data.pagination?.count < data.pagination?.total_count);
      }
    } catch (err) {
      if (err.message.includes('403') || err.message.includes('Forbidden')) {
        setError('GIPHY API anahtarı geçersiz. Örnek GIF\'ler gösteriliyor.');
        setGifs(sampleGifs);
      } else {
        setError('GIF arama sırasında bir hata oluştu. Örnek GIF\'ler gösteriliyor.');
        setGifs(sampleGifs);
      }
      console.error('GIF search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      searchGifs(searchTerm.trim());
    } else {
      fetchTrendingGifs();
    }
  };

  const loadMoreGifs = () => {
    const nextOffset = (currentPage + 1) * 20;
    if (searchTerm.trim()) {
      searchGifs(searchTerm.trim(), nextOffset);
    } else {
      fetchTrendingGifs();
    }
    setCurrentPage(prev => prev + 1);
  };

  const handleGifSelect = (gif) => {
    onSelectGif(gif);
    onClose();
  };

  const handleClose = () => {
    setSearchTerm('');
    setGifs([]);
    setCurrentPage(0);
    setError('');
    setLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[80vh] flex flex-col shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            GIF Seç
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4">
          <form onSubmit={handleSearch} className="flex space-x-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="GIF ara..."
                className="w-full px-4 py-2 pr-10 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                style={{ backgroundColor: '#0F0F0F' }}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </form>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {error && (
            <div className="text-center py-4">
              <div className="text-yellow-600 dark:text-yellow-400 mb-2 text-sm">{error}</div>
              {error.includes('API anahtarı') && (
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  <p>GIPHY API anahtarı almak için:</p>
                  <p>1. <a href="https://developers.giphy.com/dashboard/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600">GIPHY Developer Dashboard</a>'a gidin</p>
                  <p>2. Ücretsiz hesap oluşturun ve API anahtarınızı alın</p>
                  <p>3. <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-xs">VITE_GIPHY_API_KEY</code> olarak .env dosyasına ekleyin</p>
                </div>
              )}
              <button
                onClick={() => searchTerm ? searchGifs(searchTerm) : fetchTrendingGifs()}
                className="text-blue-500 hover:text-blue-600 text-sm"
              >
                Tekrar dene
              </button>
            </div>
          )}

          {loading && gifs.length === 0 && (
            <div className="text-center py-8">
              <LoadingSpinner size="medium" text="GIF'ler yükleniyor..." showText={true} />
            </div>
          )}

          {!loading && gifs.length === 0 && !error && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <svg className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <p>GIF bulunamadı</p>
            </div>
          )}

          {gifs.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {gifs.map((gif) => (
                <button
                  key={gif.id}
                  onClick={() => handleGifSelect(gif)}
                  className="relative group rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <img
                    src={gif.images?.fixed_height?.webp || gif.images?.fixed_height?.url}
                    alt={gif.title || 'GIF'}
                    className="w-full h-24 sm:h-32 object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity flex items-center justify-center">
                    <svg className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          )}

          {hasMore && gifs.length > 0 && (
            <div className="text-center mt-4">
              <button
                onClick={loadMoreGifs}
                disabled={loading}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none disabled:opacity-50"
              >
                {loading ? 'Yükleniyor...' : 'Daha fazla yükle'}
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4">
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            GIF'ler GIPHY tarafından sağlanmaktadır
          </div>
        </div>
      </div>
    </div>
  );
};

export default GifSearchModal;
