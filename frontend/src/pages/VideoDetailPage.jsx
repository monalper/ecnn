import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import { FaHeart, FaShare, FaLinkedinIn, FaRedditAlien } from 'react-icons/fa';
import CustomVideoPlayer from '../components/CustomVideoPlayer';
import VideoCard from '../components/VideoCard';
import LoadingSpinner from '../components/LoadingSpinner';
import VideoCommentsSection from '../components/video/VideoCommentsSection';
import api from '../services/api';
import thumbPlaceholder from '../assets/ThumbPlaceholder.png';
import SchemaMarkup from '../components/seo/SchemaMarkup';

const VideoDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLiking, setIsLiking] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    fetchVideo();
    fetchRelatedVideos();
  }, [id]);

  const fetchVideo = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/videos/${id}`);
      setVideo(response.data);
      
      // Video beğeni durumunu API'den al
      setIsLiked(response.data.hasLiked || false);
      setLikeCount(response.data.likeCount || 0);
    } catch (err) {
      console.error('Video yüklenirken hata:', err);
      setError('Video yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedVideos = async () => {
    try {
      const response = await api.get('/videos');
      // Mevcut videoyu hariç tut ve ilk 10 videoyu al
      const filtered = response.data.filter(v => v.id !== id).slice(0, 10);
      setRelatedVideos(filtered);
    } catch (err) {
      console.error('İlgili videolar yüklenirken hata:', err);
    }
  };

  const handleBackToVideos = () => {
    navigate('/videos');
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const handleCloseShareModal = () => {
    setShowShareModal(false);
  };

  const getVideoUrl = () => {
    return `https://openwall.com.tr/videos/${id}`;
  };

  const getShareText = () => {
    return `${video?.title}:\n${getVideoUrl()}`;
  };

  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const shareToPlatform = (platform) => {
    const url = getVideoUrl();
    const text = getShareText();
    
    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
        break;
      case 'telegram':
        window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(video?.title)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'reddit':
        window.open(`https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(video?.title)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(text);
        alert('Link kopyalandı!');
        break;
      default:
        break;
    }
    setShowShareModal(false);
  };

  const handleVideoLike = async () => {
    if (isLiking) return;
    
    setIsLiking(true);
    try {
      const action = isLiked ? 'unlike' : 'like';
      const response = await api.post(`/videos/${id}/like`, { action });
      
      // Backend'den gelen yanıtı kullan
      setIsLiked(response.data.hasLiked);
      setLikeCount(response.data.likeCount);
    } catch (error) {
      console.error('Video beğeni hatası:', error);
      // Show error message to user
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert('Video beğenirken bir hata oluştu. Lütfen tekrar deneyin.');
      }
    } finally {
      setIsLiking(false);
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // WhatsApp için video süresi formatı
  const formatDurationForWhatsApp = (seconds) => {
    if (!seconds) return '0:00';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.warn('Invalid date string:', dateString);
        return '';
      }
      
      const now = new Date();
      const diffTime = now.getTime() - date.getTime();
      const diffSeconds = Math.floor(diffTime / 1000);
      const diffMinutes = Math.floor(diffSeconds / 60);
      const diffHours = Math.floor(diffMinutes / 60);
      const diffDays = Math.floor(diffHours / 24);
      
      if (diffDays < 0) return '';
      if (diffDays === 0) {
        if (diffHours === 0) {
          if (diffMinutes === 0) {
            return `${diffSeconds} saniye önce`;
          }
          return `${diffMinutes} dakika önce`;
        }
        return `${diffHours} saat önce`;
      }
      if (diffDays === 1) return '1 gün önce';
      if (diffDays < 7) return `${diffDays} gün önce`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} hafta önce`;
      if (diffDays < 365) return `${Math.floor(diffDays / 30)} ay önce`;
      return `${Math.floor(diffDays / 365)} yıl önce`;
    } catch (error) {
      console.error('Date formatting error:', error, 'for dateString:', dateString);
      return '';
    }
  };

  const formatFullDate = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      
      if (isNaN(date.getTime())) {
        console.warn('Invalid date string:', dateString);
        return '';
      }
      
      const day = date.getDate();
      const month = date.getMonth();
      const year = date.getFullYear();
      
      const months = [
        'ocak', 'şubat', 'mart', 'nisan', 'mayıs', 'haziran',
        'temmuz', 'ağustos', 'eylül', 'ekim', 'kasım', 'aralık'
      ];
      
      return `${day} ${months[month]} ${year}`;
    } catch (error) {
      console.error('Full date formatting error:', error, 'for dateString:', dateString);
      return '';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="medium" text="Video yükleniyor..." />
        </div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Video bulunamadı
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {error || 'Aradığınız video mevcut değil.'}
          </p>
          <button
            onClick={handleBackToVideos}
            className="px-4 py-2 bg-brand-orange text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Videolara Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{video.title} - Openwall</title>
        <meta name="description" content={video.description || `OpenWall video: ${video.title}`} />
        
        {/* Open Graph Meta Tags - Facebook/WhatsApp için */}
        <meta property="og:title" content={`${video.title} - The Openwall`} />
        <meta property="og:description" content={video.description || 'To Ideas and <strong>Beyond</strong>.'} />
        <meta property="og:type" content="video" />
        <meta property="og:url" content={`https://www.openwall.com.tr/videos/${video.id}`} />
        <meta property="og:site_name" content="The Openwall" />
        <meta property="og:locale" content="tr_TR" />
        
        {/* Video özel meta etiketleri */}
        <meta property="og:video" content={video.videoUrl} />
        <meta property="og:video:type" content="video/mp4" />
        <meta property="og:video:width" content="1280" />
        <meta property="og:video:height" content="720" />
        <meta property="og:video:duration" content={video.duration || 0} />
        <meta property="og:video:url" content={video.videoUrl} />
        
        {/* Video oynatıcı URL'si */}
        <meta property="og:video:secure_url" content={video.videoUrl} />
        <meta property="og:video:tag" content="video" />
        <meta property="og:video:tag" content="Openwall" />
        
        {/* Video süresi meta etiketi */}
        {video.duration && (
          <meta property="og:video:duration" content={formatDurationForWhatsApp(video.duration)} />
        )}
        
        {/* Thumbnail için Open Graph */}
        {video.thumbnailUrl && (
          <>
            <meta property="og:image" content={video.thumbnailUrl} />
            <meta property="og:image:width" content="1280" />
            <meta property="og:image:height" content="720" />
            <meta property="og:image:type" content="image/jpeg" />
            <meta property="og:image:alt" content={video.title} />
          </>
        )}
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="player" />
        <meta name="twitter:site" content="@openwall" />
        <meta name="twitter:title" content={`${video.title} - The Openwall`} />
        <meta name="twitter:description" content={video.description || 'To Ideas and <strong>Beyond</strong>.'} />
        {video.thumbnailUrl && (
          <meta name="twitter:image" content={video.thumbnailUrl} />
        )}
        <meta name="twitter:player" content={`https://www.openwall.com.tr/videos/${video.id}`} />
        <meta name="twitter:player:width" content="1280" />
        <meta name="twitter:player:height" content="720" />
        
        {/* Ek meta etiketleri */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Openwall" />
        <meta name="keywords" content={`video, ${video.title}, Openwall`} />
        
        {/* Canonical URL */}
        <link rel="canonical" href={`https://www.openwall.com.tr/videos/${video.id}`} />
      </Helmet>

      {/* Schema.org VideoObject Markup */}
      <SchemaMarkup
        type="VideoObject"
        data={{
          title: video.title,
          description: video.description || `OpenWall video: ${video.title}`,
          thumbnailUrl: video.thumbnailUrl,
          videoUrl: video.videoUrl,
          embedUrl: `https://www.openwall.com.tr/videos/${video.id}`,
          uploadDate: video.createdAt,
          duration: video.duration
        }}
      />

      <div className="w-full px-0 py-4 lg:py-6">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* Main Content */}
          <div className="flex-1 lg:flex-[2]">
            {/* Video Player */}
            <div className="px-0 lg:px-6 mb-8">
              <div className="bg-black overflow-hidden shadow-lg w-full lg:rounded-lg">
                <CustomVideoPlayer
                  src={video.videoUrl}
                  poster={video.thumbnailUrl || thumbPlaceholder}
                  title={video.title}
                  subtitles={video.subtitles || []}
                  autoPlay={true}
                />
              </div>
            </div>

            {/* Video Information */}
            <div className="px-4 lg:px-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
                  {video.title}
                </h1>
                
                {/* Video Actions */}
                <div className="flex items-center space-x-3">
                  {/* Video Like Button */}
                  <button
                    onClick={handleVideoLike}
                    disabled={isLiking}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full font-semibold text-sm transition-colors ${
                      isLiked
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    <svg 
                      className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                      />
                    </svg>
                    <span>{likeCount}</span>
                  </button>

                  {/* Video Share Button */}
                  <button
                    onClick={handleShare}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full font-semibold text-sm transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                    <span>Paylaş</span>
                  </button>
                </div>
              </div>

              {/* Description */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                {video.createdAt && (
                  <p className="text-sm text-gray-700 dark:text-gray-300 font-medium mb-2">
                    {video.createdByUsername && (
                      <span>
                        {video.createdByUsername}
                      </span>
                    )}
                    {video.createdByUsername && <span> · </span>}
                    {formatFullDate(video.createdAt)}
                    {(video.subtitles && video.subtitles.length > 0) || video.subtitleUrl ? (
                      <span> · <span>Altyazılı</span></span>
                    ) : null}
                  </p>
                )}
                {video.description && (
                  <>
                    <div className={`text-gray-700 dark:text-gray-300 leading-relaxed text-sm lg:text-base ${!showFullDescription && 'line-clamp-3'}`}>
                      {video.description}
                    </div>
                    {video.description.length > 200 && (
                      <button
                        onClick={() => setShowFullDescription(!showFullDescription)}
                        className="text-brand-orange hover:text-orange-600 font-medium mt-2 transition-colors text-sm"
                      >
                        {showFullDescription ? 'Daha az göster' : 'Daha fazla göster'}
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Comments Section */}
            <div className="mt-8">
              <VideoCommentsSection videoId={video.id} />
            </div>
          </div>

          {/* Sidebar - Related Videos */}
          <div className="lg:w-96 lg:flex-[1] mt-6 lg:mt-0">
            <div className="px-4 lg:px-0">
              <div className="space-y-4">
                {relatedVideos.map((relatedVideo) => (
                  <VideoCard
                    key={relatedVideo.id}
                    video={relatedVideo}
                    layout="horizontal"
                    showDuration={true}
                    showUploadTime={true}
                  />
                ))}
              </div>
              
              {relatedVideos.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <svg className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
                  </svg>
                  <p>Henüz daha fazla video yok.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-md w-full shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Paylaş
              </h3>
              <button
                onClick={handleCloseShareModal}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Message Preview */}
            <div className="mb-6">
              {/* Background Container */}
              <div className="rounded-2xl p-3 sm:p-4" style={{ backgroundColor: '#161717' }}>
                {/* Simple Message Bubble */}
                <div className="text-white p-2 sm:p-3 rounded-xl max-w-[90%] sm:max-w-[85%] ml-auto" style={{ backgroundColor: '#144D37' }}>
                  <div className="text-xs sm:text-sm mb-1">
                    <div className="font-bold text-white break-words">
                      {video?.title}:
                    </div>
                    <div className="text-white break-all text-xs">
                      {getVideoUrl()}
                    </div>
                  </div>
                  <div className="flex justify-end items-center text-xs text-white text-opacity-75 mt-1">
                    <span>{getCurrentTime()} </span>
                    <div className="flex items-center ml-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 512 512">
                        <path d="M504.502 75.496c-9.997-9.998-26.205-9.998-36.204 0L161.594 382.203 43.702 264.311c-9.997-9.998-26.205-9.997-36.204 0s-9.998 26.205 0 36.203l135.994 135.992c9.994 9.997 26.214 9.99 36.204-.001L504.502 111.7c9.998-9.997 9.998-26.206.001-36.204z"/>
                      </svg>
                      <svg className="w-3 h-3 -ml-2" fill="currentColor" viewBox="0 0 512 512">
                        <path d="M504.502 75.496c-9.997-9.998-26.205-9.998-36.204 0L161.594 382.203 43.702 264.311c-9.997-9.998-26.205-9.997-36.204 0s-9.998 26.205 0 36.203l135.994 135.992c9.994 9.997 26.214 9.99 36.204-.001L504.502 111.7c9.998-9.997 9.998-26.206.001-36.204z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Share Platforms */}
            <div className="grid grid-cols-3 gap-3">
              {/* WhatsApp */}
              <button
                onClick={() => shareToPlatform('whatsapp')}
                className="flex items-center justify-center p-3 bg-green-500 hover:bg-green-600 rounded-full transition-colors"
              >
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.214-.361a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
              </button>

              {/* Telegram */}
              <button
                onClick={() => shareToPlatform('telegram')}
                className="flex items-center justify-center p-3 bg-blue-500 hover:bg-blue-600 rounded-full transition-colors"
              >
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </button>

              {/* X (Twitter) */}
              <button
                onClick={() => shareToPlatform('twitter')}
                className="flex items-center justify-center p-3 bg-black hover:bg-gray-800 rounded-full transition-colors"
              >
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </button>

              {/* Facebook */}
              <button
                onClick={() => shareToPlatform('facebook')}
                className="flex items-center justify-center p-3 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors"
              >
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>

              {/* LinkedIn */}
              <button
                onClick={() => shareToPlatform('linkedin')}
                className="flex items-center justify-center p-3 bg-blue-700 hover:bg-blue-800 rounded-full transition-colors"
              >
                <FaLinkedinIn className="w-6 h-6 text-white" />
              </button>

              {/* Reddit */}
              <button
                onClick={() => shareToPlatform('reddit')}
                className="flex items-center justify-center p-3 bg-orange-500 hover:bg-orange-600 rounded-full transition-colors"
              >
                <FaRedditAlien className="w-6 h-6 text-white" />
              </button>

              {/* Copy Link */}
              <button
                onClick={() => shareToPlatform('copy')}
                className="flex items-center justify-center p-3 rounded-full transition-colors"
                style={{
                  backgroundColor: '#ffffff',
                  border: 'none'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#ffffff'}
              >
                <svg 
                  className="w-6 h-6" 
                  fill="none" 
                  stroke="#000000" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VideoDetailPage; 