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
  FaExclamationTriangle
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
      <div className="min-h-screen bg-site-background dark:bg-dark-primary flex justify-center items-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 dark:border-gray-600 border-t-red-600 dark:border-t-red-400"></div>
          <p className="text-gray-600 dark:text-gray-300 text-sm font-['Inter']">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-site-background dark:bg-dark-primary">
      <div className="max-w-7xl mx-auto space-y-8 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="glass-morphism rounded-3xl p-6 sm:p-8 border border-white/20 dark:border-white/10">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white font-['Inter']">
                Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg font-['Inter']">
                OpenWall yönetim paneli - Detaylı analitik
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                to="/admin/articles/create"
                className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-['Inter']"
              >
                <FaPlus className="w-4 h-4" />
                Yeni Makale
              </Link>
            </div>
          </div>
        </div>

        {/* Ana İstatistik Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="group glass-morphism rounded-2xl p-4 sm:p-6 border border-white/20 dark:border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 rounded-xl">
                <FaNewspaper className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="text-right">
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white font-['Inter']">{stats.totalArticles}</p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-['Inter']">Toplam</p>
              </div>
            </div>
            <div className="flex gap-2 text-xs">
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full font-['Inter']">
                {stats.publishedArticles} Yayında
              </span>
              <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-full font-['Inter']">
                {stats.draftArticles} Taslak
              </span>
            </div>
          </div>

          <div className="group glass-morphism rounded-2xl p-4 sm:p-6 border border-white/20 dark:border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl">
                <FaEye className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-right">
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white font-['Inter']">
                  {formatViews(stats.totalViews)}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-['Inter']">Görüntülenme</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-['Inter']">
              Ortalama: {formatViews(stats.averageViewsPerArticle)}/makale
            </p>
          </div>

          <div className="group glass-morphism rounded-2xl p-4 sm:p-6 border border-white/20 dark:border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/30 rounded-xl">
                <FaStar className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="text-right">
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white font-['Inter']">
                  {stats.highlightedArticles}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-['Inter']">Öne Çıkan</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-['Inter']">
              Öne çıkarılan makale sayısı
            </p>
          </div>
        </div>

        {/* Hızlı Erişim */}
        <div className="glass-morphism rounded-2xl border border-white/20 dark:border-white/10 shadow-lg">
          <div className="p-4 sm:p-6 border-b border-white/20 dark:border-white/10">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white font-['Inter']">
              Hızlı Erişim
            </h2>
          </div>
          
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
              <Link
                to="/admin/articles/create"
                className="group flex flex-col items-center gap-3 p-4 sm:p-6 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border border-red-200/60 dark:border-red-700/60 rounded-2xl hover:from-red-100 hover:to-red-200 dark:hover:from-red-900/30 dark:hover:to-red-800/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="p-3 bg-red-600 rounded-xl group-hover:scale-110 transition-transform">
                  <FaPlus className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <span className="font-medium text-gray-900 dark:text-white text-xs sm:text-sm text-center font-['Inter']">Yeni Makale</span>
              </Link>
              
              <Link
                to="/admin/articles"
                className="group flex flex-col items-center gap-3 p-4 sm:p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200/60 dark:border-green-700/60 rounded-2xl hover:from-green-100 hover:to-green-200 dark:hover:from-green-900/30 dark:hover:to-green-800/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="p-3 bg-green-600 rounded-xl group-hover:scale-110 transition-transform">
                  <FaNewspaper className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <span className="font-medium text-gray-900 dark:text-white text-xs sm:text-sm text-center font-['Inter']">Makaleler</span>
              </Link>
              
              <Link
                to="/admin/gallery"
                className="group flex flex-col items-center gap-3 p-4 sm:p-6 bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 border border-pink-200/60 dark:border-pink-700/60 rounded-2xl hover:from-pink-100 hover:to-pink-200 dark:hover:from-pink-900/30 dark:hover:to-pink-800/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="p-3 bg-pink-600 rounded-xl group-hover:scale-110 transition-transform">
                  <FaImages className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <span className="font-medium text-gray-900 dark:text-white text-xs sm:text-sm text-center font-['Inter']">Galeri</span>
              </Link>
              
              <Link
                to="/admin/videos"
                className="group flex flex-col items-center gap-3 p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200/60 dark:border-blue-700/60 rounded-2xl hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-900/30 dark:hover:to-blue-800/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="p-3 bg-blue-600 rounded-xl group-hover:scale-110 transition-transform">
                  <FaVideo className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <span className="font-medium text-gray-900 dark:text-white text-xs sm:text-sm text-center font-['Inter']">Videolar</span>
              </Link>
              
              <Link
                to="/admin/dictionary"
                className="group flex flex-col items-center gap-3 p-4 sm:p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border border-orange-200/60 dark:border-orange-700/60 rounded-2xl hover:from-orange-100 hover:to-orange-200 dark:hover:from-orange-900/30 dark:hover:to-orange-800/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="p-3 bg-orange-600 rounded-xl group-hover:scale-110 transition-transform">
                  <FaBook className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <span className="font-medium text-gray-900 dark:text-white text-xs sm:text-sm text-center font-['Inter']">Sözlük</span>
              </Link>
              
              <Link
                to="/admin/comments"
                className="group flex flex-col items-center gap-3 p-4 sm:p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200/60 dark:border-purple-700/60 rounded-2xl hover:from-purple-100 hover:to-purple-200 dark:hover:from-purple-900/30 dark:hover:to-purple-800/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg relative"
              >
                <div className="p-3 bg-purple-600 rounded-xl group-hover:scale-110 transition-transform">
                  <FaComments className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <span className="font-medium text-gray-900 dark:text-white text-xs sm:text-sm text-center font-['Inter']">Yorumlar</span>
                {commentStats.pendingComments > 0 && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center font-bold">
                    {commentStats.pendingComments}
                  </div>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Yorum İstatistikleri */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="group glass-morphism rounded-2xl p-4 sm:p-6 border border-white/20 dark:border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-xl">
                <FaComments className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-right">
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white font-['Inter']">{commentStats.totalComments}</p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-['Inter']">Toplam Yorum</p>
              </div>
            </div>
            <div className="flex gap-2 text-xs">
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full font-['Inter']">
                {commentStats.approvedComments} Onaylı
              </span>
              <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-full font-['Inter']">
                {commentStats.pendingComments} Bekliyor
              </span>
            </div>
          </div>

          <div className="group glass-morphism rounded-2xl p-4 sm:p-6 border border-white/20 dark:border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/30 rounded-xl">
                <FaExclamationTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="text-right">
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white font-['Inter']">{commentStats.pendingComments}</p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-['Inter']">Onay Bekliyor</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-['Inter']">
              İnceleme gereken yorum sayısı
            </p>
          </div>

          <div className="group glass-morphism rounded-2xl p-4 sm:p-6 border border-white/20 dark:border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-xl">
                <FaStar className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-right">
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white font-['Inter']">{commentStats.approvedComments}</p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-['Inter']">Onaylanmış</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-['Inter']">
              Yayında olan yorum sayısı
            </p>
          </div>
        </div>

        {/* Onay Bekleyen Yorumlar */}
        {commentStats.pendingComments > 0 && (
          <div className="glass-morphism rounded-2xl border border-white/20 dark:border-white/10 shadow-lg">
            <div className="p-4 sm:p-6 border-b border-white/20 dark:border-white/10">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white font-['Inter']">
                  Onay Bekleyen Yorumlar
                </h2>
                <Link
                  to="/admin/comments"
                  className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium font-['Inter']"
                >
                  Tümünü Gör →
                </Link>
              </div>
            </div>
            
            <div className="p-4 sm:p-6">
              <div className="space-y-4">
                {recentComments.map((comment) => (
                  <div key={comment.commentId} className="flex items-start space-x-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center text-white text-sm font-semibold font-['Inter']">
                        {comment.authorName.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white font-['Inter']">
                          {comment.authorName}
                        </h4>
                        <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 text-xs rounded-full font-['Inter']">
                          Bekliyor
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-['Inter']">
                        {new Date(comment.createdAt).toLocaleDateString('tr-TR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 font-['Inter']">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
