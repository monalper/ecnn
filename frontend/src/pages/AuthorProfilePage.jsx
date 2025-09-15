import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FaUser, FaCalendarAlt, FaNewspaper, FaVideo, FaHeart, FaEye, FaUsers } from 'react-icons/fa';
import LoadingSpinner from '../components/LoadingSpinner';
import VideoCard from '../components/VideoCard';
import ArticleCard from '../components/article/ArticleCard';
import api from '../services/api';

const AuthorProfilePage = () => {
  const { nickname } = useParams();
  const navigate = useNavigate();
  const [author, setAuthor] = useState(null);
  const [articles, setArticles] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAuthorData();
  }, [nickname]);

  const fetchAuthorData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch author profile first
      const authorResponse = await api.get(`/users/${nickname}`);
      const authorData = authorResponse.data;
      setAuthor(authorData);
      
      // Fetch author's articles and videos using the author data
      const [articlesResponse, videosResponse] = await Promise.all([
        api.get(`/articles?author=${authorData.name || authorData.username}`).catch(() => ({ data: [] })),
        api.get(`/videos?author=${authorData.username}`).catch(() => ({ data: [] }))
      ]);
      
      setArticles(articlesResponse.data || []);
      setVideos(videosResponse.data || []);
      
    } catch (err) {
      console.error('Author data fetch error:', err);
      if (err.response?.status === 404) {
        setError('Yazar bulunamadı');
      } else {
        setError('Yazar bilgileri yüklenirken bir hata oluştu');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="medium" text="Yazar profili yükleniyor..." />
        </div>
      </div>
    );
  }

  if (error || !author) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">👤</div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            {error || 'Yazar bulunamadı'}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Aradığınız yazar mevcut değil veya hesabı kaldırılmış olabilir.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-brand-orange text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{author.name || author.username} - OpenWall Yazar Profili</title>
        <meta name="description" content={`${author.name || author.username} yazarının OpenWall'daki profili, makaleleri ve videoları`} />
        <meta property="og:title" content={`${author.name || author.username} - OpenWall Yazar`} />
        <meta property="og:description" content={`${author.name || author.username} yazarının OpenWall'daki profili, makaleleri ve videoları`} />
        {author.avatarUrl && (
          <meta property="og:image" content={author.avatarUrl} />
        )}
        <meta property="og:type" content="profile" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={`${author.name || author.username} - OpenWall Yazar`} />
        <meta name="twitter:description" content={`${author.name || author.username} yazarının OpenWall'daki profili, makaleleri ve videoları`} />
        {author.avatarUrl && (
          <meta name="twitter:image" content={author.avatarUrl} />
        )}
      </Helmet>

      <div>
        {/* Hero Section - Mobile Only */}
        <div className="bg-white dark:bg-gray-800 shadow-sm lg:hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden shadow-lg">
                  <img
                    src={author.avatarUrl || "/APP.png"}
                    alt={`${author.name || author.username} profil fotoğrafı`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "/APP.png";
                    }}
                  />
                </div>
              </div>

              {/* Author Info */}
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  {author.name || author.username}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                  @{author.username}
                </p>
                
                {author.bio && (
                  <p className="text-gray-700 dark:text-gray-300 mb-4 max-w-2xl">
                    {author.bio}
                  </p>
                )}

                <div className="flex flex-wrap items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <FaCalendarAlt className="w-4 h-4" />
                    <span>Katılım: {formatDate(author.createdAt)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FaNewspaper className="w-4 h-4" />
                    <span>{formatNumber(author.logCount || 0)} makale</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FaVideo className="w-4 h-4" />
                    <span>{formatNumber(author.reviewCount || 0)} video</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Responsive Layout */}
        <div className="relative">
          {/* Desktop: Fixed Sidebar */}
          <div className="hidden lg:block fixed left-0 top-0 bottom-0 w-80 z-10">
            <div className="h-full bg-white dark:bg-gray-800 shadow-lg overflow-y-auto">
              <div className="p-6">
                {/* Author Profile Info */}
                <div className="text-center mb-6">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden shadow-lg">
                    <img
                      src={author.avatarUrl || "/APP.png"}
                      alt={`${author.name || author.username} profil fotoğrafı`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "/APP.png";
                      }}
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                    {author.name || author.username}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    @{author.username}
                  </p>
                </div>

                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  İstatistikler
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FaNewspaper className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">Makale</span>
                    </div>
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      {formatNumber(author.logCount || 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FaVideo className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">Video</span>
                    </div>
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      {formatNumber(author.reviewCount || 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FaUsers className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">Takipçi</span>
                    </div>
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      {formatNumber(author.followerCount || 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FaHeart className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">Takip</span>
                    </div>
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      {formatNumber(author.followingCount || 0)}
                    </span>
                  </div>
                </div>
                
                {/* Author Bio in sidebar */}
                {author.bio && (
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Hakkında
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {author.bio}
                    </p>
                  </div>
                )}
                
                {/* Join Date */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                    <FaCalendarAlt className="w-4 h-4" />
                    <span>Katılım: {formatDate(author.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Stats */}
          <div className="block lg:hidden px-4 sm:px-6 py-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-sm">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatNumber(author.logCount || 0)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Makale</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-sm">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatNumber(author.reviewCount || 0)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Video</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-sm">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatNumber(author.followerCount || 0)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Takipçi</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-sm">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatNumber(author.followingCount || 0)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Takip</div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:ml-80">
            <div className="px-4 sm:px-6 lg:px-8 py-6 md:py-8 lg:py-12">
              <div className="max-w-4xl mx-auto">
                <div className="space-y-12">
                  {/* Articles */}
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                      <FaNewspaper className="w-5 h-5 mr-2" />
                      Makaleler ({articles.length})
                    </h2>
                    {articles.length > 0 ? (
                      <div className="flex gap-4 overflow-x-auto pb-4">
                        {articles.slice(0, 6).map((article) => (
                          <div key={article.slug} className="flex-shrink-0 w-80">
                            <ArticleCard article={article} />
                          </div>
                        ))}
                        {articles.length > 6 && (
                          <div className="flex-shrink-0 flex items-center">
                            <button className="text-brand-orange hover:text-orange-600 font-medium whitespace-nowrap">
                              Tüm makaleleri gör ({articles.length})
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center">
                        <FaNewspaper className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-500 dark:text-gray-400">Henüz makale yayınlanmamış</p>
                      </div>
                    )}
                  </div>

                  {/* Videos */}
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                      <FaVideo className="w-5 h-5 mr-2" />
                      Videolar ({videos.length})
                    </h2>
                    {videos.length > 0 ? (
                      <div className="flex gap-4 overflow-x-auto pb-4">
                        {videos.slice(0, 6).map((video) => (
                          <div key={video.id} className="flex-shrink-0 w-80">
                            <VideoCard 
                              video={video} 
                              layout="vertical"
                              showDuration={true}
                              showUploadTime={true}
                            />
                          </div>
                        ))}
                        {videos.length > 6 && (
                          <div className="flex-shrink-0 flex items-center">
                            <button className="text-brand-orange hover:text-orange-600 font-medium whitespace-nowrap">
                              Tüm videoları gör ({videos.length})
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center">
                        <FaVideo className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-500 dark:text-gray-400">Henüz video yayınlanmamış</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthorProfilePage;
