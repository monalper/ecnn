import React, { useState } from 'react';
import VideoDetailCard from './VideoDetailCard';

const VideoDetailDemo = () => {
  const [likeCount, setLikeCount] = useState(0);
  const [shareCount, setShareCount] = useState(0);

  const handleLike = (isLiked) => {
    if (isLiked) {
      setLikeCount(prev => prev + 1);
    } else {
      setLikeCount(prev => Math.max(0, prev - 1));
    }
  };

  const handleShare = () => {
    setShareCount(prev => prev + 1);
    console.log('Paylaşım yapıldı!');
  };

  return (
    <div className="min-h-screen bg-dark-primary p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          Video Detay Sayfası Demo
        </h1>
        
        {/* Ana video detay kartı */}
        <div className="mb-8">
          <VideoDetailCard
            title="Avrupa Yakası"
            source="Openwall"
            date="bugün"
            episode="48. Bölüm"
            onLike={handleLike}
            onShare={handleShare}
            isLiked={false}
            likeCount={likeCount}
            shareCount={shareCount}
          />
        </div>

        {/* İstatistikler */}
        <div className="bg-dark-secondary rounded-lg p-6 mb-8 border border-gray-700/50">
          <h2 className="text-xl font-semibold text-white mb-4">İstatistikler</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-800/30 rounded-lg">
              <div className="text-2xl font-bold text-red-400">{likeCount}</div>
              <div className="text-gray-300">Beğeni</div>
            </div>
            <div className="text-center p-4 bg-gray-800/30 rounded-lg">
              <div className="text-2xl font-bold text-blue-400">{shareCount}</div>
              <div className="text-gray-300">Paylaşım</div>
            </div>
          </div>
        </div>

        {/* Farklı varyasyonlar */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-white mb-4">Farklı Varyasyonlar</h2>
          
          {/* Beğenilmiş durum */}
          <div>
            <h3 className="text-lg font-medium text-gray-300 mb-3">Beğenilmiş Durum</h3>
            <VideoDetailCard
              title="Kurtlar Vadisi"
              source="Netflix"
              date="dün"
              episode="15. Bölüm"
              isLiked={true}
              likeCount={42}
              shareCount={8}
            />
          </div>

          {/* Farklı başlık */}
          <div>
            <h3 className="text-lg font-medium text-gray-300 mb-3">Farklı İçerik</h3>
            <VideoDetailCard
              title="Breaking Bad"
              source="AMC"
              date="bu hafta"
              episode="5. Sezon - 16. Bölüm"
              likeCount={156}
              shareCount={23}
            />
          </div>

          {/* Uzun başlık testi */}
          <div>
            <h3 className="text-lg font-medium text-gray-300 mb-3">Uzun Başlık Testi</h3>
            <VideoDetailCard
              title="Çok Uzun Bir Dizi İsmi Burada Test Ediliyor"
              source="Test Platform"
              date="geçen hafta"
              episode="1. Sezon - 24. Bölüm - Final"
              likeCount={89}
              shareCount={12}
            />
          </div>
        </div>

        {/* Özellikler listesi */}
        <div className="mt-12 bg-dark-secondary rounded-lg p-6 border border-gray-700/50">
          <h2 className="text-xl font-semibold text-white mb-4">Özellikler</h2>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              <span>Responsive tasarım</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              <span>Hover animasyonları</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              <span>Beğen butonu animasyonu</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              <span>Paylaşım fonksiyonalitesi</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              <span>Beğeni ve paylaşım sayaçları</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              <span>Dark tema uyumlu</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VideoDetailDemo; 