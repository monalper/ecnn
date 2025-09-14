// frontend/src/pages/admin/AdminArticlesListPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye } from 'react-icons/fa';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext'; // Token vs. için gerekebilir

const AdminArticlesListPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // const { token } = useAuth(); // Eğer API isteği için token gerekiyorsa (api.js zaten hallediyor)
  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchAdminArticles = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      // Admin için tüm makaleleri (taslaklar dahil) getiren endpoint
      // Backend'deki /api/admin/articles endpoint'i verifyToken ve isAdmin middleware'lerini kullanıyor.
      const response = await api.get('/admin/articles');
      setArticles(response.data);
    } catch (err) {
      console.error("Admin makaleleri yüklenirken hata:", err.response?.data?.message || err.message);
      setError(err.response?.data?.message || 'Makaleler yüklenemedi.');
      if (err.response?.status === 401 || err.response?.status === 403) {
        // Yetkisiz erişim durumunda login sayfasına yönlendirilebilir.
        // navigate('/login');
      }
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, [navigate]); // navigate dependency'si eklendi (eğer yönlendirme yapılırsa)

  useEffect(() => {
    fetchAdminArticles();
  }, [fetchAdminArticles]);

  const handleDeleteArticle = async (slugToDelete, articleTitle) => {
    // Basit bir confirm yerine daha şık bir modal kullanılabilir.
    if (window.confirm(`'${articleTitle}' başlıklı makaleyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`)) {
      try {
        await api.delete(`/admin/articles/${slugToDelete}/delete`);
        // alert('Makale başarıyla silindi.'); // Daha iyi bir notification sistemi (örn: react-toastify)
        // Listeyi yenile
        setArticles(prevArticles => prevArticles.filter(article => article.slug !== slugToDelete));
      } catch (err) {
        console.error("Makale silinirken hata:", err.response?.data?.message || err.message);
        setError(`Makale silinemedi: ${err.response?.data?.message || err.message}`);
        // alert(`Makale silinemedi: ${err.response?.data?.message || err.message}`);
      }
    }
  };

  const toggleHighlight = async (articleSlug, currentHighlightStatus) => {
    try {
      const response = await api.put(`/articles/${articleSlug}/highlight`, {
        isHighlighted: !currentHighlightStatus
      });
      
      // Update local state
      setArticles(articles.map(article => 
        article.slug === articleSlug 
          ? { ...article, isHighlighted: !currentHighlightStatus }
          : article
      ));
      
      alert(currentHighlightStatus ? 'Makale öne çıkarılmaktan çıkarıldı!' : 'Makale öne çıkarıldı!');
    } catch (err) {
      console.error('Error toggling highlight:', err);
      setError('Öne çıkarma işlemi sırasında bir hata oluştu.');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3"></div>
        <p className="text-slate-600">Makaleler Yükleniyor...</p>
      </div>
    );
  }
  
  // Hata mesajı için ayrı bir bölüm
  {error && (
    <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
      {error}
    </div>
  )}

  return (
    <div className="bg-white p-6 md:p-10 rounded-2xl shadow-2xl border border-slate-100">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 mb-1">Makale Yönetimi</h1>
          <p className="text-slate-500 text-base">Tüm makaleleri görüntüleyin, düzenleyin veya yeni makale ekleyin.</p>
        </div>
        <Link
          to="/admin/articles/create"
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-2xl transition-all text-base"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          Yeni Makale
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-base flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          {error}
        </div>
      )}

      {!loading && !error && articles.length === 0 ? (
        <p className="text-center text-slate-500 py-8">Henüz oluşturulmuş bir makale yok. İlk makalenizi ekleyebilirsiniz!</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <div className="min-w-full divide-y divide-slate-200">
            {/* Table Header - Hidden on mobile */}
            <div className="hidden md:block bg-slate-50">
              <div className="grid grid-cols-10 gap-4 px-5 py-3.5">
                <div className="col-span-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Başlık</div>
                <div className="col-span-2 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Durum</div>
                <div className="col-span-2 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Oluşturulma Tarihi</div>
                <div className="col-span-2 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">İşlemler</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="bg-white divide-y divide-slate-200">
              {articles.map((article) => (
                <div key={article.slug} className="transition-all group hover:shadow-2xl hover:-translate-y-1 bg-white rounded-2xl my-4 border border-slate-100 hover:border-blue-200 duration-200">
                  {/* Mobile View */}
                  <div className="md:hidden p-5 space-y-3">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-slate-800 text-lg">{article.title}</h3>
                      <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-full shadow-sm ${
                        article.status === 'published' ? 'bg-green-100 text-green-700' : 
                        article.status === 'unlisted' ? 'bg-blue-100 text-blue-700' : 
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {article.status === 'published' ? (
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        ) : article.status === 'unlisted' ? (
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                        ) : (
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h4v4" /></svg>
                        )}
                        {article.status === 'published' ? 'Yayında' : 
                         article.status === 'unlisted' ? 'Liste Dışı' : 
                         'Taslak'}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 text-sm text-slate-500">
                      <span>Oluşturulma: {new Date(article.createdAt).toLocaleDateString('tr-TR')}</span>
                      <span>Son Güncelleme: {new Date(article.updatedAt).toLocaleDateString('tr-TR')}</span>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        onClick={() => toggleHighlight(article.slug, article.isHighlighted)}
                        className={`flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-semibold transition-all shadow-sm border ${
                          article.isHighlighted
                            ? 'bg-yellow-100 text-yellow-900 border-yellow-200 hover:bg-yellow-200'
                            : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                        }`}
                        title="Öne Çıkar"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 17.75L18.5 21l-1.7-7.36L22 9.24l-7.41-.64L12 2 9.41 8.6 2 9.24l5.2 4.4L5.5 21z" /></svg>
                        {article.isHighlighted ? 'Öne Çıkarıldı' : 'Öne Çıkar'}
                      </button>
                      <Link
                        to={`/admin/articles/${article.slug}/edit`}
                        className="flex items-center gap-1 px-3 py-1 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold shadow-sm border border-blue-100 hover:border-blue-200 transition-all"
                        title="Düzenle"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 11l6-6m2 2l-6 6m2 2l6-6m-2 2l-6 6" /></svg>
                        Düzenle
                      </Link>
                      <button
                        onClick={() => handleDeleteArticle(article.slug, article.title)}
                        className="flex items-center gap-1 px-3 py-1 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 text-xs font-semibold shadow-sm border border-red-100 hover:border-red-200 transition-all"
                        title="Sil"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        Sil
                      </button>
                    </div>
                  </div>

                  {/* Desktop View */}
                  <div className="hidden md:grid grid-cols-10 gap-4 px-7 py-5 items-center">
                    <div className="col-span-4">
                      <h3 className="font-bold text-slate-800 text-lg">{article.title}</h3>
                    </div>
                    <div className="col-span-2">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-full shadow-sm ${
                        article.status === 'published' ? 'bg-green-100 text-green-700' : 
                        article.status === 'unlisted' ? 'bg-blue-100 text-blue-700' : 
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {article.status === 'published' ? (
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        ) : article.status === 'unlisted' ? (
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                        ) : (
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h4v4" /></svg>
                        )}
                        {article.status === 'published' ? 'Yayında' : 
                         article.status === 'unlisted' ? 'Liste Dışı' : 
                         'Taslak'}
                      </span>
                    </div>
                    <div className="col-span-2 text-sm text-slate-500">
                      {new Date(article.createdAt).toLocaleDateString('tr-TR')}
                    </div>
                    <div className="col-span-2 flex justify-center gap-2">
                      <button
                        onClick={() => toggleHighlight(article.slug, article.isHighlighted)}
                        className={`flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-semibold transition-all shadow-sm border ${
                          article.isHighlighted
                            ? 'bg-yellow-100 text-yellow-900 border-yellow-200 hover:bg-yellow-200'
                            : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                        }`}
                        title="Öne Çıkar"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 17.75L18.5 21l-1.7-7.36L22 9.24l-7.41-.64L12 2 9.41 8.6 2 9.24l5.2 4.4L5.5 21z" /></svg>
                        {article.isHighlighted ? 'Öne Çıkarıldı' : 'Öne Çıkar'}
                      </button>
                      <Link
                        to={`/admin/articles/${article.slug}/edit`}
                        className="flex items-center gap-1 px-3 py-1 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold shadow-sm border border-blue-100 hover:border-blue-200 transition-all"
                        title="Düzenle"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 11l6-6m2 2l-6 6m2 2l6-6m-2 2l-6 6" /></svg>
                        Düzenle
                      </Link>
                      <button
                        onClick={() => handleDeleteArticle(article.slug, article.title)}
                        className="flex items-center gap-1 px-3 py-1 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 text-xs font-semibold shadow-sm border border-red-100 hover:border-red-200 transition-all"
                        title="Sil"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        Sil
                      </button>
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

export default AdminArticlesListPage;
