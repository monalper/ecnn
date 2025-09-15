// frontend/src/components/comments/CommentForm.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import GifSearchModal from '../GifSearchModal';
import EmojiPicker from '../EmojiPicker';
import { PiGifFill } from 'react-icons/pi';
import { HiOutlineEmojiHappy } from 'react-icons/hi';

const CommentForm = ({ articleSlug, parentCommentId = null, parentAuthorName = null, onCommentAdded, onCancel, isModal = false }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    content: parentAuthorName ? `@${parentAuthorName} ` : ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showGifModal, setShowGifModal] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGifSelect = (gif) => {
    const gifUrl = gif.images.fixed_height.webp || gif.images.fixed_height.url;
    const gifMarkdown = `![GIF](${gifUrl})`;
    
    setFormData(prev => ({
      ...prev,
      content: prev.content + (prev.content ? ' ' : '') + gifMarkdown
    }));
  };

  const handleEmojiSelect = (emoji) => {
    setFormData(prev => ({
      ...prev,
      content: prev.content + emoji
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
        content: formData.content.trim(),
        parentCommentId
      };

      console.log('Yorum gönderiliyor:', commentData);
      const response = await api.post('/comments', commentData);
      console.log('Yorum gönderme yanıtı:', response.data);
      
      setSuccess(response.data.message);
      
      // Formu temizle
      setFormData({ content: parentAuthorName ? `@${parentAuthorName} ` : '' });
      
      // Callback ile parent component'e bildir
      if (onCommentAdded) {
        onCommentAdded();
      }

      // 2 saniye sonra success mesajını temizle
      setTimeout(() => {
        setSuccess('');
      }, 3000);

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

  // If user is not authenticated, show login prompt
  if (!user) {
    return (
      <div className={isModal ? "" : "bg-white dark:bg-gray-900 rounded-2xl p-6"}>
        {!isModal && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {parentCommentId ? 'Yanıt Yaz' : 'Yorum Yap'}
            </h3>
          </div>
        )}
        
        <div className="text-center py-8">
          <div className="mb-4">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
            Yorum yapabilmek için giriş yapın
          </h3>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/login"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Giriş Yap
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-orange dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              Hesap Oluştur
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // YouTube-style comment form for logged-in users
  return (
    <div className={isModal ? "" : ""}>
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
          <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
          <p className="text-sm text-green-600 dark:text-green-400 font-medium">{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-start space-x-3">
          {/* User Avatar */}
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <img
                src={user.avatarUrl || (user.isAdmin ? "/APP.png" : "/UPP.png")}
                alt={`${user.name || user.username} profil fotoğrafı`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // If the avatar URL fails to load, fall back to placeholder
                  e.target.src = user.isAdmin ? "/APP.png" : "/UPP.png";
                }}
              />
            </div>
          </div>

          {/* Comment Input */}
          <div className="flex-1">
            {parentAuthorName && (
              <div className="mb-2">
                <span className="text-xs text-red-500 font-medium">
                  Yanıt: @{parentAuthorName}
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
                rows={4}
                maxLength={1000}
                className="w-full px-4 py-4 pr-20 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-300/30 dark:border-gray-600/30 shadow-sm focus:outline-none dark:text-white resize-none"
                placeholder="Yorumunuzu yazın..."
              />
              <div className="absolute bottom-3 right-3">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formData.content.length}/1000
                </span>
              </div>
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
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => setShowEmojiPicker(true)}
              className="p-2 text-gray-500 hover:text-yellow-500 dark:text-gray-400 dark:hover:text-yellow-400 transition-colors rounded-full"
              style={{ backgroundColor: '#2A2A2A' }}
              title="Emoji Ekle"
            >
              <HiOutlineEmojiHappy className="w-5 h-5" />
            </button>
            
            <button
              type="button"
              onClick={() => setShowGifModal(true)}
              className="p-2 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors rounded-full"
              style={{ backgroundColor: '#2A2A2A' }}
              title="GIF Ekle"
            >
              <PiGifFill className="w-5 h-5" />
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2 text-sm font-bold text-white dark:text-black bg-black dark:bg-white rounded-full focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${isModal ? 'w-full sm:w-auto' : ''}`}
            >
              {isSubmitting ? 'Gönderiliyor...' : (parentCommentId ? 'Yanıtla' : 'Yorum Yap')}
            </button>
          </div>
        </div>
      </form>

      {/* GIF Search Modal */}
      <GifSearchModal
        isOpen={showGifModal}
        onClose={() => setShowGifModal(false)}
        onSelectGif={handleGifSelect}
      />
      
      <EmojiPicker
        isOpen={showEmojiPicker}
        onClose={() => setShowEmojiPicker(false)}
        onSelectEmoji={handleEmojiSelect}
      />
    </div>
  );
};

export default CommentForm;
