// ECNN - Kopya/frontend/src/pages/AboutPage.jsx (Yeni Dosya)
import React from 'react';
import MetaTags from '../components/seo/MetaTags';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-site-background dark:bg-slate-900">
      <MetaTags
        title="Hakkımızda - OpenWall"
        description="OpenWall, çeşitli alanlarda kaliteli içerikler sunan kapsamlı bir platformdur. Teknoloji, felsefe, sanat, spor ve daha fazlası."
        keywords="hakkımızda, openwall, platform, içerik, makale, blog, teknoloji, felsefe, sanat, spor"
      />
      
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
              <span className="font-['Lora'] italic">Hakkımızda</span>
            </h1>
            <p className="text-slate-300 text-xl max-w-2xl mx-auto">
              Çeşitli alanlarda kaliteli içerikler sunan kapsamlı platform
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          {/* Left: Image */}
          <div className="rounded-3xl overflow-hidden bg-slate-200 flex items-center justify-center min-h-[340px]">
            <img
              src="https://i.pinimg.com/736x/54/9b/d2/549bd2a71fd2ab2c95d56b8887865b92.jpg"
              alt="OpenWall Platform"
              className="w-full h-full object-cover object-center"
              style={{ minHeight: '340px', maxHeight: '500px' }}
            />
          </div>

          {/* Right: About Content with Grid Background */}
          <div className="relative bg-[#101624] rounded-3xl overflow-hidden flex flex-col justify-center border-2 border-brand-orange/20">
            {/* About Content */}
            <div className="relative z-10 p-8 md:p-12 flex flex-col h-full justify-center">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">
                OpenWall Hakkında
              </h2>
              
              <div className="space-y-6 text-slate-300 text-[15px] leading-relaxed">
                <p>
                  OpenWall, teknoloji, felsefe, sanat, spor, siyaset, ekonomi, sağlık, eğitim, çevre, sosyoloji, psikoloji, din, müzik, sinema, seyahat ve yemek gibi çeşitli alanlarda kaliteli içerikler sunan kapsamlı bir platformdur.
                </p>
                
                <p>
                  Amacımız, okuyucularımıza farklı konularda derinlemesine analizler, güncel haberler ve ilgi çekici içerikler sunarak bilgiye kolay erişim sağlamaktır.
                </p>
                
                <p>
                  Uzman yazarlarımız ve editörlerimiz, her alanda güvenilir, doğru ve güncel bilgiler sunmaya odaklanmıştır. Platformumuz, okuyucuların ilgi alanlarına göre içerikleri keşfetmelerine olanak tanır.
                </p>
              </div>

              {/* Platform Features */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-white/10 rounded-lg">
                  <div className="text-2xl mb-2">📚</div>
                  <h3 className="text-white font-semibold text-sm">Kapsamlı İçerik</h3>
                  <p className="text-slate-400 text-xs">16 farklı kategoride içerik</p>
                </div>
                <div className="text-center p-4 bg-white/10 rounded-lg">
                  <div className="text-2xl mb-2">🎯</div>
                  <h3 className="text-white font-semibold text-sm">Kaliteli Yazılar</h3>
                  <p className="text-slate-400 text-xs">Uzman yazarlar tarafından</p>
                </div>
                <div className="text-center p-4 bg-white/10 rounded-lg">
                  <div className="text-2xl mb-2">⚡</div>
                  <h3 className="text-white font-semibold text-sm">Güncel Haberler</h3>
                  <p className="text-slate-400 text-xs">Sürekli güncellenen içerik</p>
                </div>
                <div className="text-center p-4 bg-white/10 rounded-lg">
                  <div className="text-2xl mb-2">🔍</div>
                  <h3 className="text-white font-semibold text-sm">Kolay Erişim</h3>
                  <p className="text-slate-400 text-xs">Hızlı arama ve filtreleme</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-16">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-8 text-center">
              İletişim
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left: Info */}
              <div className="space-y-6">
                <p className="text-slate-600 dark:text-slate-400 text-[15px] leading-relaxed">
                  Yazı önerileriniz, geri bildirimleriniz veya işbirliği talepleriniz için bizimle iletişime geçebilirsiniz.
                </p>
                <div className="space-y-4">
                  <a 
                    href="mailto:info@openwall.com" 
                    className="inline-block text-brand-orange hover:text-brand-orange/80 transition-colors text-lg font-medium"
                  >
                    info@openwall.com
                  </a>
                  <div className="flex gap-6">
                    <a 
                      href="https://twitter.com/OpenWall" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-slate-600 dark:text-slate-400 hover:text-brand-orange transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22.46 5.924c-.793.352-1.645.59-2.54.698a4.48 4.48 0 0 0 1.963-2.475 8.94 8.94 0 0 1-2.828 1.082A4.48 4.48 0 0 0 16.11 4c-2.488 0-4.507 2.02-4.507 4.507 0 .353.04.697.117 1.026C7.728 9.38 4.1 7.6 1.67 4.905c-.388.666-.61 1.44-.61 2.263 0 1.563.796 2.942 2.008 3.75-.74-.023-1.436-.227-2.045-.567v.057c0 2.185 1.555 4.008 3.623 4.426-.378.104-.777.16-1.188.16-.29 0-.57-.028-.844-.08.57 1.78 2.223 3.078 4.183 3.113A9.01 9.01 0 0 1 2 19.54a12.73 12.73 0 0 0 6.89 2.02c8.266 0 12.79-6.844 12.79-12.78 0-.195-.004-.39-.013-.583A9.22 9.22 0 0 0 24 4.59a8.94 8.94 0 0 1-2.54.698z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
              {/* Right: Form */}
              <div className="flex items-center justify-center">
                <form className="space-y-6 w-full max-w-xs mx-auto">
                  <div>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-800 dark:text-slate-200 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-orange focus:border-brand-orange"
                      placeholder="Adınız"
                    />
                  </div>
                  <div>
                    <input 
                      type="email" 
                      className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-800 dark:text-slate-200 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-orange focus:border-brand-orange"
                      placeholder="E-posta adresiniz"
                    />
                  </div>
                  <div>
                    <textarea 
                      className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-800 dark:text-slate-200 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-orange focus:border-brand-orange h-32"
                      placeholder="Mesajınız"
                    ></textarea>
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-brand-orange text-white py-3 px-6 rounded-lg hover:bg-brand-orange/90 transition-colors"
                  >
                    Gönder
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;

