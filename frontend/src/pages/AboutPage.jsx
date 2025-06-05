// ECNN - Kopya/frontend/src/pages/AboutPage.jsx (Yeni Dosya)
import React from 'react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-site-background">
      {/* Hero Section with Grid Background */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative h-[340px] md:h-[400px] flex items-center justify-center bg-[#101624] rounded-3xl overflow-hidden">
          {/* Grid background */}
          <div className="absolute inset-0 z-0">
            <svg width="100%" height="100%">
              <defs>
                <pattern
                  id="grid"
                  width="60"
                  height="60"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 60 0 L 0 0 0 60"
                    fill="none"
                    stroke="#2a3140"
                    strokeWidth="2"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          {/* Centered text */}
          <div className="relative z-10 text-center w-full">
            <h1 className="text-white text-5xl md:text-6xl font-bold mb-4">
              <span className="font-['Lora'] italic">About</span>
            </h1>
            <p className="text-slate-300 text-xl max-w-2xl mx-auto">
              Write anything.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Story Section */}
          <div className="mb-16">
            <h2 className="text-[32px] font-extrabold text-[#181818] mb-6">Hikayemiz</h2>
            <p className="text-[15px] text-[#7b7b7b] leading-relaxed">
              ECNN, 2024 yılında kurulmuş, dijital çağın gereksinimlerini karşılayan modern bir haber platformudur. 
              Amacımız, okuyucularımıza hızlı, doğru ve tarafsız haber ulaştırmaktır. Teknoloji, ekonomi, 
              siyaset ve kültür-sanat alanlarında uzman kadromuzla, güncel gelişmeleri derinlemesine 
              analiz ederek sunuyoruz.
            </p>
          </div>

          {/* Mission Section */}
          <div className="mb-16">
            <h2 className="text-[32px] font-extrabold text-[#181818] mb-6">Misyonumuz</h2>
            <p className="text-[15px] text-[#7b7b7b] leading-relaxed">
              ECNN olarak, toplumun her kesimine ulaşabilen, anlaşılır ve güvenilir haber kaynağı 
              olmayı hedefliyoruz. Dijital dünyanın sunduğu imkanları kullanarak, okuyucularımıza 
              interaktif ve zengin içerikli bir haber deneyimi sunuyoruz. Veri gazeteciliği ve 
              görsel hikaye anlatımı gibi modern gazetecilik tekniklerini kullanarak, haberleri 
              daha etkili bir şekilde aktarmayı amaçlıyoruz.
            </p>
          </div>

          {/* Values Section */}
          <div className="mb-16">
            <h2 className="text-[32px] font-extrabold text-[#181818] mb-6">Değerlerimiz</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl">
                <h3 className="text-[20px] font-extrabold text-[#181818] mb-3">Doğruluk</h3>
                <p className="text-[15px] text-[#7b7b7b]">Her haberi titizlikle araştırıyor, doğruluğunu teyit ediyoruz.</p>
              </div>
              <div className="bg-white p-6 rounded-xl">
                <h3 className="text-[20px] font-extrabold text-[#181818] mb-3">Tarafsızlık</h3>
                <p className="text-[15px] text-[#7b7b7b]">Olayları tüm yönleriyle, önyargısız ele alıyoruz.</p>
              </div>
              <div className="bg-white p-6 rounded-xl">
                <h3 className="text-[20px] font-extrabold text-[#181818] mb-3">Şeffaflık</h3>
                <p className="text-[15px] text-[#7b7b7b]">Kaynaklarımızı ve haber süreçlerimizi açıkça paylaşıyoruz.</p>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div>
            <h2 className="text-[32px] font-extrabold text-[#181818] mb-6">İletişim</h2>
            <div className="bg-white p-8 rounded-xl">
              <p className="text-[15px] text-[#7b7b7b] mb-6">
                Yazı önerileriniz, geri bildirimleriniz veya iş birliği talepleriniz için bizimle iletişime geçebilirsiniz.
              </p>
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-1">
                  <a 
                    href="mailto:info@monologed.com" 
                    className="inline-flex items-center gap-2 text-[#181818] hover:text-brand-orange transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    info@monologed.com
                  </a>
                </div>
                <div className="flex gap-4">
                  <a href="https://twitter.com/ecnn" target="_blank" rel="noopener noreferrer" className="text-[#7b7b7b] hover:text-brand-orange transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 5.924c-.793.352-1.645.59-2.54.698a4.48 4.48 0 0 0 1.963-2.475 8.94 8.94 0 0 1-2.828 1.082A4.48 4.48 0 0 0 16.11 4c-2.488 0-4.507 2.02-4.507 4.507 0 .353.04.697.117 1.026C7.728 9.38 4.1 7.6 1.67 4.905c-.388.666-.61 1.44-.61 2.263 0 1.563.796 2.942 2.008 3.75-.74-.023-1.436-.227-2.045-.567v.057c0 2.185 1.555 4.008 3.623 4.426-.378.104-.777.16-1.188.16-.29 0-.57-.028-.844-.08.57 1.78 2.223 3.078 4.183 3.113A9.01 9.01 0 0 1 2 19.54a12.73 12.73 0 0 0 6.89 2.02c8.266 0 12.79-6.844 12.79-12.78 0-.195-.004-.39-.013-.583A9.22 9.22 0 0 0 24 4.59a8.94 8.94 0 0 1-2.54.698z"/></svg>
                  </a>
                  <a href="https://instagram.com/ecnn" target="_blank" rel="noopener noreferrer" className="text-[#7b7b7b] hover:text-brand-orange transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;

