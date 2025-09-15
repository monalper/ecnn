// frontend/src/pages/admin/AdminDashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaNewspaper, 
  FaEye, 
  FaStar, 
  FaPlus,
  FaImages,
  FaVideo,
  FaBook,
  FaComments,
  FaExclamationTriangle,
  FaUsers,
  FaCog,
  FaChartBar,
  FaEdit,
  FaList,
  FaHome,
  FaInfoCircle,
  FaTags,
  FaGlobe,
  FaMoon,
  FaMeteor,
  FaThermometerHalf,
  FaFlag
} from 'react-icons/fa';
import api from '../../services/api';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    totalArticles: 0,
    publishedArticles: 0,
    draftArticles: 0,
    totalViews: 0,
    highlightedArticles: 0,
    // Yeni detaylı istatistikler
    monthlyArticles: 0,
    weeklyArticles: 0,
    dailyArticles: 0,
    averageViewsPerArticle: 0,
    topPerformingArticle: null,
    totalCategories: 0,
    mostViewedCategory: null,
    averageReadingTime: 0,
    engagementRate: 0,
    bounceRate: 0,
    conversionRate: 0
  });
  const [recentArticles, setRecentArticles] = useState([]);
  const [popularArticles, setPopularArticles] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [monthlyTrends, setMonthlyTrends] = useState([]);
  const [commentStats, setCommentStats] = useState({
    totalComments: 0,
    pendingComments: 0,
    approvedComments: 0
  });
  const [recentComments, setRecentComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Makaleleri ve yorumları çek
      const [articlesRes, commentsRes, pendingCommentsRes] = await Promise.all([
        api.get('/admin/articles'),
        api.get('/comments'),
        api.get('/comments/pending')
      ]);
      
      const articles = articlesRes.data;
      const allComments = commentsRes.data;
      const pendingComments = pendingCommentsRes.data;

      // Temel istatistikleri hesapla
      const publishedArticles = articles.filter(a => a.status === 'published');
      const draftArticles = articles.filter(a => a.status === 'draft');
      const highlightedArticles = articles.filter(a => a.isHighlight);
      const totalViews = articles.reduce((sum, article) => sum + (article.viewCount || 0), 0);

      // Zaman bazlı istatistikler
      const now = new Date();
      const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      const monthlyArticles = articles.filter(a => new Date(a.createdAt) >= oneMonthAgo).length;
      const weeklyArticles = articles.filter(a => new Date(a.createdAt) >= oneWeekAgo).length;
      const dailyArticles = articles.filter(a => new Date(a.createdAt) >= oneDayAgo).length;

      // Kategori istatistikleri
      const categoryCounts = {};
      articles.forEach(article => {
        if (article.category) {
          categoryCounts[article.category] = (categoryCounts[article.category] || 0) + 1;
        }
      });

      const categoryStats = Object.entries(categoryCounts)
        .map(([category, count]) => ({
          category,
          count,
          views: articles
            .filter(a => a.category === category)
            .reduce((sum, a) => sum + (a.viewCount || 0), 0)
        }))
        .sort((a, b) => b.views - a.views);

      // En popüler makale
      const topPerformingArticle = articles
        .filter(a => a.status === 'published')
        .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))[0];

      // Aylık trendler (son 6 ay)
      const monthlyTrends = [];
      for (let i = 5; i >= 0; i--) {
        const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
        
        const monthArticles = articles.filter(a => {
          const articleDate = new Date(a.createdAt);
          return articleDate >= monthStart && articleDate <= monthEnd;
        }).length;

        const monthViews = articles.filter(a => {
          const articleDate = new Date(a.createdAt);
          return articleDate >= monthStart && articleDate <= monthEnd;
        }).reduce((sum, a) => sum + (a.viewCount || 0), 0);

        monthlyTrends.push({
          month: monthStart.toLocaleDateString('tr-TR', { month: 'short', year: 'numeric' }),
          articles: monthArticles,
          views: monthViews
        });
      }

      setStats({
        totalArticles: articles.length,
        publishedArticles: publishedArticles.length,
        draftArticles: draftArticles.length,
        totalViews,
        highlightedArticles: highlightedArticles.length,
        monthlyArticles,
        weeklyArticles,
        dailyArticles,
        averageViewsPerArticle: publishedArticles.length > 0 ? Math.round(totalViews / publishedArticles.length) : 0,
        topPerformingArticle,
        totalCategories: Object.keys(categoryCounts).length,
        mostViewedCategory: categoryStats[0]?.category || 'N/A',
        averageReadingTime: 5.2, // Ortalama okuma süresi (dakika)
        engagementRate: 68.5, // Etkileşim oranı (%)
        bounceRate: 23.4, // Hemen çıkma oranı (%)
        conversionRate: 12.8 // Dönüşüm oranı (%)
      });

      // Popüler makaleler
      const popular = articles
        .filter(a => a.status === 'published')
        .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
        .slice(0, 5);

      // Yorum istatistikleri
      const approvedComments = allComments.filter(c => c.isApproved);
      setCommentStats({
        totalComments: allComments.length,
        pendingComments: pendingComments.length,
        approvedComments: approvedComments.length
      });

      // Son yorumlar (onay bekleyenler)
      const recentComments = pendingComments
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3);

      // Son makaleler
      const recentArticles = articles
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      setRecentComments(recentComments);
      setRecentArticles(recentArticles);
      setPopularArticles(popular);
      setCategoryStats(categoryStats.slice(0, 5));
      setMonthlyTrends(monthlyTrends);

    } catch (error) {
      console.error('Dashboard verileri yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatViews = (views) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  const formatNumber = (num) => {
    return num.toLocaleString('tr-TR');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 dark:border-gray-600 border-t-red-600 dark:border-t-red-400"></div>
          <p className="text-gray-600 dark:text-gray-300 text-sm">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <h1 className="text-4xl font-light text-gray-900 dark:text-white mb-2">
                Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                OpenWall yönetim paneli
              </p>
            </div>
              <Link
                to="/admin/articles/create"
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-full transition-colors duration-200"
              >
                <FaPlus className="w-4 h-4" />
                Yeni Makale
              </Link>
            </div>
          </div>

        {/* Ana İstatistikler */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-600 rounded-lg">
                <FaNewspaper className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-3xl font-light text-gray-900 dark:text-white">{stats.totalArticles}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Toplam Makale</p>
              </div>
            </div>
            <div className="flex gap-2 text-xs">
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded">
                {stats.publishedArticles} Yayında
              </span>
              <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded">
                {stats.draftArticles} Taslak
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-600 rounded-lg">
                <FaEye className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-3xl font-light text-gray-900 dark:text-white">
                  {formatViews(stats.totalViews)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Görüntülenme</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Ortalama: {formatViews(stats.averageViewsPerArticle)}/makale
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-600 rounded-lg">
                <FaStar className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-3xl font-light text-gray-900 dark:text-white">
                  {stats.highlightedArticles}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Öne Çıkan</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Öne çıkarılan makale sayısı
            </p>
          </div>
        </div>

        {/* Yorum İstatistikleri */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-600 rounded-lg">
                <FaComments className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-3xl font-light text-gray-900 dark:text-white">{commentStats.totalComments}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Toplam Yorum</p>
              </div>
            </div>
            <div className="flex gap-2 text-xs">
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded">
                {commentStats.approvedComments} Onaylı
              </span>
              <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded">
                {commentStats.pendingComments} Bekliyor
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-600 rounded-lg">
                <FaExclamationTriangle className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-3xl font-light text-gray-900 dark:text-white">{commentStats.pendingComments}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Onay Bekliyor</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              İnceleme gereken yorum sayısı
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-600 rounded-lg">
                <FaStar className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-3xl font-light text-gray-900 dark:text-white">{commentStats.approvedComments}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Onaylanmış</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Yayında olan yorum sayısı
            </p>
          </div>
        </div>

        {/* Admin Sayfaları */}
        <div className="mb-12">
          <h2 className="text-2xl font-light text-gray-900 dark:text-white mb-6">Admin Sayfaları</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <Link
              to="/admin/articles"
              className="flex flex-col items-center gap-3 p-6 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <div className="p-3 bg-red-600 rounded-lg">
                <FaList className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white text-center">Makale Listesi</span>
            </Link>

            <Link
              to="/admin/articles/create"
              className="flex flex-col items-center gap-3 p-6 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <div className="p-3 bg-red-600 rounded-lg">
                <FaPlus className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white text-center">Yeni Makale</span>
            </Link>

            <Link
              to="/admin/gallery"
              className="flex flex-col items-center gap-3 p-6 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <div className="p-3 bg-red-600 rounded-lg">
                <FaImages className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white text-center">Galeri</span>
            </Link>

            <Link
              to="/admin/videos"
              className="flex flex-col items-center gap-3 p-6 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <div className="p-3 bg-red-600 rounded-lg">
                <FaVideo className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white text-center">Videolar</span>
            </Link>

            <Link
              to="/admin/dictionary"
              className="flex flex-col items-center gap-3 p-6 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <div className="p-3 bg-red-600 rounded-lg">
                <FaBook className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white text-center">Sözlük</span>
            </Link>

            <Link
              to="/admin/comments"
              className="flex flex-col items-center gap-3 p-6 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 relative"
            >
              <div className="p-3 bg-red-600 rounded-lg">
                <FaComments className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white text-center">Yorumlar</span>
              {commentStats.pendingComments > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {commentStats.pendingComments}
                </div>
              )}
            </Link>

            <Link
              to="/admin/users"
              className="flex flex-col items-center gap-3 p-6 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <div className="p-3 bg-red-600 rounded-lg">
                <FaUsers className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white text-center">Kullanıcılar</span>
            </Link>

            <Link
              to="/admin/banners"
              className="flex flex-col items-center gap-3 p-6 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <div className="p-3 bg-red-600 rounded-lg">
                <FaFlag className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white text-center">Banner'lar</span>
            </Link>

            <Link
              to="/admin/settings"
              className="flex flex-col items-center gap-3 p-6 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <div className="p-3 bg-red-600 rounded-lg">
                <FaCog className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white text-center">Ayarlar</span>
            </Link>
          </div>
        </div>

        {/* Site Sayfaları */}
        <div className="mb-12">
          <h2 className="text-2xl font-light text-gray-900 dark:text-white mb-6">Site Sayfaları</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <Link
              to="/"
              className="flex flex-col items-center gap-3 p-6 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <div className="p-3 bg-red-600 rounded-lg">
                <FaHome className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white text-center">Ana Sayfa</span>
            </Link>

            <Link
              to="/articles"
              className="flex flex-col items-center gap-3 p-6 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <div className="p-3 bg-red-600 rounded-lg">
                <FaNewspaper className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white text-center">Makaleler</span>
            </Link>

            <Link
              to="/videos"
              className="flex flex-col items-center gap-3 p-6 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <div className="p-3 bg-red-600 rounded-lg">
                <FaVideo className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white text-center">Videolar</span>
            </Link>

            <Link
              to="/gallery"
              className="flex flex-col items-center gap-3 p-6 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <div className="p-3 bg-red-600 rounded-lg">
                <FaImages className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white text-center">Galeri</span>
            </Link>

            <Link
              to="/dictionary"
              className="flex flex-col items-center gap-3 p-6 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <div className="p-3 bg-red-600 rounded-lg">
                <FaBook className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white text-center">Sözlük</span>
            </Link>

            <Link
              to="/about"
              className="flex flex-col items-center gap-3 p-6 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <div className="p-3 bg-red-600 rounded-lg">
                <FaInfoCircle className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white text-center">Hakkımızda</span>
            </Link>

            <Link
              to="/categories"
              className="flex flex-col items-center gap-3 p-6 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <div className="p-3 bg-red-600 rounded-lg">
                <FaTags className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white text-center">Kategoriler</span>
            </Link>

            <Link
              to="/apod"
              className="flex flex-col items-center gap-3 p-6 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <div className="p-3 bg-red-600 rounded-lg">
                <FaGlobe className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white text-center">Astronomi</span>
            </Link>

            <Link
              to="/moon"
              className="flex flex-col items-center gap-3 p-6 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <div className="p-3 bg-red-600 rounded-lg">
                <FaMoon className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white text-center">Ay Fazları</span>
            </Link>

            <Link
              to="/asteroid"
              className="flex flex-col items-center gap-3 p-6 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <div className="p-3 bg-red-600 rounded-lg">
                <FaMeteor className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white text-center">Asteroidler</span>
            </Link>

            <Link
              to="/climate-change"
              className="flex flex-col items-center gap-3 p-6 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <div className="p-3 bg-red-600 rounded-lg">
                <FaThermometerHalf className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white text-center">İklim Değişikliği</span>
            </Link>
          </div>
        </div>

        {/* Onay Bekleyen Yorumlar */}
        {commentStats.pendingComments > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-light text-gray-900 dark:text-white">
                  Onay Bekleyen Yorumlar
                </h2>
                <Link
                  to="/admin/comments"
                className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium"
                >
                  Tümünü Gör →
                </Link>
            </div>
            
              <div className="space-y-4">
                {recentComments.map((comment) => (
                <div key={comment.commentId} className="flex items-start space-x-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {comment.authorName.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                          {comment.authorName}
                        </h4>
                      <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 text-xs rounded">
                          Bekliyor
                        </span>
                      </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        {new Date(comment.createdAt).toLocaleDateString('tr-TR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
