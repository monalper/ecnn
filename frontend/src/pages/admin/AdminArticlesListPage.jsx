import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiStar, FiEye } from 'react-icons/fi';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminArticlesListPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const fetchAdminArticles = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/admin/articles');
      setArticles(response.data);
    } catch (err) {
      console.error('Makale yüklenemedi:', err);
      setError(err.response?.data?.message || 'Makaleler yüklenemedi.');
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdminArticles();
  }, [fetchAdminArticles]);

  const handleDeleteArticle = async (slug, title) => {
    if (window.confirm(`"${title}" başlıklı makaleyi silmek istediğine emin misin?`)) {
      try {
        await api.delete(`/admin/articles/${slug}/delete`);
        setArticles(prev => prev.filter(a => a.slug !== slug));
      } catch (err) {
        setError(err.response?.data?.message || 'Silme işlemi başarısız oldu.');
      }
    }
  };

  const toggleHighlight = async (slug, current) => {
    try {
      await api.put(`/articles/${slug}/highlight`, { isHighlighted: !current });
      setArticles(prev =>
        prev.map(a =>
          a.slug === slug ? { ...a, isHighlighted: !current } : a
        )
      );
    } catch {
      setError('Öne çıkarma işlemi başarısız.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner text="Yükleniyor..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1115] text-gray-100 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Makale Yönetimi
            </h1>
            <p className="text-sm text-gray-400">
              Makaleleri görüntüle, düzenle veya yenisini oluştur.
            </p>
          </div>
          <Link
            to="/admin/articles/create"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all"
          >
            <FiPlus className="w-4 h-4" />
            Yeni Makale
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-900/40 border border-red-700 text-red-200 text-sm">
            {error}
          </div>
        )}

        {/* No Articles */}
        {articles.length === 0 && !error && (
          <p className="text-center text-gray-500 mt-10">
            Henüz hiç makale bulunmuyor. Yeni bir tane oluşturabilirsiniz.
          </p>
        )}

        {/* Table */}
        {articles.length > 0 && (
          <div className="overflow-hidden border border-gray-800 rounded-xl bg-[#16181d] shadow-xl">
            <div className="hidden md:grid grid-cols-12 px-6 py-3 border-b border-gray-800 text-xs font-semibold uppercase tracking-wider text-gray-400">
              <div className="col-span-5">Başlık</div>
              <div className="col-span-2">Durum</div>
              <div className="col-span-2">Tarih</div>
              <div className="col-span-3 text-center">İşlemler</div>
            </div>

            <div className="divide-y divide-gray-800">
              {articles.map(article => (
                <div
                  key={article.slug}
                  className="grid grid-cols-12 px-6 py-4 items-center hover:bg-[#1b1d23] transition-colors"
                >
                  <div className="col-span-5">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-100">
                        {article.title}
                      </span>
                      <span className="text-xs text-gray-500">
                        Güncelleme: {new Date(article.updatedAt).toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                  </div>

                  <div className="col-span-2">
                    <span
                      className={`text-xs font-medium px-3 py-1 rounded-full ${
                        article.status === 'published'
                          ? 'bg-green-900/40 text-green-300'
                          : article.status === 'unlisted'
                          ? 'bg-blue-900/40 text-blue-300'
                          : 'bg-yellow-900/40 text-yellow-300'
                      }`}
                    >
                      {article.status === 'published'
                        ? 'Yayında'
                        : article.status === 'unlisted'
                        ? 'Liste Dışı'
                        : 'Taslak'}
                    </span>
                  </div>

                  <div className="col-span-2 text-sm text-gray-400">
                    {new Date(article.createdAt).toLocaleDateString('tr-TR')}
                  </div>

                  <div className="col-span-3 flex justify-center gap-2">
                    <button
                      onClick={() =>
                        toggleHighlight(article.slug, article.isHighlighted)
                      }
                      title="Öne Çıkar"
                      className={`p-2 rounded-md border border-transparent hover:border-yellow-600 transition-all ${
                        article.isHighlighted
                          ? 'text-yellow-400 bg-yellow-900/30'
                          : 'text-gray-400 hover:text-yellow-400'
                      }`}
                    >
                      <FiStar className="w-4 h-4" />
                    </button>

                    <Link
                      to={`/admin/articles/${article.slug}/edit`}
                      title="Düzenle"
                      className="p-2 rounded-md border border-transparent text-gray-400 hover:text-blue-400 hover:border-blue-600 transition-all"
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </Link>

                    <button
                      onClick={() => handleDeleteArticle(article.slug, article.title)}
                      title="Sil"
                      className="p-2 rounded-md border border-transparent text-gray-400 hover:text-red-400 hover:border-red-700 transition-all"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
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

export default AdminArticlesListPage;
