// frontend/src/pages/admin/AdminDashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaNewspaper, 
  FaUsers, 
  FaEye, 
  FaStar, 
  FaChartLine, 
  FaCalendarAlt,
  FaClock,
  FaEdit,
  FaTrash,
  FaPlus
} from 'react-icons/fa';
import api from '../../services/api';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    totalArticles: 0,
    publishedArticles: 0,
    draftArticles: 0,
    totalUsers: 0,
    totalViews: 0,
    highlightedArticles: 0
  });
  const [recentArticles, setRecentArticles] = useState([]);
  const [popularArticles, setPopularArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Tüm verileri paralel olarak çek
      const [articlesRes, usersRes] = await Promise.all([
        api.get('/admin/articles'),
        api.get('/admin/users')
      ]);

      const articles = articlesRes.data;
      const users = usersRes.data;

      // İstatistikleri hesapla
      const publishedArticles = articles.filter(a => a.status === 'published');
      const draftArticles = articles.filter(a => a.status === 'draft');
      const highlightedArticles = articles.filter(a => a.isHighlight);
      const totalViews = articles.reduce((sum, article) => sum + (article.viewCount || 0), 0);

      setStats({
        totalArticles: articles.length,
        publishedArticles: publishedArticles.length,
        draftArticles: draftArticles.length,
        totalUsers: users.length,
        totalViews,
        highlightedArticles: highlightedArticles.length
      });

      // Son makaleler
      const recent = articles
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      // Popüler makaleler
      const popular = articles
        .filter(a => a.status === 'published')
        .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
        .slice(0, 5);

      setRecentArticles(recent);
      setPopularArticles(popular);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
              Admin Dashboard
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              OpenWall yönetim paneli - Site istatistikleri ve hızlı erişim
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/admin/articles/create"
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
            >
              <FaPlus className="w-4 h-4" />
              Yeni Makale
            </Link>
          </div>
        </div>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Toplam Makale</p>
              <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">{stats.totalArticles}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-xl">
              <FaNewspaper className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-4 flex gap-4 text-sm">
            <span className="text-green-600 dark:text-green-400">
              {stats.publishedArticles} Yayında
            </span>
            <span className="text-yellow-600 dark:text-yellow-400">
              {stats.draftArticles} Taslak
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Toplam Görüntülenme</p>
              <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                {formatViews(stats.totalViews)}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-xl">
              <FaEye className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="mt-4 text-sm text-slate-600 dark:text-slate-400">
            Tüm makalelerin toplam görüntülenme sayısı
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Öne Çıkan</p>
              <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                {stats.highlightedArticles}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-xl">
              <FaStar className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
          <div className="mt-4 text-sm text-slate-600 dark:text-slate-400">
            Öne çıkarılan makale sayısı
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Kullanıcılar</p>
              <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">{stats.totalUsers}</p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-xl">
              <FaUsers className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="mt-4 text-sm text-slate-600 dark:text-slate-400">
            Kayıtlı kullanıcı sayısı
          </div>
        </div>
      </div>

      {/* Son Makaleler ve Popüler Makaleler */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Son Makaleler */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Son Makaleler
            </h2>
            <Link
              to="/admin/articles"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Tümünü Gör →
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentArticles.map((article) => (
              <div key={article.slug} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-xl">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm line-clamp-1">
                    {article.title}
                  </h3>
                  <div className="flex items-center gap-4 mt-1 text-xs text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <FaCalendarAlt className="w-3 h-3" />
                      {formatDate(article.createdAt)}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      article.status === 'published' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                    }`}>
                      {article.status === 'published' ? 'Yayında' : 'Taslak'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    to={`/admin/articles/${article.slug}/edit`}
                    className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors"
                    title="Düzenle"
                  >
                    <FaEdit className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popüler Makaleler */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Popüler Makaleler
            </h2>
            <FaChartLine className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          
          <div className="space-y-4">
            {popularArticles.map((article, index) => (
              <div key={article.slug} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm line-clamp-1">
                      {article.title}
                    </h3>
                    <div className="flex items-center gap-4 mt-1 text-xs text-slate-600 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <FaEye className="w-3 h-3" />
                        {formatViews(article.viewCount || 0)} görüntülenme
                      </span>
                    </div>
                  </div>
                </div>
                <Link
                  to={`/articles/${article.slug}`}
                  className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors"
                  title="Görüntüle"
                >
                  <FaEye className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hızlı Erişim */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-6">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6">
          Hızlı Erişim
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/admin/articles/create"
            className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
          >
            <FaPlus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="font-medium text-slate-800 dark:text-slate-100">Yeni Makale</span>
          </Link>
          
          <Link
            to="/admin/articles"
            className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
          >
            <FaNewspaper className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span className="font-medium text-slate-800 dark:text-slate-100">Makaleleri Yönet</span>
          </Link>
          
          <Link
            to="/admin/users"
            className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
          >
            <FaUsers className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span className="font-medium text-slate-800 dark:text-slate-100">Kullanıcılar</span>
          </Link>
          
          <Link
            to="/admin/dictionary"
            className="flex items-center gap-3 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
          >
            <FaEdit className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            <span className="font-medium text-slate-800 dark:text-slate-100">Sözlük</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
