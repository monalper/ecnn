import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTimes, FaNewspaper, FaVideo, FaBook } from 'react-icons/fa';
import { AiOutlineSearch } from 'react-icons/ai';
import LoadingSpinner from './LoadingSpinner';
import axios from 'axios';

const SearchModal = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({
    articles: [],
    videos: [],
    dictionary: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  // ESC tuşu ile kapatma ve scroll ile kapatma
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleScroll = () => {
      onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      window.addEventListener('scroll', handleScroll);
      
      // Sadece main content'e blur ekle, header'ı hariç tut
      const mainContent = document.querySelector('main') || document.querySelector('#root > div:not(header)') || document.body;
      if (mainContent) {
        mainContent.style.filter = 'blur(8px)';
        mainContent.style.webkitFilter = 'blur(8px)';
        mainContent.style.transition = 'filter 0.3s ease';
        mainContent.style.pointerEvents = 'none'; // Blurlu alanda tıklanamaz
      }
      
      // Header'ı blur'dan koru
      const header = document.querySelector('header');
      if (header) {
        header.style.filter = 'none';
        header.style.webkitFilter = 'none';
        header.style.zIndex = '9999999';
        header.style.pointerEvents = 'auto'; // Header'da tıklanabilir
      }
      
      // Input'a otomatik focus
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    } else {
      // Blur'u kaldır
      const mainContent = document.querySelector('main') || document.querySelector('#root > div:not(header)') || document.body;
      if (mainContent) {
        mainContent.style.filter = 'none';
        mainContent.style.webkitFilter = 'none';
        mainContent.style.pointerEvents = 'auto'; // Normal tıklanabilirlik
      }
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      window.removeEventListener('scroll', handleScroll);
      // Cleanup
      const mainContent = document.querySelector('main') || document.querySelector('#root > div:not(header)') || document.body;
      if (mainContent) {
        mainContent.style.filter = 'none';
        mainContent.style.webkitFilter = 'none';
        mainContent.style.pointerEvents = 'auto'; // Normal tıklanabilirlik
      }
    };
  }, [isOpen, onClose]);

  // Arama işlemi
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults({ articles: [], videos: [], dictionary: [] });
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsLoading(true);
      try {
        const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
        console.log('Searching for:', searchQuery);
        console.log('API URL:', apiUrl);
        
        // Paralel olarak tüm aramaları yap
        const [articlesRes, videosRes, dictionaryRes] = await Promise.all([
          axios.get(`${apiUrl}/articles/search?q=${encodeURIComponent(searchQuery)}`).catch((err) => {
            console.error('Articles search error:', err);
            return { data: [] };
          }),
          axios.get(`${apiUrl}/videos/search?q=${encodeURIComponent(searchQuery)}`).catch((err) => {
            console.error('Videos search error:', err);
            return { data: [] };
          }),
          axios.get(`${apiUrl}/dictionary/search?q=${encodeURIComponent(searchQuery)}`).catch((err) => {
            console.error('Dictionary search error:', err);
            return { data: [] };
          })
        ]);

        console.log('Search results:', {
          articles: articlesRes.data,
          videos: videosRes.data,
          dictionary: dictionaryRes.data
        });
        
        // Video verilerini detaylı kontrol et
        if (videosRes.data && videosRes.data.length > 0) {
          console.log('Video data sample:', videosRes.data[0]);
        }

        setSearchResults({
          articles: articlesRes.data.slice(0, 5),
          videos: videosRes.data.slice(0, 5),
          dictionary: dictionaryRes.data.slice(0, 5)
        });
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleResultClick = (type, item) => {
    onClose();
    setSearchQuery('');
    
    switch(type) {
      case 'article':
        navigate(`/articles/${item.slug || item.id}`);
        break;
      case 'video':
        navigate(`/videos/${item.id}`);
        break;
      case 'dictionary':
        navigate(`/dictionary/${item.word}`);
        break;
      default:
        break;
    }
  };

  if (!isOpen) return null;

  const totalResults = searchResults.articles.length + searchResults.videos.length + searchResults.dictionary.length;

  return (
    <>
      {/* Backdrop Blur Layer - Çok yüksek z-index ile */}
      <div 
        className="fixed left-0 right-0 bottom-0"
        onClick={onClose}
        style={{
          top: window.innerWidth >= 768 ? '44px' : '48px',
          zIndex: 999999,
          animation: 'fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          background: 'rgba(0, 0, 0, 0.95) !important',
          backdropFilter: 'blur(25px) !important',
          WebkitBackdropFilter: 'blur(25px) !important',
          opacity: '1 !important',
          visibility: 'visible !important',
          display: 'block !important',
          position: 'fixed !important',
          pointerEvents: 'auto !important'
        }}
      />
      
      {/* Search Content Layer */}
      <div 
        className="fixed left-0 right-0"
        style={{
          top: window.innerWidth >= 768 ? '44px' : '48px',
          zIndex: 1000000
        }}
      >
        <div 
          className="w-full max-w-3xl mx-auto mt-6 px-4"
          onClick={(e) => e.stopPropagation()}
        >
        {/* Search Input Container */}
        <div 
          className="bg-white dark:bg-[#1d1d1f] rounded-2xl shadow-2xl overflow-hidden"
          style={{
            animation: 'slideDown 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
            transform: 'translateY(0)',
            opacity: 1
          }}
        >
          {/* Search Input */}
          <div className="relative flex items-center px-6 py-4">
            <AiOutlineSearch className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Openwall'da ara"
              className="flex-1 ml-4 text-lg bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:text-[#D1D5DB] font-bold"
              autoComplete="off"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="ml-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                <FaTimes className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>

          {/* Search Results */}
          {searchQuery.trim().length >= 2 && (
            <div className="max-h-[60vh] overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <LoadingSpinner size="medium" text="Aranıyor..." />
                </div>
              ) : totalResults === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <p className="text-lg">Sonuç bulunamadı</p>
                  <p className="text-sm mt-2">Farklı anahtar kelimeler deneyin</p>
                </div>
              ) : (
                <div className="py-2">
                  {/* Articles */}
                  {searchResults.articles.length > 0 && (
                    <div className="mb-4">
                      <div className="px-6 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Makaleler
                      </div>
                      {searchResults.articles.map((article) => (
                        <button
                          key={article.id}
                          onClick={() => handleResultClick('article', article)}
                          className="w-full px-6 py-3 text-left transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">
                                {article.title}
                              </h3>
                              {article.excerpt && (
                                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                                  {article.excerpt}
                                </p>
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Videos */}
                  {searchResults.videos.length > 0 && (
                    <div className="mb-4">
                      <div className="px-6 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Videolar
                      </div>
                      {searchResults.videos.map((video) => (
                        <button
                          key={video.id}
                          onClick={() => handleResultClick('video', video)}
                          className="w-full px-6 py-3 text-left transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">
                                {video.title}
                              </h3>
                              {video.description && (
                                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                                  {video.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Dictionary */}
                  {searchResults.dictionary.length > 0 && (
                    <div className="mb-4">
                      <div className="px-6 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Sözlük
                      </div>
                      {searchResults.dictionary.map((entry) => (
                        <button
                          key={entry.id || entry.word}
                          onClick={() => handleResultClick('dictionary', entry)}
                          className="w-full px-6 py-3 text-left transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                                {entry.word}
                              </h3>
                              {entry.definition && (
                                <div className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                                  {entry.definition}
                                </div>
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Quick Links - When no search */}
          {searchQuery.trim().length < 2 && (
            <div className="py-4">
              <div className="px-6 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Hızlı Linkler
              </div>
              <div className="space-y-1 px-6 py-2">
                {[
                  { name: 'Makaleler', path: '/articles' },
                  { name: 'Videolar', path: '/videos' },
                  { name: 'Galeri', path: '/gallery' },
                  { name: 'NASA APOD', path: '/apod' },
                  { name: 'Ay Evreleri', path: '/moon' },
                  { name: 'Asteroid İzleme', path: '/asteroid' },
                  { name: 'Sözlük', path: '/dictionary' }
                ].map((link) => (
                  <button
                    key={link.name}
                    onClick={() => {
                      onClose();
                      navigate(link.path);
                    }}
                    className="block w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 rounded-lg transition-colors"
                  >
                    {link.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Help Text */}
        <div className="text-center mt-4 text-sm text-gray-400 dark:text-gray-500">
          <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">ESC</kbd> ile kapatabilirsiniz
        </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            backdrop-filter: blur(0px);
          }
          to {
            opacity: 1;
            backdrop-filter: blur(25px);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </>
  );
};

export default SearchModal;
