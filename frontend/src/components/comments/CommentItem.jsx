// frontend/src/components/comments/CommentItem.jsx
import React, { useState } from 'react';
import { FaHeart, FaStar } from 'react-icons/fa';
import CommentForm from './CommentForm';
import PendingCommentWarning from './PendingCommentWarning';
import CommentArticleCard from './CommentArticleCard';
import { processCommentContent, convertMarkdownToHtml } from '../../utils/commentUtils';
import api from '../../services/api';

const CommentItem = ({ comment, onCommentAdded, isReply = false, currentUserEmail = null, currentUser = null }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.likeCount || 0);
  const [hasLiked, setHasLiked] = useState(comment.hasLiked || false);
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
      setHasLiked(response.data.hasLiked);
    } catch (error) {
      console.error('Beğeni hatası:', error);
      // Show error message to user
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      }
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
  const userEmail = currentUserEmail || (currentUser && currentUser.email);
  const normalizedUserEmail = userEmail ? userEmail.toLowerCase().trim() : null;
  const normalizedAuthorEmail = comment.authorEmail ? comment.authorEmail.toLowerCase().trim() : null;
  
  // Alternatif kontrol: userId ile de kontrol et
  const isOwnCommentByEmail = normalizedUserEmail && normalizedAuthorEmail && normalizedUserEmail === normalizedAuthorEmail;
  const isOwnCommentByUserId = currentUser && comment.authorUserId && currentUser.userId === comment.authorUserId;
  const isOwnComment = isOwnCommentByEmail || isOwnCommentByUserId;
  
  // Admin kontrolü - admin ise tüm yorumları silebilir
  const isAdmin = currentUser && currentUser.isAdmin;
  const canDelete = isOwnComment || isAdmin;




  // Yorum içeriğini işle ve makale linklerini ayır
  const processedContent = processCommentContent(comment.content);
  
  // Yorum içeriğini render et - @username ve external linkleri işle
  const renderCommentContent = (content, externalLinks = []) => {
    if (!content) return null;
    
    let processedContent = content;
    
    // External linkleri placeholder ile değiştir
    const linkPlaceholders = [];
    externalLinks.forEach((link, index) => {
      const placeholder = `__EXTERNAL_LINK_${index}__`;
      linkPlaceholders.push({ placeholder, link });
      processedContent = processedContent.replace(link.originalUrl, placeholder);
    });
    
    // @username ve external link pattern'lerini bul
    const parts = processedContent.split(/(@\w+|__EXTERNAL_LINK_\d+__)/g);
    
    return parts.map((part, index) => {
      // @username pattern'ini kırmızı renkte göster
      if (part.startsWith('@')) {
        return (
          <span key={index} className="text-blue-400 font-semibold">
            {part}
          </span>
        );
      }
      
      // External link placeholder'larını mavi link olarak göster
      if (part.startsWith('__EXTERNAL_LINK_') && part.endsWith('__')) {
        const linkPlaceholder = linkPlaceholders.find(lp => part === lp.placeholder);
        if (linkPlaceholder) {
          return (
            <a
              key={index}
              href={linkPlaceholder.link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 break-all"
            >
              {linkPlaceholder.link.originalUrl}
            </a>
          );
        }
      }
      
      // Normal metin
      return part;
    });
  };

  return (
    <div className={`${isReply ? 'ml-4 sm:ml-6 lg:ml-8 mt-4 sm:mt-6' : ''} mb-4 sm:mb-6`}>
      <div className="flex items-start space-x-3 sm:space-x-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden shadow-lg">
            <img
              src={comment.authorAvatarUrl || (comment.isAdmin ? "/APP.png" : "/UPP.png")}
              alt={`${comment.authorName} profil fotoğrafı`}
              className="w-full h-full object-cover"
              onError={(e) => {
                // If the avatar URL fails to load, fall back to placeholder
                e.target.src = comment.isAdmin ? "/APP.png" : "/UPP.png";
              }}
            />
          </div>
        </div>

        {/* Comment Content */}
        <div className="flex-1 min-w-0 overflow-hidden">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 mb-2">
              <div className="flex items-center space-x-2">
                <h4 className="text-[15px] font-semibold text-gray-900 dark:text-white">
                  {comment.authorName || comment.authorUsername ? (
                    <>
                      {comment.authorName || comment.authorUsername} <span className="text-gray-500 dark:text-gray-400 font-normal">@{comment.authorUsername || comment.authorName || 'kullanici'}</span>
                    </>
                  ) : (
                    <span className="text-gray-500 dark:text-gray-400 font-normal">@kullanici</span>
                  )}
                </h4>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {formatDate(comment.createdAt)}
              </span>
            </div>

            {!comment.isApproved ? (
              <PendingCommentWarning />
            ) : (
              <>
                {/* Yorum içeriği - her zaman göster */}
                <div className="text-[15px] text-gray-700 dark:text-gray-300 mb-3 leading-relaxed break-words overflow-wrap-anywhere">
                  {processedContent.hasGifs ? (
                    <div 
                      dangerouslySetInnerHTML={{ 
                        __html: convertMarkdownToHtml(processedContent.cleanContent)
                      }} 
                    />
                  ) : (
                    <p className="whitespace-pre-wrap">
                      {renderCommentContent(processedContent.cleanContent, processedContent.externalLinks)}
                    </p>
                  )}
                </div>
                
                {/* Makale kartları */}
                {processedContent.hasArticleLinks && (
                  <div className="mb-3">
                    {processedContent.articleLinks.map((link, index) => (
                      <CommentArticleCard 
                        key={`${link.slug}-${index}`} 
                        articleSlug={link.slug} 
                      />
                    ))}
                  </div>
                )}
              </>
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
                parentAuthorName={comment.authorUsername || comment.authorName}
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
                    className="flex-1 px-4 py-2.5 sm:py-2 text-sm font-medium text-white bg-blue-500 rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
