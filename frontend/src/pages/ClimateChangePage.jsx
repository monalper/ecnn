import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../components/layout/Header';
import { 
  FaGlobe, 
  FaThermometerHalf, 
  FaCloud, 
  FaWater, 
  FaSnowflake, 
  FaFish, 
  FaBolt,
  FaFire,
  FaSeedling,
  FaThermometerFull,
  FaMountain,
  FaChartLine,
  FaGlobeAmericas,
  FaLandmark,
  FaMountain as FaMountainAsia,
  FaCrown,
  FaMoneyBillWave,
  FaHandshake,
  FaPlane,
  FaShip,
  FaIndustry,
  FaCar,
  FaBuilding,
  FaBatteryHalf,
  FaBox,
  FaLightbulb,
  FaAtom,
  FaPlug,
  FaBus,
  FaTree,
  FaCity,
  FaLeaf,
  FaExclamationTriangle,
  FaFireAlt,
  FaSkull,
  FaIndustry as FaFactory,
  FaGasPump,
  FaHardHat,
  FaExclamationCircle,
  FaFileAlt,
  FaGlobe as FaGlobeEurope,
  FaFlask,
  FaIndustry as FaIndustryIcon
} from 'react-icons/fa';

const ClimateChangePage = () => {
  const [scrollPercent, setScrollPercent] = useState(0);
  const [currentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      let percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      percent = Math.min(100, Math.max(0, percent));
      setScrollPercent(percent);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Force dark theme for this page
  useEffect(() => {
    document.body.classList.add('dark');
    document.documentElement.classList.add('dark');
    const originalTheme = localStorage.getItem('theme');
    return () => {
      document.body.classList.remove('dark');
      document.documentElement.classList.remove('dark');
      if (originalTheme) {
        localStorage.setItem('theme', originalTheme);
      }
    };
  }, []);

  const scientificData = {
    globalTemperature: {
      value: 1.1,
      unit: "°C",
      baseline: "1850-1900",
      target: 1.5,
      source: "IPCC AR6",
      color: "#ef4444",
      icon: FaThermometerHalf
    },
    atmosphericCO2: {
      value: 421,
      unit: "ppm",
      preIndustrial: 280,
      safeLevel: 350,
      source: "NOAA Mauna Loa",
      color: "#f97316",
      icon: FaCloud
    },
    seaLevelRise: {
      value: 3.3,
      unit: "mm/yıl",
      period: "1993-2023",
      acceleration: 0.1,
      source: "NASA",
      color: "#3b82f6",
      icon: FaWater
    },
    arcticSeaIce: {
      value: -12.6,
      unit: "%/on yıl",
      period: "1979-2023",
      minimum: 3.41,
      source: "NSIDC",
      color: "#06b6d4",
      icon: FaSnowflake
    },
    oceanAcidification: {
      value: -0.1,
      unit: "pH birimi",
      period: "1750-2023",
      impact: "%30 asitlik artışı",
      source: "NOAA PMEL",
      color: "#8b5cf6",
      icon: FaFish
    },
    extremeEvents: {
      value: 67,
      unit: "%",
      period: "2000-2023",
      confidence: "Yüksek",
      source: "WMO",
      color: "#f59e0b",
      icon: FaBolt
    }
  };

  const additionalMetrics = {
    methaneLevel: {
      value: 1923,
      unit: "ppb",
      period: "2023",
      increase: "%264",
      source: "NOAA",
      color: "#10b981",
      icon: FaFire
    },
    nitrousOxide: {
      value: 336,
      unit: "ppb",
      period: "2023",
      increase: "%24",
      source: "NOAA",
      color: "#84cc16",
      icon: FaSeedling
    },
    oceanHeat: {
      value: 0.88,
      unit: "ZJ",
      period: "2023",
      trend: "Hızlanıyor",
      source: "IPCC",
      color: "#06b6d4",
      icon: FaThermometerFull
    },
    glacierLoss: {
      value: -267,
      unit: "Gt/yıl",
      period: "2000-2019",
      impact: "Küresel",
      source: "Nature",
      color: "#6366f1",
      icon: FaMountain
    }
  };

  const keyFindings = [
    {
      id: 1,
      statement: "İnsan etkisi, son 2000 yılın en azından hiçbir döneminde görülmemiş bir hızda iklimi ısıtmıştır.",
      confidence: "Çok Yüksek",
      source: "IPCC AR6 WG1",
      icon: FaChartLine
    },
    {
      id: 2,
      statement: "Küresel yüzey sıcaklığı 1970'ten bu yana, son 2000 yılın herhangi bir 50 yıllık döneminden daha hızlı artmıştır.",
      confidence: "Çok Yüksek",
      source: "IPCC AR6 WG1",
      icon: FaGlobe
    },
    {
      id: 3,
      statement: "Küresel üst okyanusun (0-700 m) 1970'lerden bu yana ısındığı neredeyse kesindir.",
      confidence: "Çok Yüksek",
      source: "IPCC AR6 WG1",
      icon: FaWater
    },
    {
      id: 4,
      statement: "İnsan etkisi, 1990'lardan bu yana küresel buzul geri çekilmesinin ana itici gücü olmuştur.",
      confidence: "Çok Yüksek",
      source: "IPCC AR6 WG1",
      icon: FaSnowflake
    }
  ];

  const regionalImpacts = [
    {
      region: "Arktik",
      temperature: "+3.1°C",
      impacts: ["Permafrost çözülmesi", "Deniz buzu kaybı", "Yerli topluluklar etkilendi"],
      confidence: "Çok Yüksek",
      color: "#06b6d4",
      icon: FaSnowflake
    },
    {
      region: "Avrupa",
      temperature: "+1.7°C",
      impacts: ["Sıcak dalgaları", "Sel", "Tarımsal değişiklikler"],
      confidence: "Yüksek",
      color: "#3b82f6",
      icon: FaLandmark
    },
    {
      region: "Asya",
      temperature: "+1.6°C",
      impacts: ["Muson değişiklikleri", "Buzul geri çekilmesi", "Su kıtlığı"],
      confidence: "Yüksek",
      color: "#f59e0b",
      icon: FaMountainAsia
    }
  ];

  const responsibilityData = {
    wealthiest1Percent: {
      emissions: 15,
      description: "En zengin %1'in emisyon payı",
      details: "Küresel karbon emisyonlarının %15'inden sorumlu",
      color: "#ef4444",
      icon: FaCrown
    },
    wealthiest10Percent: {
      emissions: 52,
      description: "En zengin %10'un emisyon payı",
      details: "Küresel karbon emisyonlarının %52'sinden sorumlu",
      color: "#f97316",
      icon: FaMoneyBillWave
    },
    poorest50Percent: {
      emissions: 7,
      description: "En yoksul %50'nin emisyon payı",
      details: "Küresel karbon emisyonlarının sadece %7'sinden sorumlu",
      color: "#10b981",
      icon: FaHandshake
    },
    privateJets: {
      emissions: 0.6,
      description: "Özel jet emisyonları",
      details: "Yıllık 0.6 GtCO₂ (tüm havacılığın %4'ü)",
      color: "#8b5cf6",
      icon: FaPlane
    },
    luxuryYachts: {
      emissions: 0.3,
      description: "Lüks yat emisyonları",
      details: "Yıllık 0.3 GtCO₂ (küçük bir ülke kadar)",
      color: "#06b6d4",
      icon: FaShip
    }
  };

  const emissionsData = {
    sectors: [
      { name: "Elektrik ve Isı", percentage: 31, color: "#ef4444", icon: FaBolt },
      { name: "Ulaşım", percentage: 15, color: "#f97316", icon: FaCar },
      { name: "Üretim", percentage: 12, color: "#eab308", icon: FaIndustry },
      { name: "Tarım", percentage: 11, color: "#22c55e", icon: FaSeedling },
      { name: "Binalar", percentage: 6, color: "#3b82f6", icon: FaBuilding },
      { name: "Diğer Enerji", percentage: 5, color: "#8b5cf6", icon: FaBatteryHalf },
      { name: "Diğer", percentage: 20, color: "#6b7280", icon: FaBox }
    ],
    total: "51.0 GtCO₂e",
    year: 2022,
    source: "Climate Watch"
  };

  const mitigationStrategies = [
    {
      category: "Enerji Geçişi",
      icon: FaBolt,
      color: "#f59e0b",
      strategies: [
        { name: "Yenilenebilir Enerji", potential: "2050'ye kadar %70 azalma", cost: "Azalıyor", timeline: "2020-2050", icon: FaGlobe },
        { name: "Enerji Verimliliği", potential: "%40 azalma", cost: "Düşük", timeline: "Acil", icon: FaLightbulb },
        { name: "Nükleer Enerji", potential: "Enerji karışımının %10-15'i", cost: "Yüksek", timeline: "2030-2050", icon: FaAtom }
      ]
    },
    {
      category: "Ulaşım",
      icon: FaCar,
      color: "#3b82f6",
      strategies: [
        { name: "Elektrikli Araçlar", potential: "2050'ye kadar %90 pazar payı", cost: "Orta", timeline: "2025-2050", icon: FaPlug },
        { name: "Toplu Taşıma", potential: "%30 mod değişimi", cost: "Düşük", timeline: "2020-2030", icon: FaBus },
        { name: "Sürdürülebilir Havacılık", potential: "%50 emisyon azalması", cost: "Yüksek", timeline: "2030-2050", icon: FaPlane }
      ]
    },
    {
      category: "Arazi Kullanımı",
      icon: FaSeedling,
      color: "#10b981",
      strategies: [
        { name: "Orman Koruma", potential: "Yıllık 5-10 GtCO₂", cost: "Düşük", timeline: "Acil", icon: FaTree },
        { name: "Sürdürülebilir Tarım", potential: "%20 emisyon azalması", cost: "Orta", timeline: "2020-2040", icon: FaSeedling },
        { name: "Kentsel Planlama", potential: "%15 emisyon azalması", cost: "Orta", timeline: "2020-2050", icon: FaCity }
      ]
    }
  ];

  const futureProjections = [
    {
      scenario: "SSP1-1.9",
      description: "Çok Düşük Emisyonlar",
      temperature: "+1.4°C",
      probability: "%5",
      year: 2100,
      color: "#10b981",
      icon: FaLeaf
    },
    {
      scenario: "SSP1-2.6",
      description: "Düşük Emisyonlar",
      temperature: "+1.8°C",
      probability: "%20",
      year: 2100,
      color: "#84cc16",
      icon: FaSeedling
    },
    {
      scenario: "SSP2-4.5",
      description: "Orta Emisyonlar",
      temperature: "+2.7°C",
      probability: "%40",
      year: 2100,
      color: "#f59e0b",
      icon: FaExclamationTriangle
    },
    {
      scenario: "SSP3-7.0",
      description: "Yüksek Emisyonlar",
      temperature: "+3.6°C",
      probability: "%25",
      year: 2100,
      color: "#f97316",
      icon: FaFireAlt
    },
    {
      scenario: "SSP5-8.5",
      description: "Çok Yüksek Emisyonlar",
      temperature: "+4.4°C",
      probability: "%10",
      year: 2100,
      color: "#ef4444",
      icon: FaSkull
    }
  ];

  return (
    <>
      <Helmet>
        <title>İklim Değişikliği - Bilimsel Analiz | OpenWall</title>
        <meta name="description" content="Hakemli araştırmalar ve uluslararası iklim değerlendirmelerine dayalı iklim değişikliği bilimsel analizi." />
        <meta name="keywords" content="iklim değişikliği, küresel ısınma, IPCC, bilimsel veri, iklim bilimi" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <style>{`
          body {
            background-color: #0F0F0F !important;
            color: #fff !important;
            -webkit-text-size-adjust: 100%;
            -webkit-tap-highlight-color: transparent;
          }
          .dark {
            background-color: #0F0F0F !important;
            color: #fff !important;
          }
          
          /* Header and Footer overrides for climate change page */
          header, 
          header *,
          .header,
          .header *,
          nav,
          nav * {
            background-color: #0F0F0F !important;
            color: #fff !important;
            border-color: #f5f5f5 !important;
          }
          
          footer,
          footer *,
          .footer,
          .footer * {
            background-color: #0F0F0F !important;
            color: #fff !important;
            border-color: #f5f5f5 !important;
          }
          
          /* Specific header elements */
          .bg-white,
          .bg-slate-50,
          .bg-slate-100,
          .bg-slate-200,
          .bg-slate-300,
          .bg-slate-400,
          .bg-slate-500,
          .bg-slate-600,
          .bg-slate-700,
          .bg-slate-800,
          .bg-slate-900 {
            background-color: #2A2A2A !important;
          }
          
          /* Text colors for header/footer */
          .text-slate-900,
          .text-slate-800,
          .text-slate-700,
          .text-slate-600,
          .text-slate-500,
          .text-slate-400,
          .text-slate-300,
          .text-slate-200,
          .text-slate-100,
          .text-gray-900,
          .text-gray-800,
          .text-gray-700,
          .text-gray-600,
          .text-gray-500,
          .text-gray-400,
          .text-gray-300,
          .text-gray-200,
          .text-gray-100 {
            color: #fff !important;
          }
          
          /* Hover states */
          .hover\\:bg-slate-100:hover,
          .hover\\:bg-slate-200:hover,
          .hover\\:bg-slate-300:hover,
          .hover\\:bg-slate-400:hover,
          .hover\\:bg-slate-500:hover,
          .hover\\:bg-slate-600:hover,
          .hover\\:bg-slate-700:hover,
          .hover\\:bg-slate-800:hover,
          .hover\\:bg-slate-900:hover {
            background-color: #2A2A2A !important;
          }
          
          /* Border colors */
          .border-slate-200,
          .border-slate-300,
          .border-slate-400,
          .border-slate-500,
          .border-slate-600,
          .border-slate-700,
          .border-slate-800,
          .border-slate-900,
          .border-gray-200,
          .border-gray-300,
          .border-gray-400,
          .border-gray-500,
          .border-gray-600,
          .border-gray-700,
          .border-gray-800,
          .border-gray-900 {
            border-color: #f5f5f5 !important;
          }

          /* Custom gradient backgrounds */
          .gradient-bg {
            background: linear-gradient(135deg, #0F0F0F 0%, #2A2A2A 100%);
          }
          
          .card-glow {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.1);
            transition: all 0.3s ease;
            -webkit-tap-highlight-color: transparent;
          }
          
          .card-glow:hover {
            box-shadow: 0 0 30px rgba(59, 130, 246, 0.2);
            transform: translateY(-2px);
          }

          /* Mobile optimizations */
          @media (max-width: 768px) {
            .mobile-text-sm {
              font-size: 0.875rem;
            }
            
            .mobile-text-xs {
              font-size: 0.75rem;
            }
            
            .mobile-p-4 {
              padding: 1rem;
            }
            
            .mobile-p-3 {
              padding: 0.75rem;
            }
            
            .mobile-gap-4 {
              gap: 1rem;
            }
            
            .mobile-gap-3 {
              gap: 0.75rem;
            }
            
            .mobile-grid-1 {
              grid-template-columns: 1fr;
            }
            
            .mobile-grid-2 {
              grid-template-columns: repeat(2, 1fr);
            }
            
            .mobile-flex-col {
              flex-direction: column;
            }
            
            .mobile-text-center {
              text-align: center;
            }
            
            .mobile-space-y-2 {
              margin-top: 0.5rem;
            }
            
            .mobile-space-y-2 > * + * {
              margin-top: 0.5rem;
            }
            
            .mobile-w-full {
              width: 100%;
            }
            
            .mobile-text-lg {
              font-size: 1.125rem;
            }
            
            .mobile-text-xl {
              font-size: 1.25rem;
            }
            
            .mobile-text-2xl {
              font-size: 1.5rem;
            }
            
            .mobile-text-3xl {
              font-size: 1.875rem;
            }
            
            .mobile-mb-4 {
              margin-bottom: 1rem;
            }
            
            .mobile-mb-6 {
              margin-bottom: 1.5rem;
            }
            
            .mobile-mb-8 {
              margin-bottom: 2rem;
            }
            
            .mobile-px-4 {
              padding-left: 1rem;
              padding-right: 1rem;
            }
            
            .mobile-py-8 {
              padding-top: 2rem;
              padding-bottom: 2rem;
            }
            
            .mobile-py-12 {
              padding-top: 3rem;
              padding-bottom: 3rem;
            }
          }

          /* Touch optimizations */
          @media (hover: none) and (pointer: coarse) {
            .card-glow:hover {
              transform: none;
              box-shadow: 0 0 20px rgba(59, 130, 246, 0.1);
            }
            
            .card-glow:active {
              transform: scale(0.98);
              box-shadow: 0 0 30px rgba(59, 130, 246, 0.2);
            }
          }
        `}</style>
      </Helmet>

      <Header scrollPercent={scrollPercent} customTitle="openwall climate" />

      <div className="min-h-screen bg-dark-primary text-white">
        {/* Hero Section */}
        <section className="pt-24 md:pt-32 pb-12 md:pb-16 px-4 md:px-6 gradient-bg">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-4xl md:text-6xl mb-4 md:mb-6 flex justify-center">
              <FaGlobe className="text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-6xl font-light mb-6 md:mb-8 tracking-tight text-white">
              İklim Değişikliği
            </h1>
            <p className="text-lg md:text-xl text-gray-300 font-light leading-relaxed px-2">
              Hakemli araştırmalar ve uluslararası iklim değerlendirmelerinden bilimsel kanıtlar
            </p>
            <div className="mt-6 md:mt-8 flex flex-wrap justify-center gap-2 md:gap-4">
              <span className="bg-red-500/20 text-red-400 px-3 md:px-4 py-2 rounded-full text-xs md:text-sm border border-red-500/30 flex items-center gap-2">
                <FaFireAlt />
                Acil Durum
              </span>
              <span className="bg-blue-500/20 text-blue-400 px-3 md:px-4 py-2 rounded-full text-xs md:text-sm border border-blue-500/30 flex items-center gap-2">
                <FaChartLine />
                Bilimsel Veri
              </span>
              <span className="bg-green-500/20 text-green-400 px-3 md:px-4 py-2 rounded-full text-xs md:text-sm border border-green-500/30 flex items-center gap-2">
                <FaSeedling />
                Çözümler
              </span>
            </div>
          </div>
        </section>

        {/* Key Metrics */}
        <section className="py-8 md:py-16 px-4 md:px-6 border-t border-gray-800">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl md:text-2xl font-light mb-8 md:mb-12 text-center text-white">Temel İklim Göstergeleri</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
              {Object.entries(scientificData).map(([key, data]) => {
                const IconComponent = data.icon;
                return (
                  <div key={key} className="border border-gray-800 p-4 md:p-6 bg-dark-secondary card-glow rounded-lg">
                    <div className="flex items-center justify-between mb-3 md:mb-4">
                      <div className="text-2xl md:text-3xl">
                        <IconComponent className="text-white" />
                      </div>
                      <div className="text-2xl md:text-3xl font-light text-white" style={{ color: data.color }}>
                        {data.value}{data.unit}
                      </div>
                    </div>
                    <div className="text-xs md:text-sm text-gray-400 mb-3 md:mb-4">
                      {key === 'globalTemperature' && 'Küresel Sıcaklık'}
                      {key === 'atmosphericCO2' && 'Atmosferik CO₂'}
                      {key === 'seaLevelRise' && 'Deniz Seviyesi Yükselişi'}
                      {key === 'arcticSeaIce' && 'Arktik Deniz Buzu'}
                      {key === 'oceanAcidification' && 'Okyanus Asitlenmesi'}
                      {key === 'extremeEvents' && 'Aşırı Hava Olayları'}
                    </div>
                    <div className="text-xs text-gray-500">
                      Kaynak: {data.source}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Additional Metrics */}
        <section className="py-8 md:py-16 px-4 md:px-6 bg-dark-secondary">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl md:text-2xl font-light mb-8 md:mb-12 text-center text-white">Ek İklim Metrikleri</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
              {Object.entries(additionalMetrics).map(([key, data]) => {
                const IconComponent = data.icon;
                return (
                  <div key={key} className="border border-gray-800 p-3 md:p-4 bg-dark-secondary card-glow rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xl md:text-2xl">
                        <IconComponent className="text-white" />
                      </div>
                      <div className="text-lg md:text-2xl font-light text-white" style={{ color: data.color }}>
                        {data.value}{data.unit}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 mb-2">
                      {key === 'methaneLevel' && 'Metan Seviyesi'}
                      {key === 'nitrousOxide' && 'Azot Oksit'}
                      {key === 'oceanHeat' && 'Okyanus Isısı'}
                      {key === 'glacierLoss' && 'Buzul Kaybı'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {data.period} • {data.source}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Responsibility Section */}
        <section className="py-8 md:py-16 px-4 md:px-6 border-t border-gray-800 gradient-bg">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl md:text-2xl font-light mb-8 md:mb-12 text-center text-white">Asıl Suçlu Kim?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
              {Object.entries(responsibilityData).map(([key, data]) => {
                const IconComponent = data.icon;
                return (
                  <div key={key} className="border border-gray-800 p-4 md:p-6 bg-dark-secondary card-glow rounded-lg">
                    <div className="flex items-center justify-between mb-3 md:mb-4">
                      <div className="text-2xl md:text-3xl">
                        <IconComponent className="text-white" />
                      </div>
                      <div className="text-2xl md:text-3xl font-light" style={{ color: data.color }}>
                        %{data.emissions}
                      </div>
                    </div>
                    <div className="text-xs md:text-sm text-gray-300 mb-2">
                      {data.description}
                    </div>
                    <div className="text-xs text-gray-500">
                      {data.details}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="text-center">
              <div className="text-base md:text-lg text-gray-300 mb-3 md:mb-4 px-2 flex items-center justify-center gap-2">
                <FaFireAlt />
                Zenginlerin lüks tüketimi ve fosil yakıt yatırımları iklim değişikliğinin ana nedenidir
              </div>
              <div className="text-xs md:text-sm text-gray-500 px-2">
                En zengin %1, en yoksul %50'den 20 kat daha fazla karbon emisyonu üretiyor
              </div>
            </div>
          </div>
        </section>

        {/* Key Findings */}
        <section className="py-8 md:py-16 px-4 md:px-6 bg-dark-secondary">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl md:text-2xl font-light mb-8 md:mb-12 text-center text-white">Temel Bilimsel Bulgular</h2>
            <div className="space-y-6 md:space-y-8">
              {keyFindings.map((finding) => {
                const IconComponent = finding.icon;
                return (
                  <div key={finding.id} className="border-l-4 border-blue-500 pl-4 md:pl-6 card-glow rounded-r-lg p-3 md:p-4">
                    <div className="flex items-start gap-3 md:gap-4">
                      <div className="text-xl md:text-2xl">
                        <IconComponent className="text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-base md:text-lg leading-relaxed mb-2 text-white">
                          {finding.statement}
                        </p>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs md:text-sm text-gray-400">
                          <span>Güven: {finding.confidence}</span>
                          <span className="hidden sm:inline">•</span>
                          <span>{finding.source}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Regional Impacts */}
        <section className="py-8 md:py-16 px-4 md:px-6 border-t border-gray-800">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl md:text-2xl font-light mb-8 md:mb-12 text-center text-white">Bölgesel İklim Etkileri</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {regionalImpacts.map((region, index) => {
                const IconComponent = region.icon;
                return (
                  <div key={index} className="border border-gray-800 p-4 md:p-6 bg-dark-secondary card-glow rounded-lg">
                    <div className="flex justify-between items-start mb-3 md:mb-4">
                      <div className="flex items-center gap-2 md:gap-3">
                        <div className="text-xl md:text-2xl">
                          <IconComponent className="text-white" />
                        </div>
                        <h3 className="text-base md:text-lg font-medium text-white">{region.region}</h3>
                      </div>
                      <span className="text-xs md:text-sm text-gray-400" style={{ color: region.color }}>{region.temperature}</span>
                    </div>
                    <div className="space-y-1 md:space-y-2 mb-3 md:mb-4">
                      {region.impacts.map((impact, impactIndex) => (
                        <div key={impactIndex} className="text-xs md:text-sm text-gray-300">• {impact}</div>
                      ))}
                    </div>
                    <div className="text-xs text-gray-500">
                      Güven: {region.confidence}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Emissions Data */}
        <section className="py-8 md:py-16 px-4 md:px-6 bg-dark-secondary">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl md:text-2xl font-light mb-8 md:mb-12 text-center text-white">Küresel Sera Gazı Emisyonları</h2>
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
              <div>
                <div className="text-2xl md:text-3xl font-light mb-3 md:mb-4 text-white">
                  {emissionsData.total}
                </div>
                <div className="text-xs md:text-sm text-gray-400 mb-6 md:mb-8">
                  {emissionsData.year} yılında toplam emisyonlar
                </div>
                <div className="space-y-2 md:space-y-3">
                  {emissionsData.sectors.map((sector) => {
                    const IconComponent = sector.icon;
                    return (
                      <div key={sector.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm md:text-lg">
                            <IconComponent className="text-white" />
                          </span>
                          <span className="text-xs md:text-sm text-white">{sector.name}</span>
                        </div>
                        <div className="flex items-center gap-2 md:gap-3">
                          <div 
                            className="w-12 md:w-16 h-2 bg-gray-800 rounded-full overflow-hidden"
                            style={{ background: `linear-gradient(to right, ${sector.color} ${sector.percentage}%, #1f2937 ${sector.percentage}%)` }}
                          ></div>
                          <span className="text-xs md:text-sm font-mono text-white">{sector.percentage}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-2">
                  Kaynak: {emissionsData.source}
                </div>
                <div className="text-xs md:text-sm text-gray-400">
                  Veriler tüm sera gazlarının CO₂ eşdeğeri emisyonlarını temsil eder
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mitigation Strategies */}
        <section className="py-8 md:py-16 px-4 md:px-6 border-t border-gray-800">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl md:text-2xl font-light mb-8 md:mb-12 text-center text-white">Azaltma Stratejileri</h2>
            <div className="space-y-6 md:space-y-8">
              {mitigationStrategies.map((category, index) => {
                const CategoryIcon = category.icon;
                return (
                  <div key={index} className="border border-gray-800 p-4 md:p-6 bg-dark-secondary card-glow rounded-lg">
                    <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6 border-b border-gray-800 pb-2">
                      <div className="text-xl md:text-2xl">
                        <CategoryIcon className="text-white" />
                      </div>
                      <h3 className="text-lg md:text-xl font-medium text-white" style={{ color: category.color }}>
                        {category.category}
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                      {category.strategies.map((strategy, strategyIndex) => {
                        const StrategyIcon = strategy.icon;
                        return (
                          <div key={strategyIndex} className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="text-base md:text-lg">
                                <StrategyIcon className="text-white" />
                              </span>
                              <h4 className="font-medium text-white text-sm md:text-base">{strategy.name}</h4>
                            </div>
                            <div className="text-xs md:text-sm text-gray-400">
                              <div>Potansiyel: {strategy.potential}</div>
                              <div>Maliyet: {strategy.cost}</div>
                              <div>Zaman: {strategy.timeline}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Future Projections */}
        <section className="py-8 md:py-16 px-4 md:px-6 bg-dark-secondary">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl md:text-2xl font-light mb-8 md:mb-12 text-center text-white">Gelecek İklim Projeksiyonları (2100)</h2>
            <div className="space-y-3 md:space-y-4">
              {futureProjections.map((projection, index) => {
                const IconComponent = projection.icon;
                return (
                  <div key={index} className="border border-gray-800 p-3 md:p-4 bg-dark-secondary card-glow rounded-lg">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                      <div className="flex items-center gap-2 md:gap-3">
                        <div className="text-xl md:text-2xl">
                          <IconComponent className="text-white" />
                        </div>
                        <div>
                          <h3 className="text-base md:text-lg font-medium text-white">{projection.scenario}</h3>
                          <p className="text-xs md:text-sm text-gray-400">{projection.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg md:text-xl font-light text-white" style={{ color: projection.color }}>
                          {projection.temperature}
                        </div>
                        <div className="text-xs md:text-sm text-gray-400">{projection.probability} olasılık</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 md:mt-8 text-center">
              <div className="text-xs md:text-sm text-gray-400">
                Ortak Sosyoekonomik Yollar (SSP) senaryolarına dayalı
              </div>
            </div>
          </div>
        </section>

        {/* Temperature Timeline */}
        <section className="py-8 md:py-16 px-4 md:px-6 border-t border-gray-800">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl md:text-2xl font-light mb-8 md:mb-12 text-center text-white">Küresel Sıcaklık Anomalisi</h2>
            <div className="space-y-4 md:space-y-6">
              {[
                { year: 1850, temp: 0.0, event: "Sanayi Devrimi başlar", icon: FaIndustry },
                { year: 1900, temp: 0.1, event: "Fosil yakıt kullanımı artar", icon: FaGasPump },
                { year: 1950, temp: 0.3, event: "Hızlı sanayileşme", icon: FaHardHat },
                { year: 1980, temp: 0.5, event: "İlk iklim uyarıları", icon: FaExclamationCircle },
                { year: 2000, temp: 0.8, event: "Kyoto Protokolü", icon: FaFileAlt },
                { year: 2015, temp: 1.0, event: "Paris Anlaşması", icon: FaGlobeEurope },
                { year: currentYear, temp: scientificData.globalTemperature.value, event: "Mevcut seviye", icon: FaFireAlt }
              ].map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8">
                    <div className="w-16 text-xs md:text-sm font-mono text-white">{item.year}</div>
                    <div className="hidden sm:block flex-1 h-px bg-gradient-to-r from-gray-800 to-blue-500"></div>
                    <div className="w-20 text-right font-mono text-white text-xs md:text-sm">+{item.temp}°C</div>
                    <div className="text-xs md:text-sm text-gray-400 flex items-center gap-2">
                      <IconComponent />
                      <span>{item.event}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Scientific Consensus */}
        <section className="py-8 md:py-16 px-4 md:px-6 bg-dark-secondary">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-3xl md:text-4xl mb-4 md:mb-6 flex justify-center">
              <FaFlask className="text-white" />
            </div>
            <h2 className="text-xl md:text-2xl font-light mb-6 md:mb-8 text-white">Bilimsel Konsensüs</h2>
            <div className="text-base md:text-lg leading-relaxed text-gray-300 px-2">
              Çoklu kanıt çizgileri, iklim değişikliğinin gerçek, insan kaynaklı ve acil olduğunu göstermektedir. 
              Bilimsel konsensüs, binlerce hakemli çalışma tarafından desteklenmekte ve 
              dünyanın her büyük bilimsel organizasyonu tarafından onaylanmaktadır.
            </div>
            <div className="mt-6 md:mt-8 text-xs md:text-sm text-gray-500">
              Kaynaklar: IPCC, NASA, NOAA, WMO, Ulusal Bilimler Akademisi
            </div>
          </div>
        </section>

        {/* Footer */}
        <section className="py-8 md:py-16 px-4 md:px-6 border-t border-gray-800 bg-dark-secondary">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-xs md:text-sm text-gray-500">
              Veriler son güncellenme: {new Date().toLocaleDateString('tr-TR', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
            <div className="mt-3 md:mt-4 text-xs text-gray-600">
              Tüm veri kaynakları hakemli ve yetkili bilimsel kurumlardandır
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ClimateChangePage; 