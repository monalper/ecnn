import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FaArrowLeft, FaDownload, FaShare, FaHeart, FaEye } from 'react-icons/fa';
import SchemaMarkup from '../components/seo/SchemaMarkup';
import api from '../services/api';

const GalleryItemPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [galleryItem, setGalleryItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGalleryItem();
  }, [id]);

  const fetchGalleryItem = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/gallery/${id}`);
      setGalleryItem(response.data);
    } catch (err) {
      console.error('Galeri öğesi yüklenirken hata:', err);
      setError('Galeri öğesi bulunamadı.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    navigate('/gallery');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Görsel yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error || !galleryItem) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📷</div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Görsel bulunamadı
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {error || 'Aradığınız görsel mevcut değil.'}
          </p>
          <button 
            onClick={handleBackClick}
            className="px-4 py-2 bg-brand-orange text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Galeriye Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{galleryItem.title} - Galeri - OpenWall</title>
        <meta name="description" content={galleryItem.description || `OpenWall galeri - ${galleryItem.title}`} />
        <meta property="og:title" content={`${galleryItem.title} - Galeri - OpenWall`} />
        <meta property="og:description" content={galleryItem.description || `OpenWall galeri - ${galleryItem.title}`} />
        <meta property="og:image" content={galleryItem.imageUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://openwall.com.tr/gallery/${galleryItem.id}`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={galleryItem.title} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${galleryItem.title} - Galeri - OpenWall`} />
        <meta name="twitter:description" content={galleryItem.description || `OpenWall galeri - ${galleryItem.title}`} />
        <meta name="twitter:image" content={galleryItem.imageUrl} />
        
        {/* Canonical URL */}
        <link rel="canonical" href={`https://openwall.com.tr/gallery/${galleryItem.id}`} />
      </Helmet>

      {/* Schema.org ImageObject Markup */}
      <SchemaMarkup
        type="ImageObject"
        data={{
          title: galleryItem.title,
          description: galleryItem.description || `OpenWall galeri - ${galleryItem.title}`,
          imageUrl: galleryItem.imageUrl,
          uploadDate: galleryItem.createdAt
        }}
      />

      <div className="px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={handleBackClick}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-brand-orange dark:hover:text-brand-orange transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Galeriye Dön
          </button>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Image */}
          <div className="mb-8">
            <img
              src={galleryItem.imageUrl}
              alt={galleryItem.title}
              className="w-full h-auto max-h-[80vh] object-contain shadow-lg"
            />
          </div>

          {/* Image Info */}
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {galleryItem.title}
            </h1>
            {galleryItem.description && (
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                {galleryItem.description}
              </p>
            )}
            
            {/* Metadata */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-center items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                <span>
                  Eklenme: {new Date(galleryItem.createdAt).toLocaleDateString('tr-TR')}
                </span>
                {galleryItem.updatedAt !== galleryItem.createdAt && (
                  <span>
                    Güncelleme: {new Date(galleryItem.updatedAt).toLocaleDateString('tr-TR')}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GalleryItemPage; 