// ECNN - Kopya/frontend/src/components/layout/Header.jsx
import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { RxCross1 } from 'react-icons/rx';
import './lora-font-import';

const Header = ({ scrollPercent, customTitle }) => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const { theme, toggleTheme } = useTheme();

  return (
    <header 
      className="header-bg border-b border-gray-200 dark:border-white/20 fixed top-0 left-0 right-0 z-50 h-12 md:h-16 transition-all duration-300"
      onMouseEnter={() => {
        // Only enable hover effect on desktop (md and larger screens)
        if (window.innerWidth >= 768) {
          setIsHovered(true);
        }
      }}
      onMouseLeave={() => {
        // Only enable hover effect on desktop (md and larger screens)
        if (window.innerWidth >= 768) {
          setIsHovered(false);
        }
      }}
    >
      {/* Sitelinks için semantic navigation - Google için görünür ama kullanıcı için gizli */}
      <nav aria-label="Ana site navigasyonu" className="sr-only">
        <ul>
          <li><a href="https://openwall.com.tr/articles">Makaleler</a></li>
          <li><a href="https://openwall.com.tr/categories">Kategoriler</a></li>
          <li><a href="https://openwall.com.tr/highlights">Öne Çıkanlar</a></li>
          <li><a href="https://openwall.com.tr/gallery">Galeri</a></li>
          <li><a href="https://openwall.com.tr/videos">Videolar</a></li>
          <li><a href="https://openwall.com.tr/apod">Nasa Apod</a></li>
          <li><a href="https://openwall.com.tr/dictionary">Sözlük</a></li>
          <li><a href="https://openwall.com.tr/about">Hakkımızda</a></li>
        </ul>
      </nav>
      
      <div className="px-4 sm:px-6 lg:px-8 flex items-center justify-between h-full relative">
        {/* Navigation Links - Hidden by default, visible on hover in center - Desktop only */}
        <div className={`absolute inset-0 hidden md:flex items-center justify-center transition-opacity duration-300 z-50 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <nav className="flex items-center space-x-6">
            <Link 
              to="/" 
              className={`header-nav-link text-sm tracking-wide font-medium transition-colors ${
                location.pathname === '/' 
                  ? 'text-gray-900 dark:text-white opacity-100' 
                  : 'text-text-muted dark:text-text-muted opacity-70 hover:text-gray-900 dark:hover:text-white hover:opacity-100'
              }`}
            >
              Ana Sayfa
            </Link>
            <Link 
              to="/articles" 
              className={`header-nav-link text-sm tracking-wide font-medium transition-colors ${
                location.pathname === '/articles' 
                  ? 'text-gray-900 dark:text-white opacity-100' 
                  : 'text-text-muted dark:text-text-muted opacity-70 hover:text-gray-900 dark:hover:text-white hover:opacity-100'
              }`}
            >
              Makaleler
            </Link>
            <Link 
              to="/videos" 
              className={`header-nav-link text-sm tracking-wide font-medium transition-colors ${
                location.pathname === '/videos' 
                  ? 'text-gray-900 dark:text-white opacity-100' 
                  : 'text-text-muted dark:text-text-muted opacity-70 hover:text-gray-900 dark:hover:text-white hover:opacity-100'
              }`}
            >
              Videolar
            </Link>
            <Link 
              to="/apod" 
              className={`header-nav-link text-sm tracking-wide font-medium transition-colors ${
                location.pathname.startsWith('/apod') 
                  ? 'text-gray-900 dark:text-white opacity-100' 
                  : 'text-text-muted dark:text-text-muted opacity-70 hover:text-gray-900 dark:hover:text-white hover:opacity-100'
              }`}
            >
              Nasa Apod
            </Link>
            <Link 
              to="/dictionary" 
              className={`header-nav-link text-sm tracking-wide font-medium transition-colors ${
                location.pathname === '/dictionary' 
                  ? 'text-gray-900 dark:text-white opacity-100' 
                  : 'text-text-muted dark:text-text-muted opacity-70 hover:text-gray-900 dark:hover:text-white hover:opacity-100'
              }`}
            >
              Sözlük
            </Link>
            <Link 
              to="/about" 
              className={`header-nav-link text-sm tracking-wide font-medium transition-colors ${
                location.pathname === '/about' 
                  ? 'text-gray-900 dark:text-white opacity-100' 
                  : 'text-text-muted dark:text-text-muted opacity-70 hover:text-gray-900 dark:hover:text-white hover:opacity-100'
              }`}
            >
              Hakkımızda
            </Link>
          </nav>
        </div>

        {/* Logo - Fades out on hover - Clickable only on mobile */}
        <div 
          className={`header-site-title text-xl md:text-2xl font-bold font-logo text-text-heading tracking-tight flex items-center gap-1 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 z-10 select-none md:cursor-default cursor-pointer ${
            isHovered ? 'opacity-0' : 'opacity-100'
          }`} 
          style={{whiteSpace: 'nowrap'}}
          onClick={() => {
            // Only navigate on mobile devices (screen width < 768px)
            if (window.innerWidth < 768) {
              navigate('/');
            }
          }}
        >
          {customTitle === 'dictionary' ? (
            <span>
              <span>Openwall </span>
              <span className="lora-italic-semibold">dictionary</span>
            </span>
          ) : customTitle === 'apod' ? (
            <span className="font-inter flex items-center">
              <span className="lora-italic-semibold">the</span>
              <span style={{marginLeft: '0.15em'}}>Openwall</span>
              <span style={{marginLeft: '0.3em', marginRight: '0.3em'}}>
                <RxCross1 className="w-4 h-4" />
              </span>
              <span>Nasa Apod</span>
            </span>
          ) : customTitle ? (
            <span>
              <span>Openwall </span>
              <span className="lora-italic-semibold">climate</span>
            </span>
          ) : (
            <>
              <span className="lora-italic-semibold">the</span>
              <span style={{marginLeft: '0.15em'}}>Openwall</span>
              <span className="lora-italic-semibold" style={{marginLeft: '0.15em'}}></span>
            </>
          )}
        </div>

        <div className="flex-1 hidden md:block" />
        
        {/* Completion Percentage and Theme Toggle */}
        <div className="flex items-center gap-4 absolute right-8 top-1/2 -translate-y-1/2">
          {/* Theme toggle and other controls can be added here if needed */}
        </div>
      </div>
      
      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden mobile-menu absolute top-full left-0 right-0 shadow-xl shadow-black/10 dark:shadow-black/30 z-60">
          <nav className="px-4 py-3 flex flex-col space-y-3">
            <Link 
              to="/" 
              className="header-nav-link text-sm font-bold tracking-extrawidest uppercase text-text-muted hover:text-gray-900 dark:hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              ANA SAYFA
            </Link>
            <Link 
              to="/" 
              className="header-nav-link text-sm font-bold tracking-extrawidest uppercase text-text-muted hover:text-gray-900 dark:hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              BLOG
            </Link>
            <Link 
              to="/articles" 
              className="header-nav-link text-sm font-bold tracking-extrawidest uppercase text-text-muted hover:text-gray-900 dark:hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              MAKALELER
            </Link>
            <Link 
              to="/gallery" 
              className="header-nav-link text-sm font-bold tracking-extrawidest uppercase text-text-muted hover:text-gray-900 dark:hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              GALERİ
            </Link>
            <Link 
              to="/highlights" 
              className="header-nav-link text-sm font-bold tracking-extrawidest uppercase text-text-muted hover:text-gray-900 dark:hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              HIGHLIGHTS
            </Link>
            <Link 
              to="/about" 
              className="header-nav-link text-sm font-bold tracking-extrawidest uppercase text-text-muted hover:text-gray-900 dark:hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              ABOUT
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
