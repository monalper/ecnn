import React from 'react';
import { FaHeart } from 'react-icons/fa';
import { useTheme } from '../../contexts/ThemeContext';

const Footer = () => {
  const { theme } = useTheme();
  
  const isDark = theme === 'dark';
  
  return (
    <footer className="relative mt-16">
      {/* Main footer with theme-aware background and rounded top corners */}
      <div className={`${isDark ? 'bg-[#0F0F0F]' : 'bg-gradient-to-br from-gray-50 to-gray-100'} rounded-t-[40px] px-6 sm:px-8 lg:px-8 xl:px-12 2xl:px-16 py-16 lg:py-20 xl:py-24`}>
        <div className="w-full mx-auto max-w-7xl">
          
          {/* Logo Section with enhanced styling */}
          <div className="flex justify-center mb-16 lg:mb-20">
            <div className="text-center">
              <img 
                src={isDark ? "/footerlogo.png" : "/footerlogo2.png"}
                alt="Openwall & Articles" 
                className="h-20 sm:h-24 lg:h-28 mb-4 transition-transform hover:scale-105"
              />
            </div>
          </div>

          {/* Enhanced Navigation Links */}
          <div className="flex justify-center mb-16 lg:mb-20">
            <div className="flex flex-wrap justify-center gap-8 lg:gap-12">
              <a href="/" className={`${isDark ? 'text-[#E0D9C9] hover:text-white' : 'text-gray-600 hover:text-gray-900'} text-base font-semibold uppercase tracking-wide transition-colors duration-200 hover:scale-105 transform`}>
                Anasayfa
              </a>
              <a href="/articles" className={`${isDark ? 'text-[#E0D9C9] hover:text-white' : 'text-gray-600 hover:text-gray-900'} text-base font-semibold uppercase tracking-wide transition-colors duration-200 hover:scale-105 transform`}>
                Makaleler
              </a>
              <a href="/videos" className={`${isDark ? 'text-[#E0D9C9] hover:text-white' : 'text-gray-600 hover:text-gray-900'} text-base font-semibold uppercase tracking-wide transition-colors duration-200 hover:scale-105 transform`}>
                Videolar
              </a>
              <a href="/dictionary" className={`${isDark ? 'text-[#E0D9C9] hover:text-white' : 'text-gray-600 hover:text-gray-900'} text-base font-semibold uppercase tracking-wide transition-colors duration-200 hover:scale-105 transform`}>
                Sözlük
              </a>
              <a href="/about" className={`${isDark ? 'text-[#E0D9C9] hover:text-white' : 'text-gray-600 hover:text-gray-900'} text-base font-semibold uppercase tracking-wide transition-colors duration-200 hover:scale-105 transform`}>
                Hakkımızda
              </a>
              <a href="/legal/disclaimer" className={`${isDark ? 'text-[#E0D9C9] hover:text-white' : 'text-gray-600 hover:text-gray-900'} text-base font-semibold uppercase tracking-wide transition-colors duration-200 hover:scale-105 transform`}>
                Yasal Uyarı
              </a>
            </div>
          </div>

          {/* Enhanced Copyright Section */}
          <div className="text-center">
            <div className={`${isDark ? 'border-t border-[#E0D9C9]/20' : 'border-t border-gray-300'} pt-8`}>
              <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                <div className={`${isDark ? 'text-[#E0D9C9]' : 'text-gray-600'} text-sm`}>
                  <span>Openwall © 2025. Tüm hakları saklıdır. </span>
                  <span className="hidden sm:inline"></span>
                  <span className="block sm:inline"></span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`${isDark ? 'text-[#E0D9C9]' : 'text-gray-600'} text-sm`}>
                    
                  </span>
                  <span className={`${isDark ? 'text-[#E0D9C9]' : 'text-gray-600'} text-sm`}>
                    Ankara,Türkiye
                  </span>
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
