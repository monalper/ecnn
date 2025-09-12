import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ArticleCard from '../components/article/ArticleCard';
import LazyImage from '../components/LazyImage';
import MetaTags from '../components/seo/MetaTags';
import SchemaMarkup from '../components/seo/SchemaMarkup';
import LoadingSpinner from '../components/LoadingSpinner';
import { FaTimes } from 'react-icons/fa';
import api from '../services/api';

const ArticlesPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [featuredContent, setFeaturedContent] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [sortBy, setSortBy] = useState('newest');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [articlesPerPage] = useState(12);
  const [viewMode, setViewMode] = useState('grid');
  const [isMobile, setIsMobile] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

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

  // Calculate time since publication
  const getTimeAgo = (dateString) => {
    if (!dateString) return '';
    
    const now = new Date();
    const publishedDate = new Date(dateString);
    const diffInMs = now - publishedDate;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInWeeks = Math.floor(diffInDays / 7);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInDays / 365);

    if (diffInYears > 0) {
      return `${diffInYears} yıl önce`;
    } else if (diffInMonths > 0) {
      return `${diffInMonths} ay önce`;
    } else if (diffInWeeks > 0) {
      return `${diffInWeeks} hafta önce`;
    } else if (diffInDays > 0) {
      return `${diffInDays} gün önce`;
    } else {
      return 'Bugün';
    }
  };

  // Calculate reading time
  const getReadingTime = (content) => {
    if (!content) return '1 dk';
    
    const wordsPerMinute = 200; // Ortalama okuma hızı
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    
    return readingTime < 1 ? '1 dk' : `${readingTime} dk`;
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

  // Check if search bar is sticky
  useEffect(() => {
    const handleScroll = () => {
      const searchBar = document.querySelector('.sticky-search-bar');
      if (searchBar) {
        const rect = searchBar.getBoundingClientRect();
        setIsSticky(rect.top <= 64); // 64px is header height
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get('/articles');
        setArticles(response.data);
        setFilteredArticles(response.data);
      } catch (err) {
        console.error("Makaleler yüklenirken hata:", err.response?.data?.message || err.message);
        setError(err.response?.data?.message || 'Makaleler yüklenemedi.');
        setArticles([]);
        setFilteredArticles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  // Öne çıkan makalelerin content'ini çek
  useEffect(() => {
    const fetchFeaturedContent = async () => {
      if (articles.length > 0) {
        const featuredArticles = articles
          .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
          .slice(0, 3);

        for (const article of featuredArticles) {
          try {
            const response = await api.get(`/articles/${article.slug}`);
            setFeaturedContent(prev => ({
              ...prev,
              [article.slug]: response.data.content
            }));
          } catch (err) {
            console.error(`Makale content yüklenirken hata (${article.slug}):`, err);
          }
        }
      }
    };

    fetchFeaturedContent();
  }, [articles]);

  // Türkçe karakterleri normalize eden fonksiyon
  const normalizeText = (text) => {
    if (!text) return '';
    return text
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^\w\s]/g, '') // Özel karakterleri kaldır
      .trim();
  };

  // Arama fonksiyonu
  const searchArticles = (query, articlesList) => {
    if (!query.trim()) return articlesList;

    const normalizedQuery = normalizeText(query);
    const queryWords = normalizedQuery.split(/\s+/).filter(word => word.length > 0);

    return articlesList.filter(article => {
      // Makale verilerini normalize et
      const title = normalizeText(article.title || '');
      const description = normalizeText(article.description || '');
      const content = normalizeText(article.content || '');
      const tags = (article.tags || []).map(tag => normalizeText(tag));
      const categories = (article.categories || []).map(cat => normalizeText(cat));

      // Her kelime için kontrol et
      return queryWords.every(word => {
        return (
          title.includes(word) ||
          description.includes(word) ||
          content.includes(word) ||
          tags.some(tag => tag.includes(word)) ||
          categories.some(cat => cat.includes(word))
        );
      });
    });
  };

  // Arama sonuçlarını skorlama ve sıralama
  const scoreAndSortResults = (query, results) => {
    if (!query.trim()) return results;

    const normalizedQuery = normalizeText(query);
    const queryWords = normalizedQuery.split(/\s+/).filter(word => word.length > 0);

    return results.map(article => {
      let score = 0;
      const title = normalizeText(article.title || '');
      const description = normalizeText(article.description || '');
      const content = normalizeText(article.content || '');
      const tags = (article.tags || []).map(tag => normalizeText(tag));
      const categories = (article.categories || []).map(cat => normalizeText(cat));

      queryWords.forEach(word => {
        // Başlıkta tam eşleşme (en yüksek puan)
        if (title === word) score += 100;
        else if (title.includes(word)) score += 50;
        
        // Başlıkta başlangıç eşleşmesi
        if (title.startsWith(word)) score += 30;

        // Açıklamada eşleşme
        if (description.includes(word)) score += 20;

        // İçerikte eşleşme
        if (content.includes(word)) score += 10;

        // Etiketlerde eşleşme
        if (tags.some(tag => tag.includes(word))) score += 15;

        // Kategorilerde eşleşme
        if (categories.some(cat => cat.includes(word))) score += 15;
      });

      return { ...article, searchScore: score };
    }).sort((a, b) => {
      // Önce skora göre, sonra tarihe göre sırala
      if (b.searchScore !== a.searchScore) {
        return b.searchScore - a.searchScore;
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  };

  useEffect(() => {
    let results = articles;

    // Arama filtresi
    if (searchQuery.trim()) {
      results = searchArticles(searchQuery, results);
      results = scoreAndSortResults(searchQuery, results);
    }

    // Kategori filtresi
    if (selectedCategories.length > 0) {
      results = results.filter(article => 
        article.categories && 
        article.categories.some(cat => selectedCategories.includes(cat))
      );
    }

    // Sıralama (arama yapılmadıysa)
    if (!searchQuery.trim()) {
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
    }

    setFilteredArticles(results);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchQuery, articles, sortBy, selectedCategories]);

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
      <div className="min-h-screen bg-site-background dark:bg-dark-primary">
        <div className="text-center py-20">
          <LoadingSpinner size="medium" text="Makaleler Yükleniyor..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-site-background dark:bg-dark-primary">
        <div className="text-center py-20 px-4">
          <h2 className="text-2xl font-semibold text-red-600 mb-4">Bir Hata Oluştu</h2>
          <p className="text-text-muted">{error}</p>
        </div>
      </div>
    );
  }

  // Get featured articles (most popular or recent)
  const featuredArticles = articles
    .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
    .slice(0, 3);

  // Debug: Log featured articles data
  console.log('Featured articles:', featuredArticles.map(article => ({
    title: article.title,
    viewCount: article.viewCount,
    createdAt: article.createdAt
  })));

  // Get trending articles (recent with high engagement)
  const trendingArticles = articles
    .filter(article => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(article.createdAt) > weekAgo;
    })
    .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
    .slice(0, 6);

  // Get regular articles (excluding featured)
  const regularArticles = filteredArticles.filter(article => 
    !featuredArticles.some(featured => featured.id === article.id)
  );

  return (
    <div className="min-h-screen bg-site-background dark:bg-dark-primary">
      <MetaTags
        title="Makaleler"
        description="OpenWall'da yayınlanan tüm teknoloji,felsefe,sanat,spor,siyaset,ekonomi,sağlık,eğitim,çevre,sosyoloji,psikoloji,din,müzik,sinema,seyahat,yemek makalelerini keşfedin. En güncel teknoloji, felsefe,sanat,spor,siyaset,ekonomi,sağlık,eğitim,çevre,sosyoloji,psikoloji,din,müzik,sinema,seyahat,yemek haberleri ve analizler."
        keywords="teknoloji makaleleri, teknoloji haberleri, yazılım, donanım, yapay zeka, blockchain, siber güvenlik, felsefe,sanat,spor,siyaset,ekonomi,sağlık,eğitim,çevre,sosyoloji,psikoloji,din,müzik,sinema,seyahat,yemek"
      />
      <SchemaMarkup type="WebSite" />

      {/* Sticky Search and Navigation */}
      <div className={`sticky-search-bar sticky top-12 md:top-16 z-30 ${
        isSticky ? 'bg-white dark:bg-slate-900 shadow-sm' : 'bg-transparent'
      }`} style={isSticky ? { 
        marginLeft: isMobile ? '-1rem' : '-2rem', 
        marginRight: isMobile ? '-1rem' : '-2rem', 
        width: isMobile ? 'calc(100% + 2rem)' : 'calc(100% + 4rem)' 
      } : {}}>
        <div className={`w-full ${
          isSticky ? 'py-2' : 'py-4 sm:py-6'
        }`}>
          <div className={`${
            isSticky ? 'px-4 sm:px-6' : 'px-0 sm:px-12 lg:px-20 xl:px-32'
          }`}>
          <div className="flex flex-row items-center justify-between gap-3 sm:gap-6">
            {/* Search Bar */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full bg-white dark:bg-slate-800 rounded-full outline-none placeholder:text-slate-400 dark:placeholder-[#A1A1AA] text-left ${
                  isSticky ? 'px-4 py-2' : 'px-6 py-3'
                } text-base sm:text-base transition-all duration-200`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  <FaTimes className="w-4 h-4" />
                </button>
              )}
            </div>


            {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
              className={`whitespace-nowrap flex-shrink-0 text-sm py-1 ${
                showFilters || selectedCategories.length > 0
                ? 'text-slate-900 dark:text-slate-200 border-b border-slate-900 dark:border-slate-300'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              Kategori filtresi
            {selectedCategories.length > 0 && (
                <span className="ml-1 text-sm">({selectedCategories.length})</span>
            )}
            </button>
          </div>

          {/* Category Filters */}
          {showFilters && (
            <div className={`border-t border-slate-100 dark:border-[#A1A1AA] ${
              isSticky ? 'mt-2 pt-2' : 'mt-4 sm:mt-6 pt-4 sm:pt-6'
            }`}>
              <div className="flex flex-wrap gap-1 sm:gap-1">
                {availableCategories.map(category => (
                  <button
                    key={category}
                    onClick={() => handleCategoryToggle(category)}
                    className={`text-sm ${
                      isSticky ? 'px-2 py-1' : 'px-3 py-1.5 sm:px-3 sm:py-1'
                    } ${
                      selectedCategories.includes(category)
                        ? 'text-slate-900 dark:text-slate-200 border-b border-slate-900 dark:border-slate-300'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
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
      </div>

      {/* Main Content Area */}
      <div className="px-0 sm:px-12 lg:px-20 xl:px-32 py-8 sm:py-12">
        {filteredArticles.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-light text-slate-600 dark:text-slate-400 mb-4">
              {searchQuery || selectedCategories.length > 0 ? 'Sonuç bulunamadı' : 'Henüz makale yok'}
            </h2>
            <p className="text-slate-500 dark:text-slate-500 mb-8">
              {searchQuery || selectedCategories.length > 0 
                ? 'Farklı anahtar kelimelerle tekrar deneyin' 
                : 'Yakında burada içerikler olacak'
              }
            </p>
            {(searchQuery || selectedCategories.length > 0) && (
              <button
                onClick={clearAllFilters}
                className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors border-b border-slate-300 dark:border-slate-600 hover:border-slate-900 dark:hover:border-white"
              >
                Filtreleri temizle
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-12">
            {/* Featured Articles Section - Editorial Style */}
            {!searchQuery && selectedCategories.length === 0 && featuredArticles.length > 0 && (
              <section className="mb-20">
                <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 px-3 sm:px-0">
                  <h2 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white mb-0">
                    Öne Çıkan
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                  {/* Main Featured Article - Editorial Hero */}
                  <div className="lg:col-span-2">
                    <Link
                      to={`/articles/${featuredArticles[0].slug}`}
                      className="group block"
                    >
                      <div className="aspect-[3/2] relative overflow-hidden mb-6 bg-slate-50 dark:bg-slate-800 flex">
                        <LazyImage
                          src={featuredArticles[0].coverImage || `https://placehold.co/900x600/E2E8F0/A0AEC0?text=${encodeURIComponent(featuredArticles[0].title.substring(0,20))}`}
                          alt={featuredArticles[0].title}
                          className="w-full h-full object-cover object-center flex-1"
                          style={{objectFit: 'cover', objectPosition: 'center', minHeight: '100%', minWidth: '100%'}}
                        />
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="text-[30px] font-bold text-slate-900 dark:text-white leading-tight group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                          {featuredArticles[0].title}
                        </h3>
                        
                        <p className="text-lg text-slate-600 leading-relaxed font-light" style={{color: 'var(--tw-text-slate-600)'}}>
                          <span className="dark:hidden">{featuredArticles[0].description || featuredArticles[0].content?.substring(0, 200) + '...'}</span>
                          <span className="hidden dark:inline" style={{color: '#A1A1AA'}}>{featuredArticles[0].description || featuredArticles[0].content?.substring(0, 200) + '...'}</span>
                        </p>
                        
                        <div className="flex items-center space-x-6 text-sm text-slate-500 dark:text-slate-400 font-medium">
                          <span>{getTimeAgo(featuredArticles[0].createdAt)}</span>
                          <span>{featuredArticles[0].viewCount || 0} görüntülenme</span>
                          <span>{getReadingTime(featuredArticles[0].content)} okuma</span>
                        </div>
                        
                        {/* Editorial Content Preview */}
                        <div className="pt-6 border-t border-slate-200 dark:border-slate-600">
                          <div className="text-slate-700 leading-relaxed">
                            <span className="dark:hidden">
                              {(() => {
                                const content = featuredContent[featuredArticles[0].slug];
                                if (content && content.trim()) {
                                  const cleanContent = content.replace(/<[^>]*>/g, '').trim();
                                  return cleanContent.substring(0, 300) + (cleanContent.length > 300 ? '...' : '');
                                }
                                return featuredArticles[0].description || 'Bu makale hakkında daha fazla bilgi için makaleyi okuyun...';
                              })()}
                            </span>
                            <span className="hidden dark:inline" style={{color: '#A1A1AA'}}>
                              {(() => {
                                const content = featuredContent[featuredArticles[0].slug];
                                if (content && content.trim()) {
                                  const cleanContent = content.replace(/<[^>]*>/g, '').trim();
                                  return cleanContent.substring(0, 300) + (cleanContent.length > 300 ? '...' : '');
                                }
                                return featuredArticles[0].description || 'Bu makale hakkında daha fazla bilgi için makaleyi okuyun...';
                              })()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>

                  {/* Secondary Featured Articles - Editorial List */}
                  <div className="space-y-8">
                    {featuredArticles.slice(1, 3).map((article, index) => (
                      <Link
                        key={article.slug}
                        to={`/articles/${article.slug}`}
                        className="group block"
                      >
                        <div className="aspect-[4/3] relative overflow-hidden mb-4 bg-slate-50 dark:bg-slate-800 flex">
                          <LazyImage
                            src={article.coverImage || `https://placehold.co/600x450/E2E8F0/A0AEC0?text=${encodeURIComponent(article.title.substring(0,15))}`}
                            alt={article.title}
                            className="w-full h-full object-cover object-center flex-1"
                            style={{objectFit: 'cover', objectPosition: 'center', minHeight: '100%', minWidth: '100%'}}
                          />
                        </div>
                        
                        <div className="space-y-3">
                          <h3 className="text-[22px] font-bold text-slate-900 dark:text-white leading-tight group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                            {article.title}
                          </h3>
                          
                          <p className="text-slate-600 text-sm leading-relaxed">
                            <span className="dark:hidden">{article.description || article.content?.substring(0, 100) + '...'}</span>
                            <span className="hidden dark:inline" style={{color: '#A1A1AA'}}>{article.description || article.content?.substring(0, 100) + '...'}</span>
                          </p>
                          
                          <div className="flex items-center space-x-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
                            <span>{getTimeAgo(article.createdAt)}</span>
                            <span>{article.viewCount || 0} görüntülenme</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* All Articles Grid - Minimal */}
            <section>
              <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 px-3 sm:px-0">
                <h2 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white mb-0">
                  Tüm Makaleler
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 sm:gap-4 md:gap-6 lg:gap-8">
              {currentArticles.map(article => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>

              {/* Minimal Pagination */}
            {totalPages > 1 && (
                <div className="mt-16 flex justify-center">
                  <nav className="flex items-center gap-1">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                      className="px-3 py-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Önceki
                  </button>
                  
                    <div className="flex items-center gap-1">
                  {isMobile ? (
                        // Mobile pagination
                    <>
                      {currentPage > 2 && (
                        <>
                          <button
                            onClick={() => paginate(1)}
                                className="px-3 py-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
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
                                  className={`px-3 py-2 text-sm transition-colors ${
                                currentPage === pageNum
                                      ? 'text-slate-900 dark:text-white border-b border-slate-900 dark:border-white'
                                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
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
                                className="px-3 py-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
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
                            className={`px-3 py-2 text-sm transition-colors ${
                          currentPage === number
                                ? 'text-slate-900 dark:text-white border-b border-slate-900 dark:border-white'
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
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
                      className="px-3 py-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Sonraki
                  </button>
                  </nav>
                </div>
              )}
            </section>
              </div>
        )}
      </div>
    </div>
  );
};

export default ArticlesPage; 