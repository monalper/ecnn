// frontend/src/components/comments/CommentForm.jsx
import React, { useState } from 'react';
import api from '../../services/api';

const CommentForm = ({ articleSlug, parentCommentId = null, parentAuthorName = null, onCommentAdded, onCancel, isModal = false }) => {
  const [formData, setFormData] = useState({
    authorName: '',
    authorEmail: '',
    content: parentAuthorName ? `@${parentAuthorName} ` : ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const commentData = {
        articleSlug,
        authorName: formData.authorName.trim(),
        authorEmail: formData.authorEmail.trim(),
        content: formData.content.trim(),
        parentCommentId
      };

      console.log('Yorum gönderiliyor:', commentData);
      const response = await api.post('/comments', commentData);
      console.log('Yorum gönderme yanıtı:', response.data);
      
      setSuccess(response.data.message);
      
      // Formu temizle
      setFormData({ authorName: '', authorEmail: '', content: parentAuthorName ? `@${parentAuthorName} ` : '' });
      
      // Callback ile parent component'e bildir
      if (onCommentAdded) {
        onCommentAdded();
      }

      // 2 saniye sonra success mesajını temizle
      setTimeout(() => {
        setSuccess('');
      }, 3000);
      
      // Email'i localStorage'a kaydet (kendi yorumlarını silmek için)
      localStorage.setItem('userEmail', formData.authorEmail.trim());

    } catch (error) {
      console.error('Yorum gönderme hatası:', error);
      console.error('Hata detayları:', error.response?.data);
      setError(
        error.response?.data?.message || 
        'Yorum gönderilirken bir hata oluştu. Lütfen tekrar deneyin.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={isModal ? "" : "bg-white dark:bg-gray-900 rounded-2xl p-6"}>
      {!isModal && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {parentCommentId ? 'Yanıt Yaz' : 'Yorum Yap'}
          </h3>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
          <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
          <p className="text-sm text-green-600 dark:text-green-400 font-medium">{success}</p>
        </div>
      )}


      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              id="authorName"
              name="authorName"
              value={formData.authorName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl border border-gray-300/30 dark:border-gray-600/30 focus:outline-none dark:text-white"
              placeholder="Adınızı girin"
            />
          </div>

          <div>
            <input
              type="email"
              id="authorEmail"
              name="authorEmail"
              value={formData.authorEmail}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl border border-gray-300/30 dark:border-gray-600/30 focus:outline-none dark:text-white"
              placeholder="E-posta adresinizi girin"
            />
          </div>
        </div>

        <div>
          {parentAuthorName && (
            <div className="mb-2">
              <span className="text-xs text-red-500 font-medium">
                (Yanıt: @{parentAuthorName})
              </span>
            </div>
          )}
          <div className="relative">
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows={isModal ? 4 : 5}
              minLength={10}
              maxLength={1000}
              className="w-full px-4 py-3 pr-20 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-300/30 dark:border-gray-600/30 shadow-sm focus:outline-none dark:text-white resize-none"
              placeholder="Yorumunuzu yazın"
            />
            <div className="absolute bottom-2 right-2 flex items-center space-x-2">
              {formData.content.length < 10 && (
                <span className="text-xs text-red-500">
                  En az 10 karakter
                </span>
              )}
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {formData.content.length}/1000
              </span>
            </div>
          </div>
        </div>

        <div className={`flex ${isModal ? 'flex-col sm:flex-row' : 'justify-end'} space-y-3 sm:space-y-0 sm:space-x-4`}>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className={`px-6 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-full focus:outline-none ${isModal ? 'w-full sm:w-auto' : ''}`}
            >
              İptal
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting || formData.content.length < 10}
            className={`px-6 py-2 text-sm font-bold text-white dark:text-black bg-black dark:bg-white rounded-full focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${isModal ? 'w-full sm:w-auto' : ''}`}
          >
            {isSubmitting ? 'Gönderiliyor...' : (parentCommentId ? 'Yanıtla' : 'Yorum Yap')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentForm;
