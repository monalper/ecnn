// frontend/src/pages/admin/AdminCommentsPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminCommentsPage = () => {
  const [comments, setComments] = useState([]);
  const [pendingComments, setPendingComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'all'
  const [actionLoading, setActionLoading] = useState({});

  const fetchComments = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [allCommentsResponse, pendingCommentsResponse] = await Promise.all([
        api.get('/comments'),
        api.get('/comments/pending')
      ]);
      
      setComments(allCommentsResponse.data);
      setPendingComments(pendingCommentsResponse.data);
    } catch (err) {
      console.error("Yorumlar yüklenirken hata:", err.response?.data?.message || err.message);
      setError(err.response?.data?.message || 'Yorumlar yüklenemedi.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleToggleApproval = async (commentId, currentStatus) => {
    setActionLoading(prev => ({ ...prev, [commentId]: true }));
    
    try {
      await api.put(`/comments/${commentId}/approval`, {
        isApproved: !currentStatus
      });
      
      // Yorumları yeniden yükle
      await fetchComments();
    } catch (err) {
      console.error("Yorum onay durumu değiştirilirken hata:", err.response?.data?.message || err.message);
      setError(err.response?.data?.message || 'Yorum onay durumu değiştirilemedi.');
    } finally {
      setActionLoading(prev => ({ ...prev, [commentId]: false }));
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Bu yorumu silmek istediğinizden emin misiniz?')) {
      return;
    }

    setActionLoading(prev => ({ ...prev, [commentId]: true }));
    
    try {
      await api.delete(`/comments/${commentId}`);
      
      // Yorumları yeniden yükle
      await fetchComments();
    } catch (err) {
      console.error("Yorum silinirken hata:", err.response?.data?.message || err.message);
      setError(err.response?.data?.message || 'Yorum silinemedi.');
    } finally {
      setActionLoading(prev => ({ ...prev, [commentId]: false }));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('tr-TR');
  };

  const getStatusBadge = (isApproved, isAdmin) => {
    if (isAdmin) {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">Admin</span>;
    }
    return isApproved ? 
      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Onaylı</span> :
      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Bekliyor</span>;
  };

  const renderComment = (comment) => (
    <div key={comment.commentId} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h4 className="font-semibold text-gray-900 dark:text-white">{comment.authorName}</h4>
            {getStatusBadge(comment.isApproved, comment.isAdmin)}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{comment.authorEmail}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {formatDate(comment.createdAt)}
            {comment.parentCommentId && (
              <span className="ml-2 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded">Yanıt</span>
            )}
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => handleToggleApproval(comment.commentId, comment.isApproved)}
            disabled={actionLoading[comment.commentId]}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
              comment.isApproved 
                ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                : 'bg-green-100 text-green-800 hover:bg-green-200'
            } disabled:opacity-50`}
          >
            {actionLoading[comment.commentId] ? 'İşleniyor...' : (comment.isApproved ? 'Onayı Kaldır' : 'Onayla')}
          </button>
          <button
            onClick={() => handleDeleteComment(comment.commentId)}
            disabled={actionLoading[comment.commentId]}
            className="px-3 py-1 text-xs font-medium text-red-600 bg-red-100 hover:bg-red-200 rounded-lg transition-colors disabled:opacity-50"
          >
            Sil
          </button>
        </div>
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{comment.content}</p>
      </div>

      {comment.likeCount > 0 && (
        <div className="mt-3 flex items-center text-sm text-gray-500 dark:text-gray-400">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
          {comment.likeCount} beğeni
        </div>
      )}

      {comment.replyCount > 0 && (
        <div className="mt-3 flex items-center text-sm text-gray-500 dark:text-gray-400">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
          </svg>
          {comment.replyCount} yanıt
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <LoadingSpinner size="large" text="Yorumlar yükleniyor..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Yorum Yönetimi</h1>
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'pending' 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Onay Bekleyen ({pendingComments.length})
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'all' 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tüm Yorumlar ({comments.length})
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
            <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          {activeTab === 'pending' ? (
            pendingComments.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Onay bekleyen yorum yok</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Tüm yorumlar onaylanmış durumda.</p>
              </div>
            ) : (
              pendingComments.map(renderComment)
            )
          ) : (
            comments.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Henüz yorum yok</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">İlk yorumu siz yapın!</p>
              </div>
            ) : (
              comments.map(renderComment)
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCommentsPage;
