// ECNN - Kopya/frontend/src/pages/CategoriesPage.jsx (Yeni Dosya)
import React from 'react';
import { Link } from 'react-router-dom';
import MetaTags from '../components/seo/MetaTags';

const CategoriesPage = () => {
  const categories = [
    { name: 'Teknoloji', slug: 'teknoloji', count: 12, icon: '💻', description: 'Teknoloji dünyasındaki en son gelişmeler, yenilikler ve trendler' },
    { name: 'Felsefe', slug: 'felsefe', count: 15, icon: '🤔', description: 'Felsefi düşünceler, teoriler ve yaşam üzerine derinlemesine analizler' },
    { name: 'Sanat', slug: 'sanat', count: 8, icon: '🎨', description: 'Görsel sanatlar, edebiyat ve yaratıcılık dünyasından içerikler' },
    { name: 'Spor', slug: 'spor', count: 10, icon: '⚽', description: 'Spor dünyasından haberler, analizler ve performans değerlendirmeleri' },
    { name: 'Siyaset', slug: 'siyaset', count: 6, icon: '🏛️', description: 'Güncel siyasi gelişmeler, analizler ve politika dünyası' },
    { name: 'Ekonomi', slug: 'ekonomi', count: 9, icon: '💰', description: 'Ekonomik trendler, piyasa analizleri ve finansal haberler' },
    { name: 'Sağlık', slug: 'sağlık', count: 7, icon: '🏥', description: 'Sağlık ve tıp alanındaki gelişmeler, öneriler ve araştırmalar' },
    { name: 'Eğitim', slug: 'eğitim', count: 11, icon: '📚', description: 'Eğitim sistemi, öğrenme yöntemleri ve akademik gelişmeler' },
    { name: 'Çevre', slug: 'çevre', count: 5, icon: '🌍', description: 'Çevre koruma, sürdürülebilirlik ve doğa ile ilgili konular' },
    { name: 'Sosyoloji', slug: 'sosyoloji', count: 8, icon: '👥', description: 'Toplumsal olaylar, sosyal değişimler ve toplum analizleri' },
    { name: 'Psikoloji', slug: 'psikoloji', count: 12, icon: '🧠', description: 'Psikolojik araştırmalar, davranış analizleri ve ruh sağlığı' },
    { name: 'Din', slug: 'din', count: 4, icon: '⛪', description: 'Dini konular, manevi yaşam ve inanç sistemleri' },
    { name: 'Müzik', slug: 'müzik', count: 9, icon: '🎵', description: 'Müzik dünyasından haberler, sanatçı profilleri ve albüm değerlendirmeleri' },
    { name: 'Sinema', slug: 'sinema', count: 13, icon: '🎬', description: 'Film dünyasından haberler, eleştiriler ve sinema analizleri' },
    { name: 'Seyahat', slug: 'seyahat', count: 6, icon: '✈️', description: 'Seyahat rehberleri, destinasyon önerileri ve turizm haberleri' },
    { name: 'Yemek', slug: 'yemek', count: 7, icon: '🍽️', description: 'Yemek kültürü, tarifler ve gastronomi dünyasından içerikler' }
  ];

  return (
    <div className="min-h-screen bg-site-background dark:bg-dark-primary">
      <MetaTags
        title="Kategoriler - OpenWall"
        description="Teknoloji, felsefe, sanat, spor, siyaset, ekonomi, sağlık, eğitim, çevre, sosyoloji, psikoloji, din, müzik, sinema, seyahat ve yemek kategorilerinde içerikler"
        keywords="kategoriler, teknoloji, felsefe, sanat, spor, siyaset, ekonomi, sağlık, eğitim, çevre, sosyoloji, psikoloji, din, müzik, sinema, seyahat, yemek"
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-white mb-4">
            Kategoriler
          </h1>
          <p className="text-lg text-slate-600 dark:text-[#f5f5f5] max-w-2xl mx-auto">
            İlgi alanınıza göre içerikleri keşfedin ve favori kategorilerinizdeki en güncel makalelere ulaşın.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map(category => (
            <div key={category.slug} className="bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
              <Link to={`/articles?category=${category.slug}`} className="block p-6">
                <div className="flex items-start space-x-4">
                  <div className="text-4xl flex-shrink-0">{category.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-xl font-bold text-slate-800 dark:text-white group-hover:text-brand-orange transition-colors">
                        {category.name}
                      </h2>
                      <span className="text-sm text-slate-500 dark:text-[#f5f5f5] bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full">
                        {category.count} makale
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-[#f5f5f5] leading-relaxed">
                      {category.description}
                    </p>
                    <div className="mt-4 flex items-center text-brand-orange text-sm font-medium group-hover:text-brand-orange/80 transition-colors">
                      Makaleleri Görüntüle
                      <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📂</div>
            <h3 className="text-2xl font-semibold text-slate-800 dark:text-white mb-2">
              Henüz Kategori Bulunmamaktadır
            </h3>
            <p className="text-slate-600 dark:text-[#f5f5f5]">
              Yakında kategoriler eklenecek ve içerikler organize edilecek.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;
