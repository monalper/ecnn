// ECNN - Kopya/frontend/src/pages/CategoriesPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaLaptop, 
  FaLightbulb, 
  FaPalette, 
  FaFutbol, 
  FaLandmark, 
  FaDollarSign, 
  FaHeartbeat, 
  FaGraduationCap, 
  FaLeaf, 
  FaUsers, 
  FaBrain, 
  FaPray, 
  FaMusic, 
  FaFilm, 
  FaPlane, 
  FaUtensils 
} from 'react-icons/fa';
import MetaTags from '../components/seo/MetaTags';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Kategori tanımları
  const categoryDefinitions = [
    { name: 'Teknoloji', slug: 'teknoloji', icon: FaLaptop, description: 'Teknoloji dünyasındaki en son gelişmeler, yenilikler ve trendler' },
    { name: 'Felsefe', slug: 'felsefe', icon: FaLightbulb, description: 'Felsefi düşünceler, teoriler ve yaşam üzerine derinlemesine analizler' },
    { name: 'Sanat', slug: 'sanat', icon: FaPalette, description: 'Görsel sanatlar, edebiyat ve yaratıcılık dünyasından içerikler' },
    { name: 'Spor', slug: 'spor', icon: FaFutbol, description: 'Spor dünyasından haberler, analizler ve performans değerlendirmeleri' },
    { name: 'Siyaset', slug: 'siyaset', icon: FaLandmark, description: 'Güncel siyasi gelişmeler, analizler ve politika dünyası' },
    { name: 'Ekonomi', slug: 'ekonomi', icon: FaDollarSign, description: 'Ekonomik trendler, piyasa analizleri ve finansal haberler' },
    { name: 'Sağlık', slug: 'sağlık', icon: FaHeartbeat, description: 'Sağlık ve tıp alanındaki gelişmeler, öneriler ve araştırmalar' },
    { name: 'Eğitim', slug: 'eğitim', icon: FaGraduationCap, description: 'Eğitim sistemi, öğrenme yöntemleri ve akademik gelişmeler' },
    { name: 'Çevre', slug: 'çevre', icon: FaLeaf, description: 'Çevre koruma, sürdürülebilirlik ve doğa ile ilgili konular' },
    { name: 'Sosyoloji', slug: 'sosyoloji', icon: FaUsers, description: 'Toplumsal olaylar, sosyal değişimler ve toplum analizleri' },
    { name: 'Psikoloji', slug: 'psikoloji', icon: FaBrain, description: 'Psikolojik araştırmalar, davranış analizleri ve ruh sağlığı' },
    { name: 'Din', slug: 'din', icon: FaPray, description: 'Dini konular, manevi yaşam ve inanç sistemleri' },
    { name: 'Müzik', slug: 'müzik', icon: FaMusic, description: 'Müzik dünyasından haberler, sanatçı profilleri ve albüm değerlendirmeleri' },
    { name: 'Sinema', slug: 'sinema', icon: FaFilm, description: 'Film dünyasından haberler, eleştiriler ve sinema analizleri' },
    { name: 'Seyahat', slug: 'seyahat', icon: FaPlane, description: 'Seyahat rehberleri, destinasyon önerileri ve turizm haberleri' },
    { name: 'Yemek', slug: 'yemek', icon: FaUtensils, description: 'Yemek kültürü, tarifler ve gastronomi dünyasından içerikler' }
  ];

  useEffect(() => {
    const fetchCategoryCounts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Her kategori için makale sayısını al
        const categoriesWithCounts = await Promise.all(
          categoryDefinitions.map(async (category) => {
            try {
              const response = await api.get(`/articles?category=${category.slug}&limit=1`);
              const count = response.data.total || 0;
              return {
                ...category,
                count
              };
            } catch (err) {
              console.warn(`${category.name} kategorisi için sayı alınamadı:`, err);
              return {
                ...category,
                count: 0
              };
            }
          })
        );

        setCategories(categoriesWithCounts);
      } catch (err) {
        console.error('Kategori sayıları alınırken hata:', err);
        setError('Kategori bilgileri yüklenirken bir hata oluştu.');
        // Hata durumunda varsayılan değerlerle devam et
        setCategories(categoryDefinitions.map(cat => ({ ...cat, count: 0 })));
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryCounts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-site-background dark:bg-dark-primary flex items-center justify-center">
        <LoadingSpinner size="large" text="Kategoriler yükleniyor..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-site-background dark:bg-dark-primary">
      <MetaTags
        title="Kategoriler"
        description="Teknoloji, felsefe, sanat, spor, siyaset, ekonomi, sağlık, eğitim, çevre, sosyoloji, psikoloji, din, müzik, sinema, seyahat ve yemek kategorilerinde içerikler"
        keywords="kategoriler, teknoloji, felsefe, sanat, spor, siyaset, ekonomi, sağlık, eğitim, çevre, sosyoloji, psikoloji, din, müzik, sinema, seyahat, yemek"
      />
      
      <div className="px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-white mb-4">
            Kategoriler
          </h1>
          <p className="text-lg text-slate-600 dark:text-[#f5f5f5] max-w-2xl mx-auto">
            İlgi alanınıza göre içerikleri keşfedin ve favori kategorilerinizdeki en güncel makalelere ulaşın.
          </p>
        </div>

        {error && (
          <div className="text-center mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {categories.map(category => {
            const IconComponent = category.icon;
            return (
              <div key={category.slug} className="group">
                <Link to={`/articles?category=${category.slug}`} className="block">
                  <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-brand-orange dark:hover:border-brand-orange transition-all duration-300 overflow-hidden group-hover:shadow-md">
                    <div className="p-6">
                      {/* Icon */}
                      <div className="mb-4">
                        <IconComponent className="text-3xl text-slate-700 dark:text-white group-hover:text-brand-orange dark:group-hover:text-brand-orange transition-colors duration-300" />
                      </div>
                      
                      {/* Title */}
                      <h2 className="text-lg font-semibold text-slate-800 dark:text-white group-hover:text-brand-orange dark:group-hover:text-brand-orange transition-colors duration-300 mb-3">
                        {category.name}
                      </h2>
                      
                      {/* Description */}
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {categories.length === 0 && (
          <div className="text-center py-16 lg:py-24">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold text-slate-800 dark:text-white mb-4">
                Henüz Kategori Bulunmamaktadır
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed">
                Yakında kategoriler eklenecek ve içerikler organize edilecek.
              </p>
              <div className="mt-8">
                <div className="inline-flex items-center px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Yakında burada olacak
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;
