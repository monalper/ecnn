// frontend/src/pages/admin/EditArticlePage.jsx
import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { lazy } from 'react';
import LoadingSpinner from '../../components/LoadingSpinner';
import api from '../../services/api';

// Lazy load ArticleForm to reduce initial bundle size
const ArticleForm = lazy(() => import('../../components/article/ArticleForm'));

const EditArticlePage = () => {
  const { slug } = useParams(); // URL'den makale slug'ını al
  const navigate = useNavigate();
  const location = useLocation(); // Yönlendirme sonrası mesaj için
  
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(''); // Sayfa seviyesinde yükleme hatası
  const [formError, setFormError] = useState(''); // Form seviyesinde genel hata
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Eğer ?created=true query param'ı varsa, yeni oluşturuldu mesajını göster
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get('created') === 'true') {
      setSuccessMessage('Makale başarıyla oluşturuldu! Şimdi düzenleyebilirsiniz.');
      // Query param'ını URL'den temizle (isteğe bağlı)
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  const fetchArticleForEditing = useCallback(async () => {
    if (!slug) return;
    setLoading(true);
    setError('');
    setFormError('');
    try {
      // Admin için makale detaylarını (taslaklar dahil) getiren endpoint
      const response = await api.get(`/admin/articles/${slug}/details`);
      setArticle(response.data);
    } catch (err) {
      console.error("Düzenlenecek makale yüklenirken hata:", err.response?.data?.message || err.message);
      setError(err.response?.data?.message || 'Makale yüklenemedi veya bulunamadı.');
      setArticle(null);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchArticleForEditing();
  }, [fetchArticleForEditing]);

  const handleEditArticle = async (articleData) => {
    setFormError('');
    try {
      // Backend'deki /api/admin/articles/:slug/edit endpoint'i
      const response = await api.put(`/admin/articles/${slug}/edit`, articleData);
      // alert('Makale başarıyla güncellendi!');
      setSuccessMessage('Makale başarıyla güncellendi!');
      setArticle(response.data); // Formu güncel veriyle doldurmak için (isteğe bağlı)
      // navigate(`/admin/articles`); // Veya düzenleme sayfasında kal
      // Formu güncel tutmak için article state'ini güncellemek önemli
      // Eğer slug değişirse (başlık değişimiyle), yeni slug'a yönlendirme yapılabilir.
      // Backend'in yeni slug'ı response'da dönmesi gerekir.
      if (response.data.slug && response.data.slug !== slug) {
        navigate(`/admin/articles/${response.data.slug}/edit?updated=true`, { replace: true });
      }

    } catch (err) {
      console.error("Makale güncellenirken hata:", err.response?.data?.message || err.message);
      setFormError(err.response?.data?.message || 'Makale güncellenemedi. Lütfen alanları kontrol edin.');
      throw err; // ArticleForm'un kendi içindeki loading state'ini yönetmesi için
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10">
        <LoadingSpinner size="medium" text="Makale Bilgileri Yükleniyor..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <h2 className="text-xl font-semibold text-red-600 mb-3">Hata</h2>
        <p className="text-slate-600">{error}</p>
        <Link to="/admin/articles" className="mt-4 inline-block text-blue-600 hover:underline">
          Makale Listesine Geri Dön
        </Link>
      </div>
    );
  }
  
  if (!article) {
    return (
      <div className="text-center">
        <p className="text-slate-600">Düzenlenecek makale bulunamadı.</p>
         <Link to="/admin/articles" className="mt-4 inline-block text-blue-600 hover:underline">
          Makale Listesine Geri Dön
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">Makaleyi Düzenle</h1>
      <p className="text-sm text-slate-500 mb-6 truncate">"{article.title}"</p>
      
      {successMessage && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm">
          {successMessage}
        </div>
      )}

      <Suspense fallback={
        <div className="flex justify-center items-center py-20">
          <LoadingSpinner size="medium" text="Editör Yükleniyor..." />
        </div>
      }>
        <ArticleForm 
          onSubmit={handleEditArticle} 
          articleData={article} 
          isEditing={true}
          formError={formError}
          setFormError={setFormError} 
        />
      </Suspense>
    </div>
  );
};

export default EditArticlePage;
