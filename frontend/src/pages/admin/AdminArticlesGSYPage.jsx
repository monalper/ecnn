// frontend/src/pages/admin/AdminArticlesGSYPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FaEye, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import api from '../../services/api';

const AdminArticlesGSYPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingSlug, setEditingSlug] = useState(null);
  const [editValue, setEditValue] = useState('');

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/admin/articles');
      setArticles(response.data);
    } catch (err) {
      console.error("Makaleler yüklenirken hata:", err.response?.data?.message || err.message);
      setError(err.response?.data?.message || 'Makaleler yüklenemedi.');
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const handleEditClick = (article) => {
    setEditingSlug(article.slug);
    setEditValue(article.viewCount || 0);
  };

  const handleCancelEdit = () => {
    setEditingSlug(null);
    setEditValue('');
  };

  const handleSaveEdit = async (articleSlug) => {
    const count = parseInt(editValue);
    if (isNaN(count) || count < 0) {
      alert('Geçerli bir sayı girin (0 veya daha büyük)');
      return;
    }

    try {
      await api.put(`/articles/${articleSlug}/view-count`, { viewCount: count });
      
      // Update local state
      setArticles(articles.map(article => 
        article.slug === articleSlug 
          ? { ...article, viewCount: count }
          : article
      ));
      
      setEditingSlug(null);
      setEditValue('');
      alert('Görüntülenme sayısı güncellendi!');
    } catch (err) {
      console.error('Error updating view count:', err);
      setError('Görüntülenme sayısı güncellenirken bir hata oluştu.');
    }
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
      <div className="text-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3"></div>
        <p className="text-slate-600">Makaleler Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 md:p-10 rounded-2xl shadow-2xl border border-slate-100">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 mb-1">Görüntülenme Sayısı Yönetimi</h1>
          <p className="text-slate-500 text-base">Makalelerin görüntülenme sayılarını düzenleyin ve yönetin.</p>
        </div>
        <Link
          to="/admin/articles"
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-500 hover:from-gray-700 hover:to-gray-600 text-white font-bold rounded-xl shadow-lg hover:shadow-2xl transition-all text-base"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Makalelere Dön
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-base flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          {error}
        </div>
      )}

      {!loading && !error && articles.length === 0 ? (
        <p className="text-center text-slate-500 py-8">Henüz oluşturulmuş bir makale yok.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <div className="min-w-full divide-y divide-slate-200">
            {/* Table Header */}
            <div className="bg-slate-50">
              <div className="grid grid-cols-12 gap-4 px-5 py-3.5">
                <div className="col-span-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Başlık</div>
                <div className="col-span-2 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Durum</div>
                <div className="col-span-2 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Mevcut Görüntülenme</div>
                <div className="col-span-2 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Yeni Değer</div>
                <div className="col-span-2 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">İşlemler</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="bg-white divide-y divide-slate-200">
              {articles.map((article) => (
                <div key={article.slug} className="transition-all group hover:shadow-lg hover:-translate-y-1 bg-white rounded-xl my-2 border border-slate-100 hover:border-blue-200 duration-200">
                  <div className="grid grid-cols-12 gap-4 px-5 py-4 items-center">
                    <div className="col-span-4">
                      <h3 className="font-bold text-slate-800 text-base">{article.title}</h3>
                      <p className="text-xs text-slate-500 mt-1">Slug: {article.slug}</p>
                    </div>
                    <div className="col-span-2">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-full shadow-sm ${
                        article.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {article.status === 'published' ? (
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        ) : (
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h4v4" /></svg>
                        )}
                        {article.status === 'published' ? 'Yayında' : 'Taslak'}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <div className="flex items-center gap-2">
                        <FaEye className="text-slate-400 w-4 h-4" />
                        <span className="font-semibold text-slate-800">{formatViews(article.viewCount || 0)}</span>
                      </div>
                    </div>
                    <div className="col-span-2">
                      {editingSlug === article.slug ? (
                        <input
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          min="0"
                          placeholder="Yeni değer"
                        />
                      ) : (
                        <span className="text-slate-500 text-sm">-</span>
                      )}
                    </div>
                    <div className="col-span-2 flex justify-center gap-2">
                      {editingSlug === article.slug ? (
                        <>
                          <button
                            onClick={() => handleSaveEdit(article.slug)}
                            className="flex items-center gap-1 px-3 py-1 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 text-xs font-semibold shadow-sm border border-green-100 hover:border-green-200 transition-all"
                            title="Kaydet"
                          >
                            <FaSave className="w-3 h-3" />
                            Kaydet
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="flex items-center gap-1 px-3 py-1 rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100 text-xs font-semibold shadow-sm border border-gray-100 hover:border-gray-200 transition-all"
                            title="İptal"
                          >
                            <FaTimes className="w-3 h-3" />
                            İptal
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleEditClick(article)}
                          className="flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold shadow-sm border border-blue-100 hover:border-blue-200 transition-all"
                          title="Düzenle"
                        >
                          <FaEdit className="w-3 h-3" />
                          Düzenle
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminArticlesGSYPage; 