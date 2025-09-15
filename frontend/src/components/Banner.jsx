// frontend/src/components/Banner.jsx
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import api from '../services/api';

const Banner = () => {
  const [banners, setBanners] = useState([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      console.log('Banner API çağrısı yapılıyor...');
      const response = await api.get('/banners/active');
      console.log('Banner API response:', response.data);
      setBanners(response.data);
      setCurrentBannerIndex(0);
    } catch (error) {
      console.error('Banner yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleNext = () => {
    setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
  };

  const handlePrev = () => {
    setCurrentBannerIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  // Debug log
  console.log('Banner render check:', { loading, isVisible, bannersLength: banners.length });

  // Loading durumunda veya banner yoksa hiçbir şey gösterme
  if (loading || banners.length === 0) {
    console.log('Banner render edilmiyor:', { loading, isVisible, bannersLength: banners.length });
    return null;
  }

  // Banner kapatıldıysa hiçbir şey gösterme
  if (!isVisible) {
    return null;
  }

  const currentBanner = banners[currentBannerIndex];

  return (
    <div 
      className="w-full fixed top-16 left-0 right-0 z-40"
      style={{
        backgroundColor: currentBanner.backgroundColor,
        color: currentBanner.textColor,
        minHeight: '40px'
      }}
    >
      <div className="flex items-center justify-between px-4 py-3" style={{ fontSize: '20px', fontWeight: 'bold', fontFamily: 'Helvetica, Arial, sans-serif' }}>
        {/* Sol ok - birden fazla banner varsa göster */}
        {banners.length > 1 && (
          <button
            onClick={handlePrev}
            className="p-1 hover:bg-black/10 rounded transition-colors"
            aria-label="Önceki banner"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Banner içeriği - Sonsuz kayma animasyonu */}
        <div className="flex-1 overflow-hidden px-2">
          <div className="flex animate-scroll-horizontal whitespace-nowrap">
            {/* Sürekli tekrarlanan metinler - sınırsız */}
            {Array.from({ length: 20 }, (_, index) => (
              <div key={index} className="flex-shrink-0 mr-8">
                {currentBanner.link ? (
                  <a
                    href={currentBanner.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline transition-colors"
                  >
                    {currentBanner.text}
                  </a>
                ) : (
                  <span>{currentBanner.text}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Sağ taraf - kapatma butonu ve sağ ok */}
        <div className="flex items-center gap-1">
          {/* Sağ ok - birden fazla banner varsa göster */}
          {banners.length > 1 && (
            <button
              onClick={handleNext}
              className="p-1 hover:bg-black/10 rounded transition-colors"
              aria-label="Sonraki banner"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Kapatma butonu */}
          <button
            onClick={handleClose}
            className="p-1 hover:bg-black/10 rounded transition-colors relative z-50"
            aria-label="Banner'ı kapat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Banner sayacı - birden fazla banner varsa göster */}
      {banners.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-1 pb-1 z-50">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBannerIndex(index)}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                index === currentBannerIndex 
                  ? 'bg-current opacity-100' 
                  : 'bg-current opacity-30'
              }`}
              aria-label={`Banner ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Banner;
