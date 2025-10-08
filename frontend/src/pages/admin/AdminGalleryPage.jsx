import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminGalleryPage = () => {
  const { user } = useAuth();
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageFile: null,
    imageUrl: '',
    imageKey: ''
  });

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/gallery');
      
      // Ensure we always have an array
      const items = Array.isArray(response.data) ? response.data : [];
      setGalleryItems(items);
    } catch (err) {
      console.error('Galeri yüklenirken hata:', err);
      setError('Galeri yüklenirken bir hata oluştu.');
      setGalleryItems([]); // Ensure it's an empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, imageFile: file }));
    }
  };

  const uploadImage = async (file) => {
    try {
      // Get presigned URL
      const presignedResponse = await api.post('/gallery/upload', {
        fileName: file.name,
        contentType: file.type
      });

      const { uploadUrl, key, accessUrl } = presignedResponse.data;

      // Upload to S3 directly using the presigned URL with better error handling
      try {
        await axios.put(uploadUrl, file, {
          headers: {
            'Content-Type': file.type,
            'Cache-Control': 'max-age=31536000'
          },
          timeout: 30000 // 30 second timeout
        });
      } catch (uploadError) {
        console.error('S3 upload error:', uploadError);
        if (uploadError.code === 'ERR_NETWORK' || uploadError.message.includes('CORS')) {
          throw new Error('CORS hatası: AWS S3 bucket CORS ayarlarını kontrol edin.');
        }
        throw new Error('Resim S3\'e yüklenirken hata oluştu.');
      }

      return { key, accessUrl };
    } catch (error) {
      console.error('Image upload error:', error);
      if (error.message.includes('CORS')) {
        throw new Error('CORS hatası: AWS S3 bucket CORS ayarlarını kontrol edin.');
      }
      throw new Error('Resim yüklenirken hata oluştu.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('Başlık gereklidir.');
      return;
    }

    if (!formData.imageFile && !formData.imageUrl) {
      alert('Bir resim seçin veya URL girin.');
      return;
    }

    try {
      setUploading(true);

      let imageKey = formData.imageKey;
      let imageUrl = formData.imageUrl;

      // Upload new image if file is selected
      if (formData.imageFile) {
        const uploadResult = await uploadImage(formData.imageFile);
        imageKey = uploadResult.key;
        imageUrl = uploadResult.accessUrl;
      }

      const galleryData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        imageKey,
        imageUrl
      };

      if (editingItem) {
        // Update existing item
        await api.put(`/gallery/${editingItem.id}`, galleryData);
      } else {
        // Create new item
        await api.post('/gallery', galleryData);
      }

      // Reset form and close modal
      resetForm();
      setShowAddModal(false);
      setEditingItem(null);
      
      // Refresh gallery items
      await fetchGalleryItems();
      
    } catch (error) {
      console.error('Gallery item save error:', error);
      alert(error.response?.data?.message || 'Galeri öğesi kaydedilirken hata oluştu.');
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || '',
      imageFile: null,
      imageUrl: item.imageUrl,
      imageKey: item.imageKey
    });
    setShowAddModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Bu galeri öğesini silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      await api.delete(`/gallery/${id}`);
      await fetchGalleryItems();
    } catch (error) {
      console.error('Delete error:', error);
      alert('Galeri öğesi silinirken hata oluştu.');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      imageFile: null,
      imageUrl: '',
      imageKey: ''
    });
  };

  const openAddModal = () => {
    resetForm();
    setEditingItem(null);
    setShowAddModal(true);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingItem(null);
    resetForm();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" text="Galeri yükleniyor..." />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Galeri Yönetimi - Admin Panel</title>
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Galeri Yönetimi
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Galeri görsellerini yönetin ve düzenleyin
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="px-6 py-3 bg-brand-orange text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Yeni Görsel Ekle
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Gallery Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {galleryItems.map((item) => (
            <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              {/* Image */}
              <div className="relative" style={{ paddingBottom: '75%' }}>
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              
              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4">
                    {item.description}
                  </p>
                )}
                
                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                  >
                    Düzenle
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {!Array.isArray(galleryItems) || galleryItems.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📷</div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Henüz galeri öğesi yok
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              İlk galeri öğesini eklemek için yukarıdaki butona tıklayın.
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                {editingItem ? 'Galeri Öğesini Düzenle' : 'Yeni Galeri Öğesi Ekle'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Başlık *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Açıklama
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Resim *
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Maksimum dosya boyutu: 5MB
                  </p>
                </div>

                {/* Current Image Preview */}
                {formData.imageUrl && !formData.imageFile && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Mevcut Resim
                    </label>
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                )}

                {/* Form Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="flex-1 px-4 py-2 bg-brand-orange text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? (
                      <div className="flex items-center justify-center">
                        <div className="loader" style={{ width: '1rem', height: '1rem', margin: '0 0.5rem 0 0', border: '0.0625rem #fff solid' }}></div>
                        Kaydediliyor...
                      </div>
                    ) : (
                      editingItem ? 'Güncelle' : 'Ekle'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminGalleryPage; 