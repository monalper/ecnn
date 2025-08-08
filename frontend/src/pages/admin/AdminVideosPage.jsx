import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import api from '../../services/api';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const AdminVideosPage = () => {
  const { user } = useAuth();
  const [videoItems, setVideoItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoFile: null,
    videoUrl: '',
    videoKey: '',
    thumbnailFile: null,
    thumbnailUrl: '',
    thumbnailKey: '',
    duration: '',
    subtitles: []
  });

  // Subtitle management state
  const [subtitleFile, setSubtitleFile] = useState(null);
  const [subtitleLanguage, setSubtitleLanguage] = useState('tr');
  const [subtitleLabel, setSubtitleLabel] = useState('');

  useEffect(() => {
    fetchVideoItems();
  }, []);

  const fetchVideoItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/videos');
      
      // Ensure we always have an array
      const items = Array.isArray(response.data) ? response.data : [];
      setVideoItems(items);
    } catch (err) {
      console.error('Videolar yüklenirken hata:', err);
      setError('Videolar yüklenirken bir hata oluştu.');
      setVideoItems([]); // Ensure it's an empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleVideoFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, videoFile: file }));
    }
  };

  const handleThumbnailFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, thumbnailFile: file }));
    }
  };

  const handleSubtitleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSubtitleFile(file);
    }
  };

  const uploadVideo = async (file) => {
    try {
      // Get presigned URL for video
      const presignedResponse = await api.post('/videos/upload', {
        fileName: file.name,
        contentType: file.type
      });

      const { uploadUrl, key, accessUrl } = presignedResponse.data;

      // Upload to S3 directly using the presigned URL
      try {
        await axios.put(uploadUrl, file, {
          headers: {
            'Content-Type': file.type,
            'Cache-Control': 'max-age=31536000'
          },
          timeout: 60000 // 60 second timeout for videos
        });
      } catch (uploadError) {
        console.error('S3 video upload error:', uploadError);
        if (uploadError.code === 'ERR_NETWORK' || uploadError.message.includes('CORS')) {
          throw new Error('CORS hatası: AWS S3 bucket CORS ayarlarını kontrol edin.');
        }
        throw new Error('Video S3\'e yüklenirken hata oluştu.');
      }

      return { key, accessUrl };
    } catch (error) {
      console.error('Video upload error:', error);
      if (error.message.includes('CORS')) {
        throw new Error('CORS hatası: AWS S3 bucket CORS ayarlarını kontrol edin.');
      }
      throw new Error('Video yüklenirken hata oluştu.');
    }
  };

  const uploadThumbnail = async (file) => {
    try {
      // Get presigned URL for thumbnail
      const presignedResponse = await api.post('/videos/upload-thumbnail', {
        fileName: file.name,
        contentType: file.type
      });

      const { uploadUrl, key, accessUrl } = presignedResponse.data;

      // Upload to S3 directly using the presigned URL
      try {
        await axios.put(uploadUrl, file, {
          headers: {
            'Content-Type': file.type,
            'Cache-Control': 'max-age=31536000'
          },
          timeout: 30000 // 30 second timeout
        });
      } catch (uploadError) {
        console.error('S3 thumbnail upload error:', uploadError);
        if (uploadError.code === 'ERR_NETWORK' || uploadError.message.includes('CORS')) {
          throw new Error('CORS hatası: AWS S3 bucket CORS ayarlarını kontrol edin.');
        }
        throw new Error('Thumbnail S3\'e yüklenirken hata oluştu.');
      }

      return { key, accessUrl };
    } catch (error) {
      console.error('Thumbnail upload error:', error);
      if (error.message.includes('CORS')) {
        throw new Error('CORS hatası: AWS S3 bucket CORS ayarlarını kontrol edin.');
      }
      throw new Error('Thumbnail yüklenirken hata oluştu.');
    }
  };

  const uploadSubtitle = async (file) => {
    try {
      // Determine the correct content type for subtitle files
      let contentType = file.type;
      const fileExtension = file.name.toLowerCase().split('.').pop();
      
      // If browser doesn't provide a content type, set it based on file extension
      if (!contentType || contentType === 'application/octet-stream') {
        switch (fileExtension) {
          case 'srt':
            contentType = 'application/x-subrip';
            break;
          case 'vtt':
            contentType = 'text/vtt';
            break;
          case 'txt':
            contentType = 'text/plain';
            break;
          default:
            contentType = 'text/plain';
        }
      }
      
      console.log('Subtitle file info:', {
        name: file.name,
        type: file.type,
        resolvedType: contentType,
        size: file.size
      });

      // Get presigned URL for subtitle
      const presignedResponse = await api.post('/videos/upload-subtitle', {
        fileName: file.name,
        contentType: contentType
      });

      const { uploadUrl, key, accessUrl } = presignedResponse.data;

      // Upload to S3 directly using the presigned URL
      try {
        await axios.put(uploadUrl, file, {
          headers: {
            'Content-Type': contentType,
            'Cache-Control': 'max-age=31536000'
          },
          timeout: 30000 // 30 second timeout
        });
      } catch (uploadError) {
        console.error('S3 subtitle upload error:', uploadError);
        if (uploadError.code === 'ERR_NETWORK' || uploadError.message.includes('CORS')) {
          throw new Error('CORS hatası: AWS S3 bucket CORS ayarlarını kontrol edin.');
        }
        throw new Error('Altyazı S3\'e yüklenirken hata oluştu.');
      }

      return { key, accessUrl };
    } catch (error) {
      console.error('Subtitle upload error:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      if (error.message.includes('CORS')) {
        throw new Error('CORS hatası: AWS S3 bucket CORS ayarlarını kontrol edin.');
      }
      throw new Error('Altyazı yüklenirken hata oluştu.');
    }
  };

  const addSubtitle = async () => {
    if (!subtitleFile || !subtitleLanguage || !subtitleLabel) {
      alert('Altyazı dosyası, dil ve etiket gereklidir.');
      return;
    }

    try {
      console.log('Adding subtitle:', {
        file: subtitleFile.name,
        language: subtitleLanguage,
        label: subtitleLabel
      });

      const uploadResult = await uploadSubtitle(subtitleFile);
      
      console.log('Subtitle upload result:', uploadResult);
      
      const newSubtitle = {
        id: Date.now().toString(),
        language: subtitleLanguage,
        label: subtitleLabel,
        key: uploadResult.key,
        url: uploadResult.accessUrl
      };

      console.log('New subtitle object:', newSubtitle);

      setFormData(prev => ({
        ...prev,
        subtitles: [...prev.subtitles, newSubtitle]
      }));

      // Reset subtitle form
      setSubtitleFile(null);
      setSubtitleLanguage('tr');
      setSubtitleLabel('');
      
      // Reset file input
      const fileInput = document.getElementById('subtitle-file');
      if (fileInput) fileInput.value = '';
      
      alert('Altyazı başarıyla eklendi!');
      
    } catch (error) {
      console.error('Subtitle add error:', error);
      alert(error.message || 'Altyazı eklenirken hata oluştu.');
    }
  };

  const removeSubtitle = (subtitleId) => {
    setFormData(prev => ({
      ...prev,
      subtitles: prev.subtitles.filter(sub => sub.id !== subtitleId)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('Başlık gereklidir.');
      return;
    }

    if (!formData.videoFile && !formData.videoUrl) {
      alert('Bir video seçin veya URL girin.');
      return;
    }

    try {
      setUploading(true);

      let videoKey = formData.videoKey;
      let videoUrl = formData.videoUrl;
      let thumbnailKey = formData.thumbnailKey;
      let thumbnailUrl = formData.thumbnailUrl;

      // Upload new video if file is selected
      if (formData.videoFile) {
        const uploadResult = await uploadVideo(formData.videoFile);
        videoKey = uploadResult.key;
        videoUrl = uploadResult.accessUrl;
      }

      // Upload new thumbnail if file is selected
      if (formData.thumbnailFile) {
        const uploadResult = await uploadThumbnail(formData.thumbnailFile);
        thumbnailKey = uploadResult.key;
        thumbnailUrl = uploadResult.accessUrl;
      }

      const videoData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        videoKey,
        videoUrl,
        thumbnailKey,
        thumbnailUrl,
        duration: formData.duration ? parseInt(formData.duration) : 0,
        subtitles: formData.subtitles
      };

      if (editingItem) {
        // Update existing item
        await api.put(`/videos/${editingItem.id}`, videoData);
      } else {
        // Create new item
        await api.post('/videos', videoData);
      }

      // Reset form and close modal
      resetForm();
      setShowAddModal(false);
      setEditingItem(null);
      
      // Refresh video items
      await fetchVideoItems();
      
    } catch (error) {
      console.error('Video item save error:', error);
      alert(error.response?.data?.message || 'Video öğesi kaydedilirken hata oluştu.');
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || '',
      videoFile: null,
      videoUrl: item.videoUrl,
      videoKey: item.videoKey,
      thumbnailFile: null,
      thumbnailUrl: item.thumbnailUrl,
      thumbnailKey: item.thumbnailKey,
      duration: item.duration ? item.duration.toString() : '',
      subtitles: item.subtitles || []
    });
    setShowAddModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Bu video öğesini silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      await api.delete(`/videos/${id}`);
      await fetchVideoItems();
    } catch (error) {
      console.error('Delete error:', error);
      alert('Video öğesi silinirken hata oluştu.');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      videoFile: null,
      videoUrl: '',
      videoKey: '',
      thumbnailFile: null,
      thumbnailUrl: '',
      thumbnailKey: '',
      duration: '',
      subtitles: []
    });
    setSubtitleFile(null);
    setSubtitleLanguage('tr');
    setSubtitleLabel('');
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

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Video Yönetimi - Admin Panel</title>
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Video Yönetimi
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Video içeriklerini yönetin ve düzenleyin
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="px-6 py-3 bg-brand-orange text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Yeni Video Ekle
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Video Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videoItems.map((item) => (
            <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              {/* Video Thumbnail */}
              <div className="relative" style={{ paddingBottom: '56.25%' }}>
                <div className="absolute inset-0 bg-black rounded overflow-hidden">
                  <img
                    src={item.thumbnailUrl || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIyNSIgdmlld0JveD0iMCAwIDQwMCAyMjUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIyMjUiIGZpbGw9IiNmM2Y0ZjYiLz48cmVjdCB4PSIxNTAiIHk9Ijg3LjUiIHdpZHRoPSIxMDAiIGhlaWdodD0iNTAiIGZpbGw9IiNkMWQ1ZGIiIHJ4PSI4Ii8+PHBvbHlnb24gcG9pbnRzPSIxNzAsMTAwIDE3MCwxMjUgMTkwLDExMi41IiBmaWxsPSIjOWNhM2FmIi8+PHRleHQgeD0iMjAwIiB5PSIxNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2YjcyODAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCI+VmlkZW8gVGh1bWJuYWlsPC90ZXh0Pjwvc3ZnPg=='}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                  <div className="bg-white bg-opacity-90 rounded-full p-2">
                    <svg className="w-6 h-6 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>

                {/* Duration badge */}
                {item.duration && (
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                    {formatDuration(item.duration)}
                  </div>
                )}
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

        {!Array.isArray(videoItems) || videoItems.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎥</div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Henüz video öğesi yok
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              İlk video öğesini eklemek için yukarıdaki butona tıklayın.
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[95vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {editingItem ? 'Video Düzenle' : 'Video Yükle'}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {editingItem ? 'Video bilgilerini güncelleyin' : 'Yeni bir video yükleyin'}
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex">
              {/* Left Side - Video Preview */}
              <div className="w-1/2 p-6 border-r border-gray-200 dark:border-gray-700">
                <div className="sticky top-24">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Video Önizleme
                  </h3>
                  
                  {/* Video Upload Area */}
                  {!formData.videoUrl && !formData.videoFile && (
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-brand-orange transition-colors">
                      <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v14a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1h4zM9 4v2h6V4H9z" />
                      </svg>
                      <p className="text-gray-600 dark:text-gray-400 mb-2">Video dosyanızı buraya sürükleyin</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">veya dosya seçmek için tıklayın</p>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoFileChange}
                        className="hidden"
                        id="video-upload"
                      />
                      <label
                        htmlFor="video-upload"
                        className="inline-flex items-center px-4 py-2 bg-brand-orange text-white rounded-lg hover:bg-orange-600 transition-colors cursor-pointer"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Video Seç
                      </label>
                    </div>
                  )}

                  {/* Video Preview */}
                  {(formData.videoUrl || formData.videoFile) && (
                    <div className="bg-black rounded-lg overflow-hidden">
                      <video
                        src={formData.videoFile ? URL.createObjectURL(formData.videoFile) : formData.videoUrl}
                        className="w-full h-64 object-cover"
                        controls
                      />
                    </div>
                  )}

                  {/* Thumbnail Preview */}
                  {(formData.thumbnailUrl || formData.thumbnailFile) && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Thumbnail</h4>
                      <img
                        src={formData.thumbnailFile ? URL.createObjectURL(formData.thumbnailFile) : formData.thumbnailUrl}
                        alt="Thumbnail"
                        className="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Right Side - Form */}
              <div className="w-1/2 p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Video Bilgileri
                    </h3>
                    
                    {/* Title */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Başlık *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                        placeholder="Video başlığını girin"
                        required
                      />
                    </div>

                    {/* Description */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Açıklama
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors resize-none"
                        placeholder="Video açıklamasını girin"
                      />
                    </div>
                  </div>

                  {/* Media Files */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Medya Dosyaları
                    </h3>
                    
                    {/* Video Upload */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Video Dosyası *
                      </label>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoFileChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-orange file:text-white hover:file:bg-orange-600"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        MP4, WebM, OGV • Maks. 100MB
                      </p>
                    </div>

                    {/* Thumbnail Upload */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Thumbnail (İsteğe bağlı)
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailFileChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-600 file:text-white hover:file:bg-gray-700"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        JPG, PNG, GIF • Maks. 5MB
                      </p>
                    </div>
                  </div>

                  {/* Subtitles */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Altyazılar
                    </h3>
                    
                    {/* Current Subtitles */}
                    {formData.subtitles.length > 0 && (
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Mevcut Altyazılar
                        </label>
                        <div className="space-y-2">
                          {formData.subtitles.map(sub => (
                            <div key={sub.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-brand-orange rounded-full flex items-center justify-center">
                                  <span className="text-white text-xs font-bold">{sub.language.toUpperCase()}</span>
                                </div>
                                <div>
                                  <span className="text-sm font-medium text-gray-900 dark:text-white">{sub.label}</span>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">{sub.language}</p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeSubtitle(sub.id)}
                                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors p-1"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Add New Subtitle */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Yeni Altyazı Ekle
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="file"
                          id="subtitle-file"
                          accept=".srt,.vtt"
                          onChange={handleSubtitleFileChange}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => document.getElementById('subtitle-file').click()}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          <span>Altyazı Seç</span>
                        </button>
                      </div>
                      
                      {/* Subtitle Form */}
                      {subtitleFile && (
                        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                            <svg className="w-4 h-4 mr-2 text-brand-orange" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            Altyazı Bilgileri
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                Dil *
                              </label>
                              <select
                                value={subtitleLanguage}
                                onChange={(e) => setSubtitleLanguage(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                              >
                                <option value="tr">🇹🇷 Türkçe</option>
                                <option value="en">🇺🇸 İngilizce</option>
                                <option value="de">🇩🇪 Almanca</option>
                                <option value="fr">🇫🇷 Fransızca</option>
                                <option value="es">🇪🇸 İspanyolca</option>
                                <option value="it">🇮🇹 İtalyanca</option>
                                <option value="ru">🇷🇺 Rusça</option>
                                <option value="ar">🇸🇦 Arapça</option>
                                <option value="zh">🇨🇳 Çince</option>
                                <option value="ja">🇯🇵 Japonca</option>
                                <option value="ko">🇰🇷 Korece</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                Etiket *
                              </label>
                              <input
                                type="text"
                                value={subtitleLabel}
                                onChange={(e) => setSubtitleLabel(e.target.value)}
                                placeholder="Örn: Türkçe Altyazı"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                              />
                            </div>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <button
                              type="button"
                              onClick={addSubtitle}
                              className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center justify-center space-x-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <span>Ekle</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setSubtitleFile(null);
                                setSubtitleLanguage('tr');
                                setSubtitleLabel('');
                                const fileInput = document.getElementById('subtitle-file');
                                if (fileInput) fileInput.value = '';
                              }}
                              className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
                            >
                              İptal
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4 rounded-b-xl">
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={uploading}
                  className="px-6 py-3 bg-brand-orange text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center space-x-2"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Yükleniyor...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{editingItem ? 'Güncelle' : 'Yayınla'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminVideosPage; 