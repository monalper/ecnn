import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import CustomVideoPlayer from '../components/CustomVideoPlayer';
import VideoCard from '../components/VideoCard';
import LoadingSpinner from '../components/LoadingSpinner';
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
        <title>{video.title} - OpenWall</title>
        <meta name="description" content={video.description || `OpenWall video: ${video.title}`} />
        
        {/* Open Graph Meta Tags - Facebook/WhatsApp için */}
        <meta property="og:title" content={video.title} />
        <meta property="og:description" content={video.description || `OpenWall video: ${video.title}`} />
        <meta property="og:type" content="video" />
        <meta property="og:url" content={`https://www.openwall.com.tr/videos/${video.id}`} />
        <meta property="og:site_name" content="OpenWall" />
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
        <meta property="og:video:tag" content="OpenWall" />
        
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
        <meta name="twitter:title" content={video.title} />
        <meta name="twitter:description" content={video.description || `OpenWall video: ${video.title}`} />
        {video.thumbnailUrl && (
          <meta name="twitter:image" content={video.thumbnailUrl} />
        )}
        <meta name="twitter:player" content={`https://www.openwall.com.tr/videos/${video.id}`} />
        <meta name="twitter:player:width" content="1280" />
        <meta name="twitter:player:height" content="720" />
        
        {/* Ek meta etiketleri */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content="OpenWall" />
        <meta name="keywords" content={`video, ${video.title}, OpenWall`} />
        
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
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-6">
                {video.title}
              </h1>

              {/* Description */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                {video.createdAt && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 opacity-50 mb-2">
                    {formatFullDate(video.createdAt)}
                    {(video.subtitles && video.subtitles.length > 0) || video.subtitleUrl ? (
                      <span> · <span className="text-gray-500 dark:text-gray-400 opacity-100">Altyazılı</span></span>
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
    </>
  );
};

export default VideoDetailPage; 