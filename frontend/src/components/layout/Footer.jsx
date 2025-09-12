import React from 'react';
import { FaHeart } from 'react-icons/fa';
import { useTheme } from '../../contexts/ThemeContext';
import './Footer.mobile.css';

const Footer = () => {
  const { theme } = useTheme();
  
  const isDark = theme === 'dark';
  
  return (
    <footer className="relative mt-16">
      {/* Main footer with theme-aware background and rounded top corners */}
      <div className={`footer-mobile-optimized ${isDark ? 'bg-[#0F0F0F] border-t border-[#E0D9C9]/20' : 'bg-gradient-to-br from-gray-50 to-gray-100 border-t border-gray-300'} px-6 sm:px-8 lg:px-8 xl:px-12 2xl:px-16 py-16 lg:py-20 xl:py-24`}>
        <div className="w-full mx-auto max-w-7xl">
          
          {/* Logo Section - Desktop: Combined Layout, Mobile: Original Centered */}
          <div className="hidden lg:flex items-end justify-between mb-16 lg:mb-20">
            {/* Left side: Logo and Site Text */}
            <div className="flex items-end gap-6">
              {/* Logo positioned at left - Desktop only */}
              <div className="flex-shrink-0">
                <img 
                  src={isDark ? "/footerlogo.png" : "/footerlogo2.png"}
                  alt="Openwall & Articles" 
                  className="h-16 sm:h-20 lg:h-24 select-none pointer-events-none"
                />
              </div>
              
              {/* Site Text - Desktop only */}
              <div className="flex-shrink-0 w-[280px]">
                <p className={`${isDark ? 'text-[#E0D9C9]' : 'text-gray-600'} text-sm leading-relaxed`}>
                  The Openwall Archive, tamamen açık kaynaklı kişisel bir bilgi arşividir. Farklı konularda çok sayıda kişisel makaleyi bir araya getirmek için kuruldu.
                </p>
              </div>
            </div>
            
            {/* Navigation Section - Desktop only - Right aligned */}
            <div className="flex gap-8 max-w-[320px]">
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
            </div>
          </div>

          {/* Mobile Layout - Original Centered Design */}
          <div className="lg:hidden">
            {/* Logo Section */}
            <div className="flex justify-center mb-16">
              <div className="text-center">
                <img 
                  src={isDark ? "/footerlogo.png" : "/footerlogo2.png"}
                  alt="Openwall & Articles" 
                  className="footer-logo-mobile h-24 sm:h-28 mb-4 select-none pointer-events-none"
                />
              </div>
            </div>

            {/* Navigation Links */}
            <div className="flex justify-center mb-16">
              <div className="footer-nav-mobile flex flex-wrap justify-center gap-8">
                <a href="/" className={`footer-nav-link-mobile ${isDark ? 'text-[#E0D9C9] hover:text-white' : 'text-gray-600 hover:text-gray-900'} text-base font-semibold uppercase tracking-wide transition-colors duration-200 hover:scale-105 transform`}>
                  Anasayfa
                </a>
                <a href="/articles" className={`footer-nav-link-mobile ${isDark ? 'text-[#E0D9C9] hover:text-white' : 'text-gray-600 hover:text-gray-900'} text-base font-semibold uppercase tracking-wide transition-colors duration-200 hover:scale-105 transform`}>
                  Makaleler
                </a>
                <a href="/videos" className={`footer-nav-link-mobile ${isDark ? 'text-[#E0D9C9] hover:text-white' : 'text-gray-600 hover:text-gray-900'} text-base font-semibold uppercase tracking-wide transition-colors duration-200 hover:scale-105 transform`}>
                  Videolar
                </a>
                <a href="/dictionary" className={`footer-nav-link-mobile ${isDark ? 'text-[#E0D9C9] hover:text-white' : 'text-gray-600 hover:text-gray-900'} text-base font-semibold uppercase tracking-wide transition-colors duration-200 hover:scale-105 transform`}>
                  Sözlük
                </a>
              </div>
            </div>
          </div>

          {/* Enhanced Copyright Section */}
          <div className="text-center">
            <div className={`footer-copyright-section-mobile ${isDark ? 'border-t border-[#E0D9C9]/20' : 'border-t border-gray-300'} pt-8`}>
              <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <span className={`footer-copyright-mobile ${isDark ? 'text-[#E0D9C9]' : 'text-gray-600'} text-sm`}>
                    The Openwall Archive © 2025. Tüm hakları saklıdır.
                  </span>
                  <a href="/about" className={`footer-link-mobile ${isDark ? 'text-[#E0D9C9] hover:text-white' : 'text-gray-600 hover:text-gray-900'} text-sm transition-colors duration-200`}>
                    Hakkımızda
                  </a>
                  <a href="/legal/disclaimer" className={`footer-link-mobile ${isDark ? 'text-[#E0D9C9] hover:text-white' : 'text-gray-600 hover:text-gray-900'} text-sm transition-colors duration-200`}>
                    Kullanım Hakları & Gizlilik politikası
                  </a>
                  <a href="/contact" className={`footer-link-mobile ${isDark ? 'text-[#E0D9C9] hover:text-white' : 'text-gray-600 hover:text-gray-900'} text-sm transition-colors duration-200`}>
                    İletişim
                  </a>
                  <div className="flex items-center space-x-3 social-icons-container">
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer" className={`footer-link-mobile ${isDark ? 'text-[#E0D9C9] hover:text-white' : 'text-gray-600 hover:text-gray-900'} text-sm transition-colors duration-200`}>
                      Github
                    </a>
                    <a href="https://x.com" target="_blank" rel="noopener noreferrer" className={`footer-link-mobile ${isDark ? 'text-[#E0D9C9] hover:text-white' : 'text-gray-600 hover:text-gray-900'} text-sm transition-colors duration-200`}>
                      X
                    </a>
                    <a href="https://reddit.com" target="_blank" rel="noopener noreferrer" className={`footer-link-mobile ${isDark ? 'text-[#E0D9C9] hover:text-white' : 'text-gray-600 hover:text-gray-900'} text-sm transition-colors duration-200`}>
                      Reddit
                    </a>
                    <a href="https://www.behance.net" target="_blank" rel="noopener noreferrer" className={`footer-link-mobile ${isDark ? 'text-[#E0D9C9] hover:text-white' : 'text-gray-600 hover:text-gray-900'} text-sm transition-colors duration-200`}>
                      Behance
                    </a>
                  </div>
                </div>
                
                <div className={`footer-location-mobile ${isDark ? 'text-[#E0D9C9]' : 'text-gray-600'} text-sm`}>
                  Ankara,Türkiye
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
