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
      <div className={`footer-mobile-optimized ${isDark ? 'bg-[#0F0F0F]' : 'bg-gradient-to-br from-gray-50 to-gray-100'} rounded-t-[40px] px-6 sm:px-8 lg:px-8 xl:px-12 2xl:px-16 py-16 lg:py-20 xl:py-24`}>
        <div className="w-full mx-auto max-w-7xl">
          
          {/* Logo Section with enhanced styling */}
          <div className="flex justify-center mb-16 lg:mb-20">
            <div className="text-center">
              <img 
                src={isDark ? "/footerlogo.png" : "/footerlogo2.png"}
                alt="Openwall & Articles" 
                className="footer-logo-mobile h-20 sm:h-24 lg:h-28 mb-4 select-none pointer-events-none"
              />
            </div>
          </div>

          {/* Enhanced Navigation Links */}
          <div className="flex justify-center mb-16 lg:mb-20">
            <div className="footer-nav-mobile flex flex-wrap justify-center gap-8 lg:gap-12">
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

          {/* Enhanced Copyright Section */}
          <div className="text-center">
            <div className={`footer-copyright-section-mobile ${isDark ? 'border-t border-[#E0D9C9]/20' : 'border-t border-gray-300'} pt-8`}>
              <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-2">
                  <span className={`footer-copyright-mobile ${isDark ? 'text-[#E0D9C9]' : 'text-gray-600'} text-sm`}>
                    Openwall © 2025. Tüm hakları saklıdır.
                  </span>
                  <span className={`${isDark ? 'text-[#E0D9C9]' : 'text-gray-600'} text-sm`}>
                    •
                  </span>
                  <a href="/about" className={`footer-link-mobile ${isDark ? 'text-[#E0D9C9] hover:text-white' : 'text-gray-600 hover:text-gray-900'} text-sm transition-colors duration-200`}>
                    Hakkımızda
                  </a>
                  <span className={`${isDark ? 'text-[#E0D9C9]' : 'text-gray-600'} text-sm`}>
                    •
                  </span>
                  <a href="/legal/disclaimer" className={`footer-link-mobile ${isDark ? 'text-[#E0D9C9] hover:text-white' : 'text-gray-600 hover:text-gray-900'} text-sm transition-colors duration-200`}>
                    Kullanım Hakları & Gizlilik politikası
                  </a>
                  <span className={`${isDark ? 'text-[#E0D9C9]' : 'text-gray-600'} text-sm`}>
                    •
                  </span>
                  <a href="/contact" className={`footer-link-mobile ${isDark ? 'text-[#E0D9C9] hover:text-white' : 'text-gray-600 hover:text-gray-900'} text-sm transition-colors duration-200`}>
                    İletişim
                  </a>
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
