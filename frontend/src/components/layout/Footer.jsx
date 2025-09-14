import React from 'react';
import { FaHeart } from 'react-icons/fa';
import { useTheme } from '../../contexts/ThemeContext';

const Footer = () => {
  const { theme } = useTheme();
  
  const isDark = theme === 'dark';
  
  return (
    <footer className="relative mt-16">
      {/* Main footer with theme-aware background */}
      <div className={`${isDark ? 'bg-[#0F0F0F] border-t border-[#E0D9C9]/20' : 'bg-gradient-to-br from-gray-50 to-gray-100 border-t border-gray-300'} px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8 sm:py-12 lg:py-16 xl:py-20`}>
        <div className="w-full mx-auto max-w-7xl">
          
          {/* Main Footer Content - Responsive Layout */}
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between mb-8 lg:mb-12 gap-8 lg:gap-12">
            
            {/* Left side: Logo and Site Text */}
            <div className="flex flex-col sm:flex-row lg:flex-row items-center lg:items-end gap-4 lg:gap-6 w-full lg:w-auto">
              {/* Logo */}
              <div className="flex-shrink-0">
                <img 
                  src={isDark ? "/footerlogo.png" : "/footerlogo2.png"}
                  alt="Openwall & Articles" 
                  className="h-16 sm:h-20 lg:h-20 xl:h-24 select-none pointer-events-none"
                />
              </div>
              
              {/* Site Text - Hidden on very small screens, shown on sm and up */}
              <div className="hidden sm:block flex-shrink-0 lg:w-[280px]">
                <p className={`${isDark ? 'text-[#E0D9C9]' : 'text-gray-600'} text-xs sm:text-sm leading-relaxed`}>
                  The Openwall Archive, tamamen açık kaynaklı kişisel bir bilgi arşividir. Farklı konularda çok sayıda kişisel makaleyi bir araya getirmek için kuruldu.
                </p>
              </div>
            </div>
            
            {/* Navigation Section - Responsive Grid */}
            <div className="w-full lg:w-auto">
              {/* Mobile Layout - Horizontal Navigation without Headers */}
              <div className="lg:hidden">
                <div className="text-center">
                  <div className="flex flex-wrap justify-center gap-3">
                    <a href="/" className={`${isDark ? 'text-[#E0D9C9] hover:text-white' : 'text-gray-600 hover:text-gray-900'} text-sm font-medium transition-colors duration-200 px-3 py-2 rounded-md hover:bg-opacity-10 ${isDark ? 'hover:bg-white' : 'hover:bg-gray-900'}`}>
                      Anasayfa
                    </a>
                    <a href="/articles" className={`${isDark ? 'text-[#E0D9C9] hover:text-white' : 'text-gray-600 hover:text-gray-900'} text-sm font-medium transition-colors duration-200 px-3 py-2 rounded-md hover:bg-opacity-10 ${isDark ? 'hover:bg-white' : 'hover:bg-gray-900'}`}>
                      Makaleler
                    </a>
                    <a href="/videos" className={`${isDark ? 'text-[#E0D9C9] hover:text-white' : 'text-gray-600 hover:text-gray-900'} text-sm font-medium transition-colors duration-200 px-3 py-2 rounded-md hover:bg-opacity-10 ${isDark ? 'hover:bg-white' : 'hover:bg-gray-900'}`}>
                      Videolar
                    </a>
                    <a href="/gallery" className={`${isDark ? 'text-[#E0D9C9] hover:text-white' : 'text-gray-600 hover:text-gray-900'} text-sm font-medium transition-colors duration-200 px-3 py-2 rounded-md hover:bg-opacity-10 ${isDark ? 'hover:bg-white' : 'hover:bg-gray-900'}`}>
                      Galeri
                    </a>
                    <a href="/categories" className={`${isDark ? 'text-[#E0D9C9] hover:text-white' : 'text-gray-600 hover:text-gray-900'} text-sm font-medium transition-colors duration-200 px-3 py-2 rounded-md hover:bg-opacity-10 ${isDark ? 'hover:bg-white' : 'hover:bg-gray-900'}`}>
                      Kategoriler
                    </a>
                    <a href="/dictionary" className={`${isDark ? 'text-[#E0D9C9] hover:text-white' : 'text-gray-600 hover:text-gray-900'} text-sm font-medium transition-colors duration-200 px-3 py-2 rounded-md hover:bg-opacity-10 ${isDark ? 'hover:bg-white' : 'hover:bg-gray-900'}`}>
                      Sözlük
                    </a>
                    <a href="/highlights" className={`${isDark ? 'text-[#E0D9C9] hover:text-white' : 'text-gray-600 hover:text-gray-900'} text-sm font-medium transition-colors duration-200 px-3 py-2 rounded-md hover:bg-opacity-10 ${isDark ? 'hover:bg-white' : 'hover:bg-gray-900'}`}>
                      Öne Çıkanlar
                    </a>
                    <a href="/climate-change" className={`${isDark ? 'text-[#E0D9C9] hover:text-white' : 'text-gray-600 hover:text-gray-900'} text-sm font-medium transition-colors duration-200 px-3 py-2 rounded-md hover:bg-opacity-10 ${isDark ? 'hover:bg-white' : 'hover:bg-gray-900'}`}>
                      İklim Değişikliği
                    </a>
                    <a href="/apod" className={`${isDark ? 'text-[#E0D9C9] hover:text-white' : 'text-gray-600 hover:text-gray-900'} text-sm font-medium transition-colors duration-200 px-3 py-2 rounded-md hover:bg-opacity-10 ${isDark ? 'hover:bg-white' : 'hover:bg-gray-900'}`}>
                      Nasa Apod
                    </a>
                    <a href="/moon" className={`${isDark ? 'text-[#E0D9C9] hover:text-white' : 'text-gray-600 hover:text-gray-900'} text-sm font-medium transition-colors duration-200 px-3 py-2 rounded-md hover:bg-opacity-10 ${isDark ? 'hover:bg-white' : 'hover:bg-gray-900'}`}>
                      Ay Evreleri
                    </a>
                    <a href="/asteroid" className={`${isDark ? 'text-[#E0D9C9] hover:text-white' : 'text-gray-600 hover:text-gray-900'} text-sm font-medium transition-colors duration-200 px-3 py-2 rounded-md hover:bg-opacity-10 ${isDark ? 'hover:bg-white' : 'hover:bg-gray-900'}`}>
                      Asteroid İzleme
                    </a>
                  </div>
                </div>
              </div>

              {/* Desktop Layout - Original Vertical Columns */}
              <div className="hidden lg:flex lg:gap-6 xl:gap-8 max-w-[480px]">
              {/* Column 1: Ana Sayfalar */}
              <div className="flex flex-col">
                <h4 className={`${isDark ? 'text-[#E0D9C9]' : 'text-gray-800'} text-xs font-semibold uppercase tracking-wide mb-2`}>
                  Ana Sayfalar
                </h4>
                <div className="flex flex-col gap-1">
                  <a href="/" className={`${isDark ? 'text-[#E0D9C9] hover:text-white' : 'text-gray-600 hover:text-gray-900'} text-xs font-medium transition-colors duration-200`}>
                    Anasayfa
                  </a>
                  <a href="/articles" className={`${isDark ? 'text-[#E0D9C9] hover:text-white' : 'text-gray-600 hover:text-gray-900'} text-xs font-medium transition-colors duration-200`}>
                    Makaleler
                  </a>
                  <a href="/videos" className={`${isDark ? 'text-[#E0D9C9] hover:text-white' : 'text-gray-600 hover:text-gray-900'} text-xs font-medium transition-colors duration-200`}>
                    Videolar
                  </a>
                  <a href="/gallery" className={`${isDark ? 'text-[#E0D9C9] hover:text-white' : 'text-gray-600 hover:text-gray-900'} text-xs font-medium transition-colors duration-200`}>
                    Galeri
                  </a>
                </div>
              </div>

              {/* Column 2: Kategoriler */}
              <div className="flex flex-col">
                <h4 className={`${isDark ? 'text-[#E0D9C9]' : 'text-gray-800'} text-xs font-semibold uppercase tracking-wide mb-2`}>
                  Kategoriler
                </h4>
                <div className="flex flex-col gap-1">
                  <a href="/categories" className={`${isDark ? 'text-[#E0D9C9] hover:text-white' : 'text-gray-600 hover:text-gray-900'} text-xs font-medium transition-colors duration-200`}>
                    Tüm Kategoriler
                  </a>
                  <a href="/dictionary" className={`${isDark ? 'text-[#E0D9C9] hover:text-white' : 'text-gray-600 hover:text-gray-900'} text-xs font-medium transition-colors duration-200`}>
                    Sözlük
                  </a>
                  <a href="/highlights" className={`${isDark ? 'text-[#E0D9C9] hover:text-white' : 'text-gray-600 hover:text-gray-900'} text-xs font-medium transition-colors duration-200`}>
                    Öne Çıkanlar
                  </a>
                  <a href="/climate-change" className={`${isDark ? 'text-[#E0D9C9] hover:text-white' : 'text-gray-600 hover:text-gray-900'} text-xs font-medium transition-colors duration-200`}>
                    İklim Değişikliği
                  </a>
                </div>
              </div>

              {/* Column 3: Astronomi */}
              <div className="flex flex-col">
                <h4 className={`${isDark ? 'text-[#E0D9C9]' : 'text-gray-800'} text-xs font-semibold uppercase tracking-wide mb-2`}>
                  Astronomi
                </h4>
                <div className="flex flex-col gap-1">
                  <a href="/apod" className={`${isDark ? 'text-[#E0D9C9] hover:text-white' : 'text-gray-600 hover:text-gray-900'} text-xs font-medium transition-colors duration-200`}>
                    Nasa Apod
                  </a>
                  <a href="/moon" className={`${isDark ? 'text-[#E0D9C9] hover:text-white' : 'text-gray-600 hover:text-gray-900'} text-xs font-medium transition-colors duration-200`}>
                    Ay Evreleri
                  </a>
                  <a href="/asteroid" className={`${isDark ? 'text-[#E0D9C9] hover:text-white' : 'text-gray-600 hover:text-gray-900'} text-xs font-medium transition-colors duration-200`}>
                    Asteroid İzleme
                  </a>
                </div>
              </div>
              </div>
            </div>
          </div>

          {/* Copyright Section */}
          <div className={`${isDark ? 'border-t border-[#E0D9C9]/20' : 'border-t border-gray-300'} pt-6 sm:pt-8`}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
              
              {/* Left side: Copyright and Links */}
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
                <span className={`${isDark ? 'text-[#E0D9C9]' : 'text-gray-600'} text-xs sm:text-sm`}>
                    The Openwall Archive © 2025. Tüm hakları saklıdır.
                  </span>
                
                {/* Links - Responsive Layout */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-4">
                  <a href="/about" className={`${isDark ? 'text-[#E0D9C9] hover:text-white' : 'text-gray-600 hover:text-gray-900'} text-xs sm:text-sm transition-colors duration-200`}>
                    Hakkımızda
                  </a>
                  <a href="/legal/disclaimer" className={`${isDark ? 'text-[#E0D9C9] hover:text-white' : 'text-gray-600 hover:text-gray-900'} text-xs sm:text-sm transition-colors duration-200`}>
                    Kullanım Hakları & Gizlilik politikası
                  </a>
                  <a href="/contact" className={`${isDark ? 'text-[#E0D9C9] hover:text-white' : 'text-gray-600 hover:text-gray-900'} text-xs sm:text-sm transition-colors duration-200`}>
                    İletişim
                  </a>
                </div>
              </div>
              
              {/* Right side: Social Links and Location */}
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
                {/* Social Icons */}
                <div className="flex items-center gap-3">
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer" className={`${isDark ? 'text-[#E0D9C9] hover:text-white' : 'text-gray-600 hover:text-gray-900'} text-xs sm:text-sm transition-colors duration-200`}>
                      Github
                    </a>
                  <a href="https://x.com" target="_blank" rel="noopener noreferrer" className={`${isDark ? 'text-[#E0D9C9] hover:text-white' : 'text-gray-600 hover:text-gray-900'} text-xs sm:text-sm transition-colors duration-200`}>
                      X
                    </a>
                  <a href="https://reddit.com" target="_blank" rel="noopener noreferrer" className={`${isDark ? 'text-[#E0D9C9] hover:text-white' : 'text-gray-600 hover:text-gray-900'} text-xs sm:text-sm transition-colors duration-200`}>
                      Reddit
                    </a>
                  <a href="https://www.behance.net" target="_blank" rel="noopener noreferrer" className={`${isDark ? 'text-[#E0D9C9] hover:text-white' : 'text-gray-600 hover:text-gray-900'} text-xs sm:text-sm transition-colors duration-200`}>
                      Behance
                    </a>
                </div>
                
                {/* Location */}
                <div className={`${isDark ? 'text-[#E0D9C9]' : 'text-gray-600'} text-xs sm:text-sm`}>
                  Ankara, Türkiye
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
