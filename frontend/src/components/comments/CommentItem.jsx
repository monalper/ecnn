// frontend/src/components/comments/CommentItem.jsx
import React, { useState } from 'react';
import { FaHeart, FaStar } from 'react-icons/fa';
import CommentForm from './CommentForm';
import PendingCommentWarning from './PendingCommentWarning';
import api from '../../services/api';

const CommentItem = ({ comment, onCommentAdded, isReply = false, currentUserEmail = null, currentUser = null }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.likeCount || 0);
  const [hasLiked, setHasLiked] = useState(false); // Bu gerçek uygulamada localStorage'dan alınabilir
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleLike = async () => {
    if (isLiking) return;
    
    setIsLiking(true);
    try {
      const action = hasLiked ? 'unlike' : 'like';
      const response = await api.post(`/comments/${comment.commentId}/like`, { action });
      
      setLikeCount(response.data.likeCount);
      setHasLiked(!hasLiked);
    } catch (error) {
      console.error('Beğeni hatası:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleReplyAdded = () => {
    setShowReplyForm(false);
    if (onCommentAdded) {
      onCommentAdded();
    }
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    
    setIsDeleting(true);
    try {
      await api.delete(`/comments/${comment.commentId}`);
      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (error) {
      console.error('Yorum silme hatası:', error);
      alert('Yorum silinirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  // Yorumun kendi yorumumuz olup olmadığını kontrol et
  const isOwnComment = currentUserEmail && comment.authorEmail === currentUserEmail;
  
  // Admin kontrolü - admin ise tüm yorumları silebilir
  const isAdmin = currentUser && currentUser.isAdmin;
  const canDelete = isOwnComment || isAdmin;

  // @username etiketlerini kırmızı renkte göster
  const renderCommentContent = (content) => {
    // @username pattern'ini bul ve kırmızı renkte göster
    const parts = content.split(/(@\w+)/g);
    return parts.map((part, index) => {
      if (part.startsWith('@')) {
        return (
          <span key={index} className="text-red-500 font-semibold">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className={`${isReply ? 'ml-4 sm:ml-6 lg:ml-8 mt-4 sm:mt-6' : ''} mb-4 sm:mb-6`}>
      <div className="flex items-start space-x-3 sm:space-x-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-semibold shadow-lg">
            {comment.authorName.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Comment Content */}
        <div className="flex-1 min-w-0 overflow-hidden">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 mb-2">
              <div className="flex items-center space-x-2">
                <h4 className="text-[15px] font-semibold text-gray-900 dark:text-white">
                  {comment.authorName}
                </h4>
                {comment.isAdmin && (
                  <div className="w-4 h-4 sm:w-5 sm:h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <FaStar className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white fill-current" />
                  </div>
                )}
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {formatDate(comment.createdAt)}
              </span>
            </div>

            {!comment.isApproved ? (
              <PendingCommentWarning />
            ) : (
              <p className="text-[15px] text-gray-700 dark:text-gray-300 mb-3 whitespace-pre-wrap leading-relaxed break-words overflow-wrap-anywhere">
                {renderCommentContent(comment.content)}
              </p>
            )}

            {/* Actions */}
            <div className="flex items-center space-x-4 sm:space-x-6">
              {comment.isApproved ? (
                <>
                  <button
                    onClick={handleLike}
                    disabled={isLiking}
                    className={`flex items-center space-x-1.5 sm:space-x-2 text-xs sm:text-sm font-medium ${
                      hasLiked 
                        ? 'text-red-500 dark:text-red-400' 
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    <FaHeart 
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                        hasLiked ? 'fill-current' : ''
                      }`} 
                    />
                    <span className="font-bold">{likeCount}</span>
                  </button>

                  {!isReply && (
                    <button
                      onClick={() => setShowReplyForm(!showReplyForm)}
                      className="text-xs sm:text-sm font-bold text-gray-500 dark:text-gray-400"
                    >
                      Yanıtla
                    </button>
                  )}

                  {canDelete && (
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      disabled={isDeleting}
                      className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 disabled:opacity-50"
                    >
                      {isDeleting ? 'Siliniyor...' : 'Sil'}
                    </button>
                  )}
                </>
              ) : null}
            </div>
          </div>

          {/* Reply Form */}
          {showReplyForm && !isReply && comment.isApproved && (
            <div className="mt-4">
              <CommentForm
                articleSlug={comment.articleSlug}
                parentCommentId={comment.commentId}
                parentAuthorName={comment.authorName}
                onCommentAdded={handleReplyAdded}
                onCancel={() => setShowReplyForm(false)}
              />
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 max-w-md w-full shadow-xl">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
                  Yorumu Sil
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">
                  {isAdmin && !isOwnComment 
                    ? `Admin olarak ${comment.authorName} kullanıcısının yorumunu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`
                    : 'Bu yorumu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.'
                  }
                </p>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 px-4 py-2.5 sm:py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    İptal
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="flex-1 px-4 py-2.5 sm:py-2 text-sm font-medium text-white bg-red-500 rounded-xl hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isDeleting ? 'Siliniyor...' : 'Sil'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3 sm:mt-4 space-y-3 sm:space-y-4">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.commentId}
                  comment={reply}
                  onCommentAdded={onCommentAdded}
                  isReply={true}
                  currentUserEmail={currentUserEmail}
                  currentUser={currentUser}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
