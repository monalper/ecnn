// ECNN - Kopya/frontend/src/components/layout/Header.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { HiOutlineMenu } from 'react-icons/hi';
import { FaBookmark, FaChevronDown, FaSignOutAlt, FaUserShield } from 'react-icons/fa';
import { LuSun, LuMoon } from 'react-icons/lu';
import { AiOutlineSearch } from 'react-icons/ai';
import { savedArticlesAPI } from '../../services/api';
import SearchModal from '../SearchModal';

const Header = ({ scrollPercent, customTitle }) => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [savedArticles, setSavedArticles] = useState([]);
  const [visible, setVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const { theme, toggleTheme } = useTheme();

  // Dropdown dışına tıklandığında kapat
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Kaydedilen makaleleri getir
  useEffect(() => {
    const fetchSavedArticles = async () => {
      if (user && isUserDropdownOpen) {
        try {
          const articles = await savedArticlesAPI.getSavedArticles();
          setSavedArticles(articles.slice(0, 5)); // Sadece ilk 5'ini göster
        } catch (error) {
          console.error('Error fetching saved articles:', error);
        }
      }
    };
    fetchSavedArticles();
  }, [user, isUserDropdownOpen]);

  // Scroll davranışı - sadece makale detay sayfasında aktif
  useEffect(() => {
    const isArticleDetailPage = location.pathname.startsWith('/articles/') && location.pathname !== '/articles';
    
    if (!isArticleDetailPage) {
      setVisible(true);
      return;
    }

    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      
      // Eğer sayfa en üstteyse (0-100px arası) her zaman görünür
      if (currentScrollPos < 100) {
        setVisible(true);
      } else {
        // Yukarı kaydırıyorsa göster, aşağı kaydırıyorsa gizle
        setVisible(prevScrollPos > currentScrollPos);
      }
      
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos, location.pathname]);

  return (
    <header 
      className="fixed left-0 right-0 z-50 h-12 md:h-[44px] transition-all duration-300 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-white/10"
      style={{
        top: visible ? '0' : '-64px',
        transition: 'top 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        WebkitBackdropFilter: 'blur(20px)',
        backdropFilter: 'blur(20px)'
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
        </ul>
      </nav>
      
      <div className="px-4 sm:px-6 lg:px-8 flex items-center h-full relative">
        {/* Logo - Left side */}
        <div 
          className="flex items-center gap-2 z-30 select-none cursor-default"
          onClick={() => {
            // Only navigate on mobile devices (screen width < 768px)
            if (window.innerWidth < 768) {
              navigate('/');
            }
          }}
        >
          <img 
            src="/headerlogo.svg" 
            alt="Openwall Logo" 
            className="h-3.5 md:h-4 w-auto"
            style={{
              filter: theme === 'dark' 
                ? 'brightness(1) opacity(0.9)' 
                : 'brightness(0) opacity(0.8)'
            }}
          />
        </div>

        {/* Navigation Links - Center */}
        <div className="hidden md:flex items-center justify-center flex-1">
          <nav className="flex items-center gap-8">
            <Link 
              to="/" 
              className={`text-[12px] font-normal transition-colors duration-200 ${
                location.pathname === '/' 
                  ? 'text-gray-900 dark:text-white' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Ana Sayfa
            </Link>
            <Link 
              to="/articles" 
              className={`text-[12px] font-normal transition-colors duration-200 ${
                location.pathname === '/articles' 
                  ? 'text-gray-900 dark:text-white' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Makaleler
            </Link>
            <Link 
              to="/videos" 
              className={`text-[12px] font-normal transition-colors duration-200 ${
                location.pathname === '/videos' 
                  ? 'text-gray-900 dark:text-white' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Videolar
            </Link>
            <Link 
              to="/apod" 
              className={`text-[12px] font-normal transition-colors duration-200 ${
                location.pathname.startsWith('/apod') 
                  ? 'text-gray-900 dark:text-white' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Nasa Apod
            </Link>
            <Link 
              to="/moon" 
              className={`text-[12px] font-normal transition-colors duration-200 ${
                location.pathname === '/moon' 
                  ? 'text-gray-900 dark:text-white' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Ay Evreleri
            </Link>
            <Link 
              to="/asteroid" 
              className={`text-[12px] font-normal transition-colors duration-200 ${
                location.pathname === '/asteroid' 
                  ? 'text-gray-900 dark:text-white' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Asteroid
            </Link>
            <Link 
              to="/dictionary" 
              className={`text-[12px] font-normal transition-colors duration-200 ${
                location.pathname === '/dictionary' 
                  ? 'text-gray-900 dark:text-white' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Sözlük
            </Link>
          </nav>
        </div>

        {/* Mobile Menu Button - Only visible on mobile */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          aria-label="Menüyü aç/kapat"
        >
          <HiOutlineMenu className="w-5 h-5" />
        </button>
        
        {/* Search Button - Desktop */}
        <button
          onClick={() => setIsSearchOpen(!isSearchOpen)}
          className="hidden md:flex items-center justify-center w-8 h-8 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          aria-label="Ara"
        >
          <AiOutlineSearch className="w-[17px] h-[17px]" />
        </button>

        {/* Theme Toggle Button - For non-logged users */}
        {!user && (
          <button
            onClick={toggleTheme}
            className="hidden md:flex items-center justify-center w-8 h-8 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            aria-label="Tema değiştir"
          >
            {theme === 'dark' ? (
              <LuSun className="w-4 h-4" />
            ) : (
              <LuMoon className="w-4 h-4" />
            )}
          </button>
        )}

        {/* User Authentication Links - Right side */}
        <div className="flex items-center gap-3 hidden md:flex">
          {user ? (
            <div className="relative flex items-center gap-2" ref={dropdownRef}>
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center gap-2 px-2 py-1 text-[12px] text-gray-700 dark:text-gray-300 hover:opacity-70 rounded-md font-normal transition-all duration-150"
              >
                <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-200 font-medium text-[11px]">
                  {(user.name || user.username).charAt(0).toUpperCase()}
                </div>
              </button>
              
              {/* Dropdown Menu - Apple Minimal Style */}
              {isUserDropdownOpen && (
                <div 
                  className="absolute top-full right-0 mt-2 w-[280px] bg-white dark:bg-[#2A2A2A] rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 z-50 overflow-hidden"
                  style={{
                    animation: 'dropdownFadeIn 0.15s ease-out'
                  }}
                >
                  {/* User Info Section */}
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700/50">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-200 font-medium text-sm">
                        {(user.name || user.username).charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium text-gray-900 dark:text-white truncate">
                          {user.name || user.username}
                        </p>
                        {user.email && (
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                            {user.email}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    {user.isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        className="flex items-center gap-2.5 px-4 py-2 text-[13px] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        <FaUserShield className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                        <span>Admin Panel</span>
                      </Link>
                    )}
                    
                    <Link
                      to="/saved-articles"
                      className="flex items-center gap-2.5 px-4 py-2 text-[13px] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      onClick={() => setIsUserDropdownOpen(false)}
                    >
                      <FaBookmark className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                      <span>Kaydedilenler</span>
                      {savedArticles.length > 0 && (
                        <span className="ml-auto text-[11px] text-gray-400 dark:text-gray-500">
                          {savedArticles.length}
                        </span>
                      )}
                    </Link>
                    
                    <button
                      onClick={toggleTheme}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-[13px] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      {theme === 'dark' ? (
                        <LuSun className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                      ) : (
                        <LuMoon className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                      )}
                      <span>{theme === 'dark' ? 'Aydınlık Tema' : 'Karanlık Tema'}</span>
                    </button>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-gray-100 dark:border-gray-700/50 py-1">
                    <button
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-[13px] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <FaSignOutAlt className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                      <span>Çıkış Yap</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-4 ml-6">
              <Link
                to="/login"
                className="text-[12px] text-white font-medium px-5 py-1.5 rounded-full transition-all duration-200 active:scale-95"
                style={{
                  background: 'linear-gradient(180deg, #0071E3 0%, #0077ED 100%)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(180deg, #0077ED 0%, #0071E3 100%)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(180deg, #0071E3 0%, #0077ED 100%)';
                }}
              >
                Giriş Yap
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/20 dark:bg-black/40 z-40 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden mobile-menu absolute top-full left-0 right-0 bg-white/95 dark:bg-black/95 backdrop-blur-xl border-t border-gray-200/50 dark:border-white/10 shadow-2xl z-50"
        style={{
          WebkitBackdropFilter: 'blur(20px)',
          backdropFilter: 'blur(20px)'
        }}>
          <nav className="px-6 py-4 flex flex-col space-y-1">
            <Link 
              to="/" 
              className={`text-[15px] font-normal transition-colors block py-2.5 px-3 rounded-lg ${
                location.pathname === '/' 
                  ? 'text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50'
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
              className={`text-[15px] font-normal transition-colors block py-2.5 px-3 rounded-lg ${
                location.pathname === '/articles' 
                  ? 'text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50'
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
              className={`text-[15px] font-normal transition-colors block py-2.5 px-3 rounded-lg ${
                location.pathname === '/videos' 
                  ? 'text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50'
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
              className={`text-[15px] font-normal transition-colors block py-2.5 px-3 rounded-lg ${
                location.pathname === '/gallery' 
                  ? 'text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50'
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
              className={`text-[15px] font-normal transition-colors block py-2.5 px-3 rounded-lg ${
                location.pathname.startsWith('/apod') 
                  ? 'text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50'
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
              className={`text-[15px] font-normal transition-colors block py-2.5 px-3 rounded-lg ${
                location.pathname === '/moon' 
                  ? 'text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50'
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
              className={`text-[15px] font-normal transition-colors block py-2.5 px-3 rounded-lg ${
                location.pathname === '/asteroid' 
                  ? 'text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50'
              }`}
              onClick={(e) => {
                e.preventDefault();
                setIsMobileMenuOpen(false);
                setTimeout(() => navigate('/asteroid'), 100);
              }}
            >
              Asteroid
            </Link>
            <Link 
              to="/dictionary" 
              className={`text-[15px] font-normal transition-colors block py-2.5 px-3 rounded-lg ${
                location.pathname === '/dictionary' 
                  ? 'text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50'
              }`}
              onClick={(e) => {
                e.preventDefault();
                setIsMobileMenuOpen(false);
                setTimeout(() => navigate('/dictionary'), 100);
              }}
            >
              Sözlük
            </Link>
            
            {/* Mobile Search Button */}
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsSearchOpen(!isSearchOpen);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-[15px] text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors"
            >
              <AiOutlineSearch className="w-[17px] h-[17px]" />
              <span>Ara</span>
            </button>

            {/* Mobile Theme Toggle - For non-logged users */}
            {!user && (
              <button
                onClick={toggleTheme}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-[15px] text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors"
              >
                {theme === 'dark' ? (
                  <LuSun className="w-[17px] h-[17px]" />
                ) : (
                  <LuMoon className="w-[17px] h-[17px]" />
                )}
                <span>{theme === 'dark' ? 'Aydınlık Tema' : 'Karanlık Tema'}</span>
              </button>
            )}
            
            {/* Mobile Authentication Links */}
            <div className="pt-3 mt-2 border-t border-gray-200/50 dark:border-white/10">
              {user ? (
                <div className="space-y-1">
                  <div className="text-[13px] text-gray-600 dark:text-gray-400 px-3 py-2">
                    Merhaba, {user.name || user.username}
                  </div>
                  <Link
                    to="/saved-articles"
                    className="text-[15px] text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-normal flex items-center gap-2 py-2.5 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FaBookmark className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    Kaydedilenler
                  </Link>
                  {user.isAdmin && (
                    <Link
                      to="/admin/dashboard"
                      className="text-[15px] text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-normal block py-2.5 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
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
                    className="w-full text-left text-[15px] text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-normal block py-2.5 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    Çıkış Yap
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/login"
                    className="text-[15px] text-white font-medium px-6 py-2.5 rounded-full block text-center transition-all duration-200 active:scale-95"
                    style={{
                      background: 'linear-gradient(180deg, #0071E3 0%, #0077ED 100%)',
                    }}
                    onClick={() => setIsMobileMenuOpen(false)}
                    onTouchStart={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(180deg, #0077ED 0%, #0071E3 100%)';
                    }}
                    onTouchEnd={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(180deg, #0071E3 0%, #0077ED 100%)';
                    }}
                  >
                    Giriş Yap
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}

      {/* Search Modal */}
      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </header>
  );
};

export default Header;