import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import VideoCard from '../components/VideoCard';
import AdvertisementCard from '../components/AdvertisementCard';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../services/api';
import thumbPlaceholder from '../assets/ThumbPlaceholder.png';

const VideosPage = () => {
  const [videoItems, setVideoItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [videosPerPage] = useState(12);
  const [isMobile, setIsMobile] = useState(false);

  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // UI states for popups
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const navigate = useNavigate();

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  // Get unique categories from videos
  const categories = React.useMemo(() => {
    const categorySet = new Set();
    videoItems.forEach(video => {
      if (video.categories && Array.isArray(video.categories)) {
        video.categories.forEach(cat => categorySet.add(cat));
      }
    });
    return ['all', ...Array.from(categorySet).sort()];
  }, [videoItems]);

  // Filter and search videos
  const filteredVideos = React.useMemo(() => {
    let filtered = [...videoItems];
    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(video => {
        const titleMatch = video.title?.toLowerCase().includes(query);
        const descriptionMatch = video.description?.toLowerCase().includes(query);
        return titleMatch || descriptionMatch;
      });
    }
    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(video =>
        video.categories && video.categories.includes(selectedCategory)
      );
    }
    // Sort
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'popular':
        filtered.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
        break;
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title, 'tr'));
        break;
      default:
        break;
    }
    return filtered;
  }, [videoItems, searchQuery, selectedCategory, sortBy]);

  // Pagination
  const indexOfLastVideo = currentPage * videosPerPage;
  const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
  const currentVideos = filteredVideos.slice(indexOfFirstVideo, indexOfLastVideo);
  const totalPages = Math.ceil(filteredVideos.length / videosPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, sortBy]);

  // Close popups when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.filter-popup-container')) {
        if (isSearchOpen && !searchQuery) {
          setIsSearchOpen(false);
        }
        setIsCategoryOpen(false);
        setIsSortOpen(false);
      }
    };
    if (isSearchOpen || isCategoryOpen || isSortOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isSearchOpen, isCategoryOpen, isSortOpen, searchQuery]);

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSortBy('newest');
  };

  // Check if any filter is active
  const hasActiveFilters = searchQuery.trim() !== '' || selectedCategory !== 'all' || sortBy !== 'newest';

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
        <title>Videolar</title>
        <meta name="description" content="Openwall video sayfası - Projelerimizden videolar" />
        <meta property="og:title" content="Videolar - Openwall" />
        <meta property="og:description" content="Openwall video sayfası - Projelerimizden videolar" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://openwall.com.tr/videos" />
      </Helmet>

      <div className="min-h-screen bg-site-background dark:bg-dark-primary">
        <div className="px-0 sm:px-12 lg:px-20 xl:px-32 py-8 sm:py-12">
          <div className="space-y-8">
            {/* Search and Filter Section */}
            <section className="px-3 sm:px-0">
              <div className="mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-700 dark:text-slate-200 tracking-tight mb-8">
                  Tüm Videolar
                </h2>
                {/* Mobile-friendly filter layout */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                  {/* Icon-based Filters */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Search Icon */}
                    <div className="relative filter-popup-container flex items-center flex-shrink-0">
                      <button
                        onClick={() => {
                          setIsSearchOpen(!isSearchOpen);
                          setIsCategoryOpen(false);
                          setIsSortOpen(false);
                        }}
                        className="group relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex-shrink-0"
                        title="Ara"
                      >
                        <svg className="w-5 h-5 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        {searchQuery && (
                          <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                      </button>
                      {/* Search Input - Expands responsively */}
                      <div className={`relative overflow-hidden transition-all duration-300 ease-in-out ${
                        isSearchOpen ? 'w-[calc(100vw-8rem)] sm:w-64 opacity-100 ml-2' : 'w-0 opacity-0'
                      }`}>
                        <input
                          type="text"
                          placeholder="Ara..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full px-4 py-2 pr-8 bg-slate-50 dark:bg-slate-800 rounded-full text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-colors"
                          autoFocus={isSearchOpen}
                        />
                        {searchQuery && isSearchOpen && (
                          <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                    {/* Category Icon */}
                    <div className="relative filter-popup-container flex-shrink-0">
                      <button
                        onClick={() => {
                          setIsCategoryOpen(!isCategoryOpen);
                          setIsSearchOpen(false);
                          setIsSortOpen(false);
                        }}
                        className="group relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Kategori"
                      >
                        <svg className="w-5 h-5 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        {selectedCategory !== 'all' && (
                          <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                      </button>
                      {/* Category Popup - Mobile optimized positioning */}
                      {isCategoryOpen && (
                        <div className="absolute top-12 left-0 sm:right-0 sm:left-auto w-56 max-w-[calc(100vw-2rem)] bg-white dark:bg-slate-900 rounded-2xl shadow-xl py-2 z-50 max-h-80 overflow-y-auto">
                          {categories.map(category => (
                            <button
                              key={category}
                              onClick={() => {
                                setSelectedCategory(category);
                                setIsCategoryOpen(false);
                              }}
                              className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                                selectedCategory === category
                                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-medium'
                                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                              }`}
                            >
                              {category === 'all' ? 'Tüm Kategoriler' : category}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    {/* Sort Icon */}
                    <div className="relative filter-popup-container flex-shrink-0">
                      <button
                        onClick={() => {
                          setIsSortOpen(!isSortOpen);
                          setIsSearchOpen(false);
                          setIsCategoryOpen(false);
                        }}
                        className="group relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Sırala"
                      >
                        <svg className="w-5 h-5 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                        </svg>
                        {sortBy !== 'newest' && (
                          <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                      </button>
                      {/* Sort Popup - Mobile optimized positioning */}
                      {isSortOpen && (
                        <div className="absolute top-12 left-0 sm:right-0 sm:left-auto w-48 max-w-[calc(100vw-2rem)] bg-white dark:bg-slate-900 rounded-2xl shadow-xl py-2 z-50">
                          {[
                            { value: 'newest', label: 'En Yeni' },
                            { value: 'oldest', label: 'En Eski' },
                            { value: 'popular', label: 'En Popüler' },
                            { value: 'title', label: 'Alfabetik' }
                          ].map(option => (
                            <button
                              key={option.value}
                              onClick={() => {
                                setSortBy(option.value);
                                setIsSortOpen(false);
                              }}
                              className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                                sortBy === option.value
                                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-medium'
                                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                              }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    {/* Clear Filters */}
                    {hasActiveFilters && (
                      <button
                        onClick={clearFilters}
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group flex-shrink-0"
                        title="Temizle"
                      >
                        <svg className="w-5 h-5 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                  {/* Results Count */}
                  <div className="text-sm text-slate-400 dark:text-slate-500 flex-shrink-0">
                    {filteredVideos.length === videoItems.length ? (
                      <span>{videoItems.length} video</span>
                    ) : (
                      <span>{filteredVideos.length} / {videoItems.length} video</span>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Videos Grid */}
            <section className="px-3 sm:px-0">
              {currentVideos.length === 0 ? (
                <div className="text-center py-32">
                  <p className="text-lg text-slate-400 dark:text-slate-500 font-light">
                    Sonuç bulunamadı
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {currentVideos.map((item, index) => (
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

              {/* Minimal Pagination */}
              {totalPages > 1 && (
                <div className="mt-20 flex justify-center">
                  <nav className="flex items-center gap-2">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 text-sm text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-slate-400"
                    >
                      <FaArrowLeft />
                    </button>
                    <div className="flex items-center gap-1">
                      {isMobile ? (
                        // Mobile pagination
                        <>
                          {currentPage > 2 && (
                            <>
                              <button
                                onClick={() => paginate(1)}
                                className="min-w-[2.5rem] h-10 text-sm text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                              >
                                1
                              </button>
                              {currentPage > 3 && <span className="px-2 text-slate-300 dark:text-slate-600">···</span>}
                            </>
                          )}
                          {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                            const pageNum = Math.max(1, currentPage - 1) + i;
                            if (pageNum <= totalPages) {
                              return (
                                <button
                                  key={pageNum}
                                  onClick={() => paginate(pageNum)}
                                  className={`min-w-[2.5rem] h-10 text-sm transition-colors rounded-lg ${
                                    currentPage === pageNum
                                      ? 'text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 font-medium'
                                      : 'text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white'
                                  }`}
                                >
                                  {pageNum}
                                </button>
                              );
                            }
                            return null;
                          })}
                          {currentPage < totalPages - 1 && (
                            <>
                              {currentPage < totalPages - 2 && <span className="px-2 text-slate-300 dark:text-slate-600">···</span>}
                              <button
                                onClick={() => paginate(totalPages)}
                                className="min-w-[2.5rem] h-10 text-sm text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                              >
                                {totalPages}
                              </button>
                            </>
                          )}
                        </>
                      ) : (
                        // Desktop pagination
                        Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                          <button
                            key={number}
                            onClick={() => paginate(number)}
                            className={`min-w-[2.5rem] h-10 text-sm transition-colors rounded-lg ${
                              currentPage === number
                                ? 'text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 font-medium'
                                : 'text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white'
                            }`}
                          >
                            {number}
                          </button>
                        ))
                      )}
                    </div>
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 text-sm text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-slate-400"
                    >
                      <FaArrowRight />
                    </button>
                  </nav>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default VideosPage; 
