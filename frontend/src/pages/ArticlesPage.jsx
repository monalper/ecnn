import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ArticleCard from '../components/article/ArticleCard';
import MetaTags from '../components/seo/MetaTags';
import SchemaMarkup from '../components/seo/SchemaMarkup';
import { FaSearch, FaTimes, FaFilter, FaSort, FaEye, FaClock, FaCalendar, FaFire, FaStar, FaBars, FaChevronDown } from 'react-icons/fa';
import api from '../services/api';
import Fuse from 'fuse.js';

const ArticlesPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [fuse, setFuse] = useState(null);
  const [sortBy, setSortBy] = useState('newest');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [articlesPerPage] = useState(12);
  const [viewMode, setViewMode] = useState('grid');
  const [isMobile, setIsMobile] = useState(false);

  // Available categories
  const availableCategories = [
    'sanat', 'felsefe', 'teknoloji', 'bilim', 'tarih', 'edebiyat', 'siyaset', 
    'ekonomi', 'spor', 'sağlık', 'eğitim', 'çevre', 'sosyoloji', 'psikoloji', 
    'din', 'müzik', 'sinema', 'seyahat', 'yemek'
  ];

  // Category display mapping
  const categoryDisplayNames = {
    'sanat': 'Sanat',
    'felsefe': 'Felsefe',
    'teknoloji': 'Teknoloji',
    'bilim': 'Bilim',
    'tarih': 'Tarih',
    'edebiyat': 'Edebiyat',
    'siyaset': 'Siyaset',
    'ekonomi': 'Ekonomi',
    'spor': 'Spor',
    'sağlık': 'Sağlık',
    'eğitim': 'Eğitim',
    'çevre': 'Çevre',
    'sosyoloji': 'Sosyoloji',
    'psikoloji': 'Psikoloji',
    'din': 'Din',
    'müzik': 'Müzik',
    'sinema': 'Sinema',
    'seyahat': 'Seyahat',
    'yemek': 'Yemek'
  };

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
    const fetchArticles = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get('/articles');
        setArticles(response.data);
        setFilteredArticles(response.data);
        const fuseInstance = new Fuse(response.data, {
          keys: ['title', 'description', 'tags', 'categories'],
          threshold: 0.4,
          minMatchCharLength: 2,
        });
        setFuse(fuseInstance);
      } catch (err) {
        console.error("Makaleler yüklenirken hata:", err.response?.data?.message || err.message);
        setError(err.response?.data?.message || 'Makaleler yüklenemedi.');
        setArticles([]);
        setFilteredArticles([]);
        setFuse(null);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  useEffect(() => {
    let results = articles;

    // Arama filtresi
    if (searchQuery.trim() && fuse) {
      const searchResults = fuse.search(searchQuery);
      results = searchResults.map(r => r.item);
    }

    // Kategori filtresi
    if (selectedCategories.length > 0) {
      results = results.filter(article => 
        article.categories && 
        article.categories.some(cat => selectedCategories.includes(cat))
      );
    }

    // Sıralama
    results = [...results].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'popular':
          return (b.viewCount || 0) - (a.viewCount || 0);
        case 'trending':
          // Son 7 gün içindeki görüntülenme sayısına göre sıralama
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          const aRecent = new Date(a.createdAt) > weekAgo ? (a.viewCount || 0) * 1.5 : (a.viewCount || 0);
          const bRecent = new Date(b.createdAt) > weekAgo ? (b.viewCount || 0) * 1.5 : (b.viewCount || 0);
          return bRecent - aRecent;
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    setFilteredArticles(results);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchQuery, articles, fuse, sortBy, selectedCategories]);

  const handleCategoryToggle = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSortBy('newest');
  };

  // Pagination
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-dark-primary dark:to-dark-primary flex items-center justify-center">
        <div className="text-center px-4">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-brand-orange border-t-transparent mx-auto"></div>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg font-semibold text-slate-600 dark:text-slate-300">Makaleler Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-black dark:to-black flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-4xl sm:text-6xl mb-4">⚠️</div>
          <h2 className="text-xl sm:text-2xl font-bold text-red-600 mb-4">Bir Hata Oluştu</h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 sm:px-6 py-2 sm:py-3 bg-brand-orange text-white rounded-xl hover:bg-brand-orange/90 transition-colors text-sm sm:text-base"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <MetaTags
        title="Tüm Makaleler"
        description="OpenWall'da yayınlanan tüm teknoloji,felsefe,sanat,spor,siyaset,ekonomi,sağlık,eğitim,çevre,sosyoloji,psikoloji,din,müzik,sinema,seyahat,yemek makalelerini keşfedin. En güncel teknoloji, felsefe,sanat,spor,siyaset,ekonomi,sağlık,eğitim,çevre,sosyoloji,psikoloji,din,müzik,sinema,seyahat,yemek haberleri ve analizler."
        keywords="teknoloji makaleleri, teknoloji haberleri, yazılım, donanım, yapay zeka, blockchain, siber güvenlik, felsefe,sanat,spor,siyaset,ekonomi,sağlık,eğitim,çevre,sosyoloji,psikoloji,din,müzik,sinema,seyahat,yemek"
      />
      <SchemaMarkup type="WebSite" />

      {/* Header */}
      <div className="text-center mb-8 sm:mb-12 px-3 sm:px-4 lg:px-8 pt-4 sm:pt-8">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-slate-800 dark:text-slate-100 mb-4 sm:mb-6 px-2">
          Tüm Makaleler
        </h1>
        <p className="text-base sm:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed px-4">
          OpenWall'da yayınlanmış tüm makaleler.
        </p>
      </div>

      {/* Arama ve Filtreler - İyileştirilmiş Tasarım */}
      <div className="px-4 lg:px-8 mb-12">
        {/* Ana Arama ve Kontroller - Merkezi Hizalama */}
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 lg:items-center justify-center mb-8">
            {/* Arama Alanı */}
            <div className="relative flex-1 max-w-2xl lg:max-w-xl">
              <input
                type="text"
                placeholder="Makalelerde ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-5 py-4 pl-12 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-2xl focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange/60 outline-none transition-all duration-200 text-base placeholder:text-slate-500 dark:placeholder:text-slate-300 shadow-sm"
              />
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-1"
                >
                  <FaTimes className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Kontrol Butonları */}
            <div className="flex items-center gap-3 lg:flex-shrink-0">
              {/* Sıralama */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-sm focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange/60 outline-none transition-all duration-200 text-slate-600 dark:text-slate-300 shadow-sm min-w-[140px]"
              >
                <option value="newest">En Yeni</option>
                <option value="oldest">En Eski</option>
                <option value="popular">En Popüler</option>
                <option value="trending">Trend</option>
              </select>

              {/* Filtre Butonu */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm shadow-sm ${
                  showFilters || selectedCategories.length > 0
                    ? 'bg-brand-orange text-white hover:bg-brand-orange/90'
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FaFilter className="w-4 h-4" />
                  <span>Filtrele</span>
                </div>
              </button>
            </div>
          </div>

          {/* Sonuç Bilgisi - Merkezi */}
          <div className="flex items-center justify-center text-sm text-slate-500 dark:text-slate-400 mb-6">
            <span className="font-medium">
              {searchQuery || selectedCategories.length > 0 
                ? `${filteredArticles.length} sonuç bulundu`
                : `Toplam ${filteredArticles.length} makale`
              }
            </span>
            {selectedCategories.length > 0 && (
              <span className="text-brand-orange font-semibold ml-4">
                {selectedCategories.slice(0, 2).map(cat => categoryDisplayNames[cat] || cat).join(', ')}
                {selectedCategories.length > 2 && ` +${selectedCategories.length - 2}`}
              </span>
            )}
          </div>

          {/* Kategori Filtreleri - Merkezi */}
          {showFilters && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-600 shadow-sm max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">Kategoriler</h3>
                {selectedCategories.length > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-brand-orange hover:text-brand-orange/80 transition-colors font-medium"
                  >
                    Tümünü Temizle
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-3 justify-center max-h-48 overflow-y-auto">
                {availableCategories.map(category => (
                  <button
                    key={category}
                    onClick={() => handleCategoryToggle(category)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      selectedCategories.includes(category)
                        ? 'bg-brand-orange text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    {categoryDisplayNames[category] || category}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Makaleler Grid/List - Mobile Optimized */}
      <div className="px-3 sm:px-4 lg:px-8">
        {filteredArticles.length === 0 ? (
          <div className="text-center py-12 sm:py-20 px-4">
            <div className="text-6xl sm:text-8xl mb-4 sm:mb-6">📚</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-3 sm:mb-4">
              {searchQuery || selectedCategories.length > 0 ? 'Arama sonucu bulunamadı' : 'Henüz Makale Yok'}
            </h2>
            <p className="text-sm sm:text-lg text-slate-600 dark:text-slate-400 mb-6 sm:mb-8 max-w-md mx-auto">
              {searchQuery || selectedCategories.length > 0 
                ? 'Farklı anahtar kelimelerle veya kategorilerle tekrar deneyin' 
                : 'Yakında burada harika içerikler olacak!'
              }
            </p>
            {(searchQuery || selectedCategories.length > 0) && (
              <button
                onClick={clearAllFilters}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-brand-orange text-white rounded-xl hover:bg-brand-orange/90 transition-colors text-sm sm:text-base"
              >
                Tüm Filtreleri Temizle
              </button>
            )}
          </div>
        ) : (
          <>
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8"
              : "space-y-4 sm:space-y-6"
            }>
              {currentArticles.map(article => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>

            {/* Pagination - Mobile Optimized */}
            {totalPages > 1 && (
              <div className="mt-8 sm:mt-12 flex justify-center">
                <div className="flex items-center gap-1 sm:gap-2">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
                  >
                    Önceki
                  </button>
                  
                  {/* Mobile: Show limited page numbers */}
                  {isMobile ? (
                    <>
                      {currentPage > 2 && (
                        <>
                          <button
                            onClick={() => paginate(1)}
                            className="px-3 py-2 rounded-lg text-xs font-medium transition-colors bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
                          >
                            1
                          </button>
                          {currentPage > 3 && <span className="px-2 text-slate-400">...</span>}
                        </>
                      )}
                      
                      {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                        const pageNum = Math.max(1, currentPage - 1) + i;
                        if (pageNum <= totalPages) {
                          return (
                            <button
                              key={pageNum}
                              onClick={() => paginate(pageNum)}
                              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                                currentPage === pageNum
                                  ? 'bg-brand-orange text-white'
                                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
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
                          {currentPage < totalPages - 2 && <span className="px-2 text-slate-400">...</span>}
                          <button
                            onClick={() => paginate(totalPages)}
                            className="px-3 py-2 rounded-lg text-xs font-medium transition-colors bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
                          >
                            {totalPages}
                          </button>
                        </>
                      )}
                    </>
                  ) : (
                    // Desktop: Show all page numbers
                    Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                      <button
                        key={number}
                        onClick={() => paginate(number)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === number
                            ? 'bg-brand-orange text-white'
                            : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                        }`}
                      >
                        {number}
                      </button>
                    ))
                  )}
                  
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
                  >
                    Sonraki
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Öne Çıkan Makaleler Linki - Mobile Optimized */}
      <div className="mt-12 sm:mt-20 text-center px-3 sm:px-4 lg:px-8 pb-4 sm:pb-8">
        <div className="bg-gradient-to-r from-brand-orange/10 via-yellow-500/10 to-red-500/10 rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-brand-orange/20">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3 sm:mb-4">
            Öne Çıkan Makaleleri Keşfedin
          </h3>
          <p className="text-sm sm:text-lg text-slate-600 dark:text-slate-400 mb-4 sm:mb-6 max-w-2xl mx-auto">
            En popüler ve önemli makalelerimizi anasayfada bulabilirsiniz. 
            Güncel teknoloji trendlerini ve derinlemesine analizleri kaçırmayın.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-brand-orange hover:bg-brand-orange/90 text-white font-semibold rounded-xl transition-colors shadow-lg hover:shadow-xl text-sm sm:text-base"
          >
            <FaFire className="w-4 h-4 sm:w-5 sm:h-5" />
            Anasayfaya Dön
          </Link>
        </div>
      </div>
    </>
  );
};

export default ArticlesPage; 