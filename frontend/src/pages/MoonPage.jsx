import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { FaArrowDown } from 'react-icons/fa';
import Header from '../components/layout/Header';
import MoonPhaseCard from '../components/NASA/MoonPhaseCard';
import LoadingSpinner from '../components/LoadingSpinner';
import MetaTags from '../components/seo/MetaTags';
import SchemaMarkup from '../components/seo/SchemaMarkup';

const MoonPage = () => {
  const navigate = useNavigate();
  const [moonData, setMoonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scrollPercent, setScrollPercent] = useState(0);

  // Scroll progress tracking
  useEffect(() => {
    const handleScroll = () => {
      const articleContent = document.querySelector('.prose');
      if (articleContent) {
        const rect = articleContent.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        if (rect.top <= windowHeight) {
          const contentHeight = articleContent.scrollHeight;
          const contentTop = articleContent.offsetTop;
          const scrollTop = window.scrollY;
          
          const contentScrollTop = Math.max(0, scrollTop - contentTop);
          const contentVisibleHeight = Math.min(contentHeight, windowHeight);
          
          let percent = 0;
          if (contentScrollTop > 0) {
            percent = Math.min(100, (contentScrollTop / (contentHeight - contentVisibleHeight)) * 100);
          }
          
          setScrollPercent(Math.max(0, Math.min(100, percent)));
        } else {
          setScrollPercent(0);
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchMoonData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Calculate moon phase data
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

  // Calculate moon phase using accurate algorithm for Istanbul
  const calculateMoonPhase = () => {
    const now = new Date();
    
    // Convert to Istanbul time (UTC+3)
    const istanbulTime = new Date(now.getTime() + (3 * 60 * 60 * 1000));
    
    // More accurate moon phase calculation
    // Based on Astronomical Algorithms by Jean Meeus
    const year = istanbulTime.getFullYear();
    const month = istanbulTime.getMonth() + 1;
    const day = istanbulTime.getDate();
    
    // Julian day calculation
    const a = Math.floor((14 - month) / 12);
    const y = year + 4800 - a;
    const m = month + 12 * a - 3;
    const jd = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
    
    // Moon phase calculation using more accurate constants
    const k = Math.floor((jd - 2451550.09765) / 29.530588861);
    const phase = (jd - 2451550.09765) / 29.530588861 - k;
    
    // Normalize phase to 0-1
    const normalizedPhase = phase < 0 ? phase + 1 : phase;
    
    // Calculate illumination percentage more accurately
    let illumination = 0;
    if (normalizedPhase <= 0.5) {
      // Waxing phases: 0 to 100%
      illumination = Math.round(normalizedPhase * 200);
    } else {
      // Waning phases: 100% to 0%
      illumination = Math.round((1 - normalizedPhase) * 200);
    }
    illumination = Math.max(0, Math.min(100, illumination));
    
    let phaseName = '';
    let phaseImage = '';
    let phaseDescription = '';
    let nextPhase = '';
    let nextPhaseDate = '';
    
    if (normalizedPhase < 0.0625) {
      phaseName = 'Yeni Ay';
      phaseImage = '/moon/new-moon.jpg';
      phaseDescription = 'Ay görünmez';
      nextPhase = 'İlk Hilal';
      nextPhaseDate = calculateNextPhaseDate(normalizedPhase, 0.125);
    } else if (normalizedPhase < 0.1875) {
      phaseName = 'İlk Hilal';
      phaseImage = '/moon/waxing-crescent.jpg';
      phaseDescription = 'İnce hilal';
      nextPhase = 'İlk Dördün';
      nextPhaseDate = calculateNextPhaseDate(normalizedPhase, 0.25);
    } else if (normalizedPhase < 0.3125) {
      phaseName = 'İlk Dördün';
      phaseImage = '/moon/first-quarter.jpg';
      phaseDescription = 'Yarım ay (büyüyor)';
      nextPhase = 'Büyüyen Ay';
      nextPhaseDate = calculateNextPhaseDate(normalizedPhase, 0.375);
    } else if (normalizedPhase < 0.4375) {
      phaseName = 'Büyüyen Ay';
      phaseImage = '/moon/waxing-gibbous.jpg';
      phaseDescription = 'Dolunay yaklaşıyor';
      nextPhase = 'Dolunay';
      nextPhaseDate = calculateNextPhaseDate(normalizedPhase, 0.5);
    } else if (normalizedPhase < 0.5625) {
      phaseName = 'Dolunay';
      phaseImage = '/moon/full.webp';
      phaseDescription = 'Tam dolunay';
      nextPhase = 'Küçülen Ay';
      nextPhaseDate = calculateNextPhaseDate(normalizedPhase, 0.625);
    } else if (normalizedPhase < 0.6875) {
      phaseName = 'Küçülen Ay';
      phaseImage = '/moon/waning-gibbous.webp';
      phaseDescription = 'Dolunay sonrası';
      nextPhase = 'Son Dördün';
      nextPhaseDate = calculateNextPhaseDate(normalizedPhase, 0.75);
    } else if (normalizedPhase < 0.8125) {
      phaseName = 'Son Dördün';
      phaseImage = '/moon/third-quarter.webp';
      phaseDescription = 'Yarım ay (küçülüyor)';
      nextPhase = 'Son Hilal';
      nextPhaseDate = calculateNextPhaseDate(normalizedPhase, 0.875);
    } else {
      phaseName = 'Son Hilal';
      phaseImage = '/moon/waning-crescent.webp';
      phaseDescription = 'İnce hilal (küçülüyor)';
      nextPhase = 'Yeni Ay';
      nextPhaseDate = calculateNextPhaseDate(normalizedPhase, 1.0);
    }
    
    return {
      phase: phaseName,
      image: phaseImage,
      description: phaseDescription,
      illumination: Math.max(0, Math.min(100, illumination)),
      nextPhase,
      nextPhaseDate,
      currentDate: istanbulTime.toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    };
  };

  const calculateNextPhaseDate = (currentPhase, targetPhase) => {
    const now = new Date();
    const daysToNext = (targetPhase - currentPhase) * 29.530588861;
    const nextDate = new Date(now.getTime() + daysToNext * 24 * 60 * 60 * 1000);
    
    return nextDate.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getMoonPhaseEmoji = (phaseName) => {
    const phaseMap = {
      'Yeni Ay': '🌑',
      'İlk Hilal': '🌒',
      'İlk Dördün': '🌓',
      'Büyüyen Ay': '🌔',
      'Dolunay': '🌕',
      'Küçülen Ay': '🌖',
      'Son Dördün': '🌗',
      'Son Hilal': '🌘'
    };
    return phaseMap[phaseName] || '🌕';
  };

  const getMoonFacts = () => {
    return [
      {
        title: "Ay'ın Çapı",
        value: "3,474 km",
        description: "Dünya'nın yaklaşık 1/4'ü kadar"
      },
      {
        title: "Dünya'ya Uzaklığı",
        value: "384,400 km",
        description: "Ortalama mesafe"
      },
      {
        title: "Yörünge Süresi",
        value: "27.3 gün",
        description: "Dünya etrafında dönüş"
      },
      {
        title: "Yerçekimi",
        value: "1.62 m/s²",
        description: "Dünya'nın 1/6'sı kadar"
      },
      {
        title: "Sıcaklık",
        value: "-233°C ile 123°C",
        description: "Gündüz ve gece arası fark"
      },
      {
        title: "Yaş",
        value: "4.5 milyar yıl",
        description: "Dünya ile aynı yaşta"
      }
    ];
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <LoadingSpinner size="medium" text="Ay Verileri Yükleniyor..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="max-w-2xl mx-auto px-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Hata</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  if (!moonData) {
    return (
      <div className="text-center py-20">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Veri Bulunamadı</h1>
          <p className="text-gray-600 dark:text-gray-400">Ay verileri bulunamadı.</p>
        </div>
      </div>
    );
  }

  const moonFacts = getMoonFacts();

  // Page metadata - Enhanced SEO
  const pageTitle = `Ay Evreleri - ${moonData.phase} (${moonData.currentDate})`;
  const pageDescription = `Güncel ay evresi: ${moonData.phase}. Aydınlanma oranı: %${moonData.illumination}. Ay hakkında detaylı bilgiler ve astronomi verileri.`;
  const pageUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/moon`
    : '';
  
  // Enhanced keywords for better SEO
  const seoKeywords = [
    "Ay Evreleri",
    "Dolunay", 
    "Yeni Ay",
    "Astronomi",
    "Ay Bilgileri",
    "Ay Fazları",
    "Moon Phases",
    "Astronomy",
    "Space",
    "Bilim",
    "Gökbilim",
    moonData.phase?.toLowerCase(),
    moonData.currentDate
  ].filter(Boolean).join(', ');

  return (
    <div className="moon-page">
      <MetaTags
        title={pageTitle}
        description={pageDescription}
        keywords={seoKeywords}
        image="/moon/full.webp"
        url={pageUrl}
        type="article"
        author="OpenWall"
        publishedTime={moonData.currentDate}
        section="Astronomy"
        tags={["Ay", "Moon", "Astronomy", "Space", "Science", "Bilim", "Uzay"]}
        isHighlight={true}
      />
      
      <SchemaMarkup
        type="WebPage"
        data={{
          name: "Ay Evreleri ve Bilgileri",
          description: pageDescription,
          url: pageUrl,
          image: "/moon/full.webp"
        }}
        breadcrumbs={[
          { name: 'Ana Sayfa', url: 'https://openwall.com.tr' },
          { name: 'Ay Evreleri', url: 'https://openwall.com.tr/moon' }
        ]}
      />

      <Header scrollPercent={scrollPercent} customTitle="moon" />

      {/* Hero Section - Large Header Image */}
      <div className="relative w-full h-[90vw] md:aspect-[4/3] md:h-[90vh] lg:h-[100vh] md:min-h-[650px] lg:min-h-[750px] bg-black">
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src={moonData.image}
            alt={moonData.phase}
            className="w-96 h-96 md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] object-contain opacity-90"
            loading="lazy"
            onError={(e) => {
              e.target.src = '/moon/full.webp';
            }}
          />
        </div>
        
        {/* Overlay with title */}
        <div className="absolute inset-0 bg-black/30"></div>
        
        {/* Gradient overlay for better text readability */}
        <div className="hidden md:block absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-black via-black/90 via-black/80 via-black/70 via-black/60 via-black/50 via-black/40 via-black/30 via-black/20 via-black/10 via-black/5 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 lg:p-12">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
            <h1 className="hidden md:block text-[72px] font-garamond text-white font-medium leading-none max-w-4xl mb-4">
              {moonData.phase} · %{moonData.illumination} Aydınlanma
            </h1>
            <p className="hidden md:block text-base md:text-lg lg:text-xl text-white/90 font-inter leading-relaxed max-w-3xl">
              {moonData.currentDate} - Ay Evreleri ve Astronomi Bilgileri
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto py-6 md:py-8 lg:py-12">
          <div className="block lg:grid lg:grid-cols-4 lg:gap-12">
            
            {/* Mobile: Top, Desktop: Left - Metadata Sidebar */}
            <div className="order-1 lg:order-1 mb-8 lg:mb-0">
              <div className="lg:sticky lg:top-28 lg:self-start">
                {/* Mobile: Title and meta card */}
                <div className="block lg:hidden mb-6">
                  <h1 className="text-[42px] md:text-4xl lg:text-5xl xl:text-6xl font-garamond text-gray-900 dark:text-white font-medium leading-none max-w-4xl mb-4">
                    {moonData.phase} · %{moonData.illumination} Aydınlanma
                  </h1>
                  
                  <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <div>Ay Evreleri ve Astronomi Bilgileri</div>
                    <div>{moonData.currentDate}</div>
                    <div>Sonraki evre: {moonData.nextPhase}</div>
                  </div>
                </div>

                {/* Desktop: Full metadata sidebar */}
                <div className="hidden lg:block">
                  {/* Article Title - Only visible when hero title is not visible */}
                  {scrollPercent > 1 && (
                    <div className="pb-3 mb-4 lg:mb-0">
                      <h1 className="text-xl font-inter font-bold text-gray-900 dark:text-white leading-tight">
                        {moonData.phase} · %{moonData.illumination} Aydınlanma
                      </h1>
                    </div>
                  )}
                  
                  {/* Moon Information */}
                  <div className="pb-3 mb-4 lg:mb-0">
                    <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                      Ay Evreleri ve Astronomi Bilgileri
                    </p>
                  </div>

                  {/* Date */}
                  <div className="pb-3 mb-4 lg:mb-0">
                    <p className="text-sm md:text-base text-gray-700">
                      {moonData.currentDate}
                    </p>
                  </div>

                  {/* Next Phase */}
                  <div className="pb-3 mb-4 lg:mb-0">
                    <p className="text-sm md:text-base text-gray-700">
                      Sonraki evre: {moonData.nextPhase}
                    </p>
                    <p className="text-xs text-gray-500">
                      {moonData.nextPhaseDate}
                    </p>
                  </div>

                  {/* Illumination */}
                  <div className="pb-3 mb-4 lg:mb-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-700">Aydınlanma:</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">%{moonData.illumination}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${moonData.illumination}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="pb-3 mb-4 lg:mb-0">
                    <div className="text-sm md:text-base text-black dark:text-white opacity-40">
                      #Ay #Moon #Astronomy #Space
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile: Bottom, Desktop: Right - Main Content */}
            <div className="order-2 lg:col-span-3">
              {/* Content */}
              <div className="prose prose-sm md:prose-base lg:prose-lg max-w-none lg:-mt-8">
                <div className="text-lg md:text-xl lg:text-[22px] leading-tight text-gray-800 dark:text-gray-200 font-inter">
                  <p className="mb-4">
                    Ay, Dünya'nın tek doğal uydusu ve gökyüzündeki en parlak nesnedir. Ay'ın evreleri, Dünya'dan bakıldığında Ay'ın farklı zamanlarda farklı şekillerde görünmesidir. Bu evreler, Ay'ın Dünya etrafındaki yörüngesi ve Güneş'ten aldığı ışığın Dünya'dan nasıl göründüğüne bağlı olarak değişir.
                  </p>
                  <p className="mb-4">
                    Şu anda Ay'ın evresi <strong>{moonData.phase}</strong> ve aydınlanma oranı <strong>%{moonData.illumination}</strong>'dir. Bu evre, Ay'ın Dünya etrafındaki 29.5 günlük döngüsünün bir parçasıdır.
                  </p>
                  <p className="mb-4">
                    Ay'ın evreleri şu sırayla gerçekleşir: Yeni Ay, İlk Hilal, İlk Dördün, Büyüyen Ay, Dolunay, Küçülen Ay, Son Dördün ve Son Hilal. Her evre yaklaşık 3.7 gün sürer.
                  </p>
                </div>
              </div>

              {/* Moon Facts Section */}
              <div className="mt-8 md:mt-12 pt-6 md:pt-8">
                <h2 className="text-xl md:text-2xl font-inter font-bold text-gray-900 dark:text-white mb-4 md:mb-6">
                  Ay Hakkında İlginç Bilgiler
                </h2>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {moonFacts.map((fact, index) => (
                    <div 
                      key={index}
                      className="bg-gray-50 dark:bg-slate-800 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {fact.title}
                      </h3>
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                        {fact.value}
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm font-inter">
                        {fact.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Moon Phase Cycle */}
              <div className="mt-8 md:mt-12 pt-6 md:pt-8">
                <h2 className="text-xl md:text-2xl font-inter font-bold text-gray-900 dark:text-white mb-4 md:mb-6">
                  Ay Evreleri Döngüsü
                </h2>
                
                <div className="grid grid-cols-4 md:grid-cols-8 gap-4 mb-6">
                  {[
                    { name: 'Yeni Ay', image: '/moon/new-moon.jpg', phase: 0 },
                    { name: 'İlk Hilal', image: '/moon/waxing-crescent.jpg', phase: 0.125 },
                    { name: 'İlk Dördün', image: '/moon/first-quarter.jpg', phase: 0.25 },
                    { name: 'Büyüyen Ay', image: '/moon/waxing-gibbous.jpg', phase: 0.375 },
                    { name: 'Dolunay', image: '/moon/full.webp', phase: 0.5 },
                    { name: 'Küçülen Ay', image: '/moon/waning-gibbous.webp', phase: 0.625 },
                    { name: 'Son Dördün', image: '/moon/third-quarter.webp', phase: 0.75 },
                    { name: 'Son Hilal', image: '/moon/waning-crescent.webp', phase: 0.875 }
                  ].map((phase, index) => {
                    const currentPhase = moonData.phase;
                    const isCurrentPhase = phase.name === currentPhase;
                    
                    return (
                      <div 
                        key={index}
                        className="text-center transition-all duration-300"
                      >
                        {/* Arrow indicator for current phase - fixed height container */}
                        <div className="h-6 flex justify-center items-start mb-1">
                          {isCurrentPhase ? (
                            <FaArrowDown className="text-blue-500 text-lg" />
                          ) : (
                            <div></div>
                          )}
                        </div>
                        
                        <div className="w-16 h-16 mx-auto mb-2 rounded-full overflow-hidden bg-black flex items-center justify-center">
                          <img
                            src={phase.image}
                            alt={phase.name}
                            className="w-14 h-14 object-contain"
                            loading="lazy"
                            onError={(e) => {
                              e.target.src = '/moon/full.webp';
                            }}
                          />
                        </div>
                        <div className={`text-xs font-medium font-inter ${
                          isCurrentPhase 
                            ? 'text-blue-700 dark:text-blue-300 font-bold' 
                            : 'text-gray-600 dark:text-gray-300'
                        }`}>
                          {phase.name}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 text-sm font-inter">
                  Ay'ın evreleri, Dünya'dan bakıldığında Ay'ın farklı zamanlarda farklı şekillerde görünmesidir. 
                  Bu döngü yaklaşık 29.5 günde tamamlanır ve her evre yaklaşık 3.7 gün sürer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoonPage;
