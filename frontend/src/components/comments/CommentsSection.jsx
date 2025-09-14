// frontend/src/components/comments/CommentsSection.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';
import LoadingSpinner from '../LoadingSpinner';
import api from '../../services/api';

const CommentsSection = ({ articleSlug }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUserEmail, setCurrentUserEmail] = useState(null);

  const fetchComments = async () => {
    try {
      setLoading(true);
      console.log('Yorumlar yükleniyor, articleSlug:', articleSlug);
      const response = await api.get(`/comments/article/${articleSlug}`);
      console.log('Yorumlar API yanıtı:', response.data);
      setComments(response.data);
      setError('');
    } catch (error) {
      console.error('Yorumlar yüklenirken hata:', error);
      console.error('Hata detayları:', error.response?.data);
      setError('Yorumlar yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (articleSlug) {
      fetchComments();
    }
    // localStorage'dan kullanıcı email'ini al
    const savedEmail = localStorage.getItem('userEmail');
    if (savedEmail) {
      setCurrentUserEmail(savedEmail);
    }
  }, [articleSlug]);

  const handleCommentAdded = () => {
    // Yorum eklendikten sonra listeyi yenile
    fetchComments();
  };


  if (loading) {
    return (
      <div className="py-8">
        <div className="text-center">
          <LoadingSpinner size="small" text="Yorumlar yükleniyor..." />
        </div>
      </div>
    );
  }

  return (
    <section className="py-4 sm:py-6 lg:py-8 overflow-hidden">
      <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-8 overflow-hidden">
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
            Yorumlar
          </h2>
        </div>

        {error && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl sm:rounded-2xl">
            <p className="text-xs sm:text-sm text-red-600 dark:text-red-400 font-medium text-center">{error}</p>
          </div>
        )}

        {/* Direct Comment Input - YouTube Style */}
        <div className="mb-6 sm:mb-8">
          <CommentForm
            articleSlug={articleSlug}
            onCommentAdded={handleCommentAdded}
          />
        </div>

        {/* Comments List */}
        {comments.length === 0 ? (
          <div className="text-center py-6 sm:py-8 lg:py-12">
            <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <svg className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
              Henüz yorum yok
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 px-2 sm:px-4">
              İlk yorumu siz yapın ve tartışmayı başlatın!
            </p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4 lg:space-y-6 overflow-hidden">
            {comments.map((comment) => (
              <CommentItem
                key={comment.commentId}
                comment={comment}
                onCommentAdded={handleCommentAdded}
                currentUserEmail={currentUserEmail}
                currentUser={user}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default CommentsSection;
