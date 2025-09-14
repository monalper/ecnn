// ECNN - Kopya/frontend/src/components/layout/Header.jsx
import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { RxCross1 } from 'react-icons/rx';
import { HiOutlineMenu } from 'react-icons/hi';
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
          <li><a href="https://openwall.com.tr/moon">Ay Evreleri</a></li>
          <li><a href="https://openwall.com.tr/asteroid">Asteroid İzleme</a></li>
          <li><a href="https://openwall.com.tr/dictionary">Sözlük</a></li>
          <li><a href="https://openwall.com.tr/about">Hakkımızda</a></li>
        </ul>
      </nav>
      
      <div className="px-4 sm:px-6 lg:px-8 flex items-center justify-between h-full relative">
        {/* Navigation Links - Hidden by default, visible on hover in center - Desktop only */}
        <div className={`absolute inset-0 hidden md:flex items-center justify-center transition-opacity duration-300 z-40 ${
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
              to="/moon" 
              className={`header-nav-link text-sm tracking-wide font-medium transition-colors ${
                location.pathname === '/moon' 
                  ? 'text-gray-900 dark:text-white opacity-100' 
                  : 'text-text-muted dark:text-text-muted opacity-70 hover:text-gray-900 dark:hover:text-white hover:opacity-100'
              }`}
            >
              Ay Evreleri
            </Link>
            <Link 
              to="/asteroid" 
              className={`header-nav-link text-sm tracking-wide font-medium transition-colors ${
                location.pathname === '/asteroid' 
                  ? 'text-gray-900 dark:text-white opacity-100' 
                  : 'text-text-muted dark:text-text-muted opacity-70 hover:text-gray-900 dark:hover:text-white hover:opacity-100'
              }`}
            >
              Asteroid İzleme
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
          className={`header-site-title text-xl md:text-2xl font-bold font-logo text-text-heading tracking-tight flex items-center gap-1 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 z-30 select-none md:cursor-default cursor-pointer ${
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
        
        {/* Mobile Menu Button - Only visible on mobile */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          aria-label="Menüyü aç/kapat"
        >
          <HiOutlineMenu className="w-6 h-6" />
        </button>
        
        {/* User Authentication Links */}
        <div className="flex items-center gap-4 absolute right-8 top-1/2 -translate-y-1/2 hidden md:flex z-50 pointer-events-auto">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Merhaba, {user.name || user.username}
              </span>
              {user.isAdmin && (
                <Link
                  to="/admin/dashboard"
                  className="text-sm text-brand-orange hover:text-brand-orange-dark font-medium pointer-events-auto"
                >
                  Admin Panel
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium pointer-events-auto"
              >
                Çıkış Yap
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium pointer-events-auto"
              >
                Giriş Yap
              </Link>
              <Link
                to="/register"
                className="text-sm text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded-full font-medium transition-colors pointer-events-auto"
              >
                Kayıt Ol
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-25 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      {/* Mobile Menu Dropdown - Desktop Menu Style */}
      {isMobileMenuOpen && (
        <div className="md:hidden mobile-menu absolute top-full left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-t border-gray-200 dark:border-white/20 shadow-xl shadow-black/10 dark:shadow-black/30 z-50">
          <nav className="px-6 py-6 flex flex-col space-y-6">
            <Link 
              to="/" 
              className={`header-nav-link text-sm tracking-wide font-medium transition-colors block py-2 ${
                location.pathname === '/' 
                  ? 'text-gray-900 dark:text-white opacity-100' 
                  : 'text-text-muted dark:text-text-muted opacity-70 hover:text-gray-900 dark:hover:text-white hover:opacity-100'
              }`}
              onClick={(e) => {
                e.preventDefault();
                setIsMobileMenuOpen(false);
                setTimeout(() => navigate('/'), 100);
              }}
            >
              Ana Sayfa
            </Link>
            <Link 
              to="/articles" 
              className={`header-nav-link text-sm tracking-wide font-medium transition-colors block py-2 ${
                location.pathname === '/articles' 
                  ? 'text-gray-900 dark:text-white opacity-100' 
                  : 'text-text-muted dark:text-text-muted opacity-70 hover:text-gray-900 dark:hover:text-white hover:opacity-100'
              }`}
              onClick={(e) => {
                e.preventDefault();
                setIsMobileMenuOpen(false);
                setTimeout(() => navigate('/articles'), 100);
              }}
            >
              Makaleler
            </Link>
            <Link 
              to="/videos" 
              className={`header-nav-link text-sm tracking-wide font-medium transition-colors block py-2 ${
                location.pathname === '/videos' 
                  ? 'text-gray-900 dark:text-white opacity-100' 
                  : 'text-text-muted dark:text-text-muted opacity-70 hover:text-gray-900 dark:hover:text-white hover:opacity-100'
              }`}
              onClick={(e) => {
                e.preventDefault();
                setIsMobileMenuOpen(false);
                setTimeout(() => navigate('/videos'), 100);
              }}
            >
              Videolar
            </Link>
            <Link 
              to="/gallery" 
              className={`header-nav-link text-sm tracking-wide font-medium transition-colors block py-2 ${
                location.pathname === '/gallery' 
                  ? 'text-gray-900 dark:text-white opacity-100' 
                  : 'text-text-muted dark:text-text-muted opacity-70 hover:text-gray-900 dark:hover:text-white hover:opacity-100'
              }`}
              onClick={(e) => {
                e.preventDefault();
                setIsMobileMenuOpen(false);
                setTimeout(() => navigate('/gallery'), 100);
              }}
            >
              Galeri
            </Link>
            <Link 
              to="/apod" 
              className={`header-nav-link text-sm tracking-wide font-medium transition-colors block py-2 ${
                location.pathname.startsWith('/apod') 
                  ? 'text-gray-900 dark:text-white opacity-100' 
                  : 'text-text-muted dark:text-text-muted opacity-70 hover:text-gray-900 dark:hover:text-white hover:opacity-100'
              }`}
              onClick={(e) => {
                e.preventDefault();
                setIsMobileMenuOpen(false);
                setTimeout(() => navigate('/apod'), 100);
              }}
            >
              Nasa Apod
            </Link>
            <Link 
              to="/moon" 
              className={`header-nav-link text-sm tracking-wide font-medium transition-colors block py-2 ${
                location.pathname === '/moon' 
                  ? 'text-gray-900 dark:text-white opacity-100' 
                  : 'text-text-muted dark:text-text-muted opacity-70 hover:text-gray-900 dark:hover:text-white hover:opacity-100'
              }`}
              onClick={(e) => {
                e.preventDefault();
                setIsMobileMenuOpen(false);
                setTimeout(() => navigate('/moon'), 100);
              }}
            >
              Ay Evreleri
            </Link>
            <Link 
              to="/asteroid" 
              className={`header-nav-link text-sm tracking-wide font-medium transition-colors block py-2 ${
                location.pathname === '/asteroid' 
                  ? 'text-gray-900 dark:text-white opacity-100' 
                  : 'text-text-muted dark:text-text-muted opacity-70 hover:text-gray-900 dark:hover:text-white hover:opacity-100'
              }`}
              onClick={(e) => {
                e.preventDefault();
                setIsMobileMenuOpen(false);
                setTimeout(() => navigate('/asteroid'), 100);
              }}
            >
              Asteroid İzleme
            </Link>
            <Link 
              to="/dictionary" 
              className={`header-nav-link text-sm tracking-wide font-medium transition-colors block py-2 ${
                location.pathname === '/dictionary' 
                  ? 'text-gray-900 dark:text-white opacity-100' 
                  : 'text-text-muted dark:text-text-muted opacity-70 hover:text-gray-900 dark:hover:text-white hover:opacity-100'
              }`}
              onClick={(e) => {
                e.preventDefault();
                setIsMobileMenuOpen(false);
                setTimeout(() => navigate('/dictionary'), 100);
              }}
            >
              Sözlük
            </Link>
            <Link 
              to="/about" 
              className={`header-nav-link text-sm tracking-wide font-medium transition-colors block py-2 ${
                location.pathname === '/about' 
                  ? 'text-gray-900 dark:text-white opacity-100' 
                  : 'text-text-muted dark:text-text-muted opacity-70 hover:text-gray-900 dark:hover:text-white hover:opacity-100'
              }`}
              onClick={(e) => {
                e.preventDefault();
                setIsMobileMenuOpen(false);
                setTimeout(() => navigate('/about'), 100);
              }}
            >
              Hakkımızda
            </Link>
            
            {/* Mobile Authentication Links */}
            <div className="pt-4 border-t border-gray-200 dark:border-white/20">
              {user ? (
                <div className="space-y-3">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Merhaba, {user.name || user.username}
                  </div>
                  {user.isAdmin && (
                    <Link
                      to="/admin/dashboard"
                      className="text-sm text-brand-orange hover:text-brand-orange-dark font-medium block py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium block py-2"
                  >
                    Çıkış Yap
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link
                    to="/login"
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium block py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Giriş Yap
                  </Link>
                  <Link
                    to="/register"
                    className="text-sm text-white bg-red-500 hover:bg-red-600 px-3 py-2 rounded-full font-medium block text-center transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Kayıt Ol
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
