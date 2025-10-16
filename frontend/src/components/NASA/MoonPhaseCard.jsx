import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../LoadingSpinner';

const MoonPhaseCard = ({ className = '' }) => {
  const navigate = useNavigate();
  const [moonData, setMoonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMoonData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const moonPhaseData = calculateMoonPhase();
        setMoonData(moonPhaseData);
      } catch (err) {
        console.error('Moon data calculation error:', err);
        setError('Ay verisi hesaplanamadı');
      } finally {
        setLoading(false);
      }
    };

    fetchMoonData();
  }, []);

  const calculateMoonPhase = () => {
    const now = new Date();
    const istanbulTime = new Date(now.getTime() + (3 * 60 * 60 * 1000));
    const year = istanbulTime.getFullYear();
    const month = istanbulTime.getMonth() + 1;
    const day = istanbulTime.getDate();
    
    const a = Math.floor((14 - month) / 12);
    const y = year + 4800 - a;
    const m = month + 12 * a - 3;
    const jd = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
    const k = Math.floor((jd - 2451550.09765) / 29.530588861);
    const phase = (jd - 2451550.09765) / 29.530588861 - k;
    const normalizedPhase = phase < 0 ? phase + 1 : phase;

    let illumination = 0;
    if (normalizedPhase <= 0.5) {
      illumination = Math.round(normalizedPhase * 200);
    } else {
      illumination = Math.round((1 - normalizedPhase) * 200);
    }
    illumination = Math.max(0, Math.min(100, illumination));

    let phaseName = '';
    let phaseImage = '';
    let phaseDescription = '';
    
    if (normalizedPhase < 0.0625) {
      phaseName = 'Yeni Ay';
      phaseImage = '/moon/new-moon.jpg';
      phaseDescription = 'Ay görünmez';
    } else if (normalizedPhase < 0.1875) {
      phaseName = 'İlk Hilal';
      phaseImage = '/moon/waxing-crescent.jpg';
      phaseDescription = 'İnce hilal';
    } else if (normalizedPhase < 0.3125) {
      phaseName = 'İlk Dördün';
      phaseImage = '/moon/first-quarter.jpg';
      phaseDescription = 'Yarım ay (büyüyor)';
    } else if (normalizedPhase < 0.4375) {
      phaseName = 'Büyüyen Ay';
      phaseImage = '/moon/waxing-gibbous.jpg';
      phaseDescription = 'Dolunay yaklaşıyor';
    } else if (normalizedPhase < 0.5625) {
      phaseName = 'Dolunay';
      phaseImage = '/moon/full.webp';
      phaseDescription = 'Tam dolunay';
    } else if (normalizedPhase < 0.6875) {
      phaseName = 'Küçülen Ay';
      phaseImage = '/moon/waning-gibbous.webp';
      phaseDescription = 'Dolunay sonrası';
    } else if (normalizedPhase < 0.8125) {
      phaseName = 'Son Dördün';
      phaseImage = '/moon/third-quarter.webp';
      phaseDescription = 'Yarım ay (küçülüyor)';
    } else {
      phaseName = 'Son Hilal';
      phaseImage = '/moon/waning-crescent.webp';
      phaseDescription = 'İnce hilal (küçülüyor)';
    }
    
    return {
      phase: phaseName,
      image: phaseImage,
      description: phaseDescription,
      illumination: Math.max(0, Math.min(100, illumination))
    };
  };

  if (loading) {
    return (
      <div className={`relative ${className}`}>
        <div className="relative w-full" style={{ paddingBottom: '75%' }}>
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 rounded-none md:rounded-lg flex items-center justify-center">
            <LoadingSpinner size="small" text="Yükleniyor..." />
          </div>
        </div>
        <div className="px-4 md:px-0 mt-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3"></div>
        </div>
      </div>
    );
  }

  if (error || !moonData) {
    return (
      <div className={`relative ${className}`}>
        <div className="relative w-full" style={{ paddingBottom: '75%' }}>
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 rounded-none md:rounded-lg flex items-center justify-center">
            <div className="text-center p-4">
              <div className="text-4xl mb-2">🌙</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Veri yüklenemedi</p>
            </div>
          </div>
        </div>
        <div className="px-4 md:px-0 mt-3">
          <h3 className="font-bold text-gray-900 dark:text-white text-[20px]">
            Ayın Görünümü
          </h3>
          <p className="text-gray-400 dark:text-gray-500 text-[17px] mt-1 font-bold">
            Veri yüklenemedi
          </p>
        </div>
      </div>
    );
  }

  const phaseName = moonData.phase || moonData.phaseName || 'Dolunay';
  const phaseImage = moonData.image || '/moon/full.webp';
  const phaseDescription = moonData.description || moonData.phaseDescription || 'Ayın evresi';
  const illumination = moonData.illumination || moonData.illuminationPercentage || 50;

  const handleCardClick = () => {
    navigate('/moon');
  };

  return (
    <div 
      className={`relative ${className} cursor-pointer`}
      onClick={handleCardClick}
    >
      <div className="relative w-full" style={{ paddingBottom: '75%' }}>
        <div className="absolute inset-0 bg-black rounded-none md:rounded-lg overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={phaseImage}
              alt={phaseName}
              className="w-24 h-24 object-contain"
              loading="lazy"
              onError={(e) => {
                e.target.src = '/moon/full.webp';
              }}
            />
          </div>
        </div>
      </div>

      <div className="px-4 md:px-0 mt-3">
        <h3 className="font-bold text-gray-900 dark:text-white text-[20px] line-clamp-2 leading-tight">
          {phaseName} · {illumination}% Aydınlanma
        </h3>

        <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500 text-[19px] mt-1 font-bold">
          <span>
            {new Date().toLocaleDateString('tr-TR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
          <span>·</span>
          <span>Openwall Space tarafından</span>
        </div>
      </div>
    </div>
  );
};

export default MoonPhaseCard;
