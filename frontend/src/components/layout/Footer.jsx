import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const Footer = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <footer className={`${isDark ? 'bg-[#1d1d1f]' : 'bg-[#f5f5f7]'} mt-20`}>
      <div className="max-w-[980px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Links Grid */}
        <div className="pt-12 pb-8 border-b border-gray-300/20">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 sm:gap-8 lg:gap-12">
            
            {/* Column 1 - İçerik */}
            <div className="space-y-3">
              <h3 className={`${isDark ? 'text-white' : 'text-[#1d1d1f]'} text-[12px] font-semibold mb-2`}>
                İçerik
              </h3>
              <a href="/" className={`block ${isDark ? 'text-[#a1a1a6] hover:text-white' : 'text-[#424245] hover:text-[#06c]'} text-[12px] leading-relaxed transition-colors duration-200`}>
                Anasayfa
              </a>
              <a href="/articles" className={`block ${isDark ? 'text-[#a1a1a6] hover:text-white' : 'text-[#424245] hover:text-[#06c]'} text-[12px] leading-relaxed transition-colors duration-200`}>
                Makaleler
              </a>
              <a href="/videos" className={`block ${isDark ? 'text-[#a1a1a6] hover:text-white' : 'text-[#424245] hover:text-[#06c]'} text-[12px] leading-relaxed transition-colors duration-200`}>
                Videolar
              </a>
              <a href="/gallery" className={`block ${isDark ? 'text-[#a1a1a6] hover:text-white' : 'text-[#424245] hover:text-[#06c]'} text-[12px] leading-relaxed transition-colors duration-200`}>
                Galeri
              </a>
              <a href="/dictionary" className={`block ${isDark ? 'text-[#a1a1a6] hover:text-white' : 'text-[#424245] hover:text-[#06c]'} text-[12px] leading-relaxed transition-colors duration-200`}>
                Sözlük
              </a>
            </div>

            {/* Column 2 - Kategoriler */}
            <div className="space-y-3">
              <h3 className={`${isDark ? 'text-white' : 'text-[#1d1d1f]'} text-[12px] font-semibold mb-2`}>
                Kategoriler
              </h3>
              <a href="/categories" className={`block ${isDark ? 'text-[#a1a1a6] hover:text-white' : 'text-[#424245] hover:text-[#06c]'} text-[12px] leading-relaxed transition-colors duration-200`}>
                Tümü
              </a>
              <a href="/highlights" className={`block ${isDark ? 'text-[#a1a1a6] hover:text-white' : 'text-[#424245] hover:text-[#06c]'} text-[12px] leading-relaxed transition-colors duration-200`}>
                Öne Çıkanlar
              </a>
              <a href="/climate-change" className={`block ${isDark ? 'text-[#a1a1a6] hover:text-white' : 'text-[#424245] hover:text-[#06c]'} text-[12px] leading-relaxed transition-colors duration-200`}>
                İklim Değişikliği
              </a>
            </div>

            {/* Column 3 - Astronomi */}
            <div className="space-y-3">
              <h3 className={`${isDark ? 'text-white' : 'text-[#1d1d1f]'} text-[12px] font-semibold mb-2`}>
                Astronomi
              </h3>
              <a href="/apod" className={`block ${isDark ? 'text-[#a1a1a6] hover:text-white' : 'text-[#424245] hover:text-[#06c]'} text-[12px] leading-relaxed transition-colors duration-200`}>
                NASA APOD
              </a>
              <a href="/moon" className={`block ${isDark ? 'text-[#a1a1a6] hover:text-white' : 'text-[#424245] hover:text-[#06c]'} text-[12px] leading-relaxed transition-colors duration-200`}>
                Ay Evreleri
              </a>
              <a href="/asteroid" className={`block ${isDark ? 'text-[#a1a1a6] hover:text-white' : 'text-[#424245] hover:text-[#06c]'} text-[12px] leading-relaxed transition-colors duration-200`}>
                Asteroid İzleme
              </a>
            </div>

            {/* Column 4 - Hakkında */}
            <div className="space-y-3">
              <h3 className={`${isDark ? 'text-white' : 'text-[#1d1d1f]'} text-[12px] font-semibold mb-2`}>
                Hakkında
              </h3>
              <a href="/about" className={`block ${isDark ? 'text-[#a1a1a6] hover:text-white' : 'text-[#424245] hover:text-[#06c]'} text-[12px] leading-relaxed transition-colors duration-200`}>
                Hakkımızda
              </a>
              <a href="/legal/disclaimer" className={`block ${isDark ? 'text-[#a1a1a6] hover:text-white' : 'text-[#424245] hover:text-[#06c]'} text-[12px] leading-relaxed transition-colors duration-200`}>
                Gizlilik Politikası
              </a>
              <a href="/contact" className={`block ${isDark ? 'text-[#a1a1a6] hover:text-white' : 'text-[#424245] hover:text-[#06c]'} text-[12px] leading-relaxed transition-colors duration-200`}>
                İletişim
              </a>
            </div>

            {/* Column 5 - Sosyal */}
            <div className="space-y-3">
              <h3 className={`${isDark ? 'text-white' : 'text-[#1d1d1f]'} text-[12px] font-semibold mb-2`}>
                Sosyal Medya
              </h3>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={`block ${isDark ? 'text-[#a1a1a6] hover:text-white' : 'text-[#424245] hover:text-[#06c]'} text-[12px] leading-relaxed transition-colors duration-200`}
              >
                GitHub
              </a>
              <a 
                href="https://x.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={`block ${isDark ? 'text-[#a1a1a6] hover:text-white' : 'text-[#424245] hover:text-[#06c]'} text-[12px] leading-relaxed transition-colors duration-200`}
              >
                X (Twitter)
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="py-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
              <p className={`${isDark ? 'text-[#a1a1a6]' : 'text-[#86868b]'} text-[12px]`}>
                © 2025 The Openwall Archive
              </p>
              <div className="hidden sm:block w-px h-3 bg-gray-300/20"></div>
              <div className="flex items-center gap-3 flex-wrap">
                <a 
                  href="/legal/disclaimer" 
                  className={`${isDark ? 'text-[#a1a1a6] hover:text-white' : 'text-[#86868b] hover:text-[#06c]'} text-[12px] transition-colors duration-200`}
                >
                  Gizlilik
                </a>
                <a 
                  href="/legal/terms" 
                  className={`${isDark ? 'text-[#a1a1a6] hover:text-white' : 'text-[#86868b] hover:text-[#06c]'} text-[12px] transition-colors duration-200`}
                >
                  Kullanım Şartları
                </a>
                <a 
                  href="/sitemap.xml" 
                  className={`${isDark ? 'text-[#a1a1a6] hover:text-white' : 'text-[#86868b] hover:text-[#06c]'} text-[12px] transition-colors duration-200`}
                >
                  Site Haritası
                </a>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <svg className={`w-4 h-4 ${isDark ? 'text-[#a1a1a6]' : 'text-[#86868b]'}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="" clipRule="evenodd" />
              </svg>
              <span className={`${isDark ? 'text-[#a1a1a6]' : 'text-[#86868b]'} text-[12px]`}>
                Türkiye
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
