import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { HiOutlineMenu } from 'react-icons/hi';
import { FaBookmark, FaSignOutAlt, FaUserShield } from 'react-icons/fa';
import { LuSun, LuMoon } from 'react-icons/lu';
import { AiOutlineSearch, AiOutlineClose } from 'react-icons/ai'; 
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

  // ÇÖZÜM: İki ayrı ref tanımlandı
  const mobileDropdownRef = useRef(null);
  const desktopDropdownRef = useRef(null);

  const handleLogout = async () => {
    // Dropdown kapatılmalı ve çıkış yapılmalı
    setIsUserDropdownOpen(false); 
    await logout();
    navigate('/login');
  };

  const { theme, toggleTheme } = useTheme();

  // Dropdown dışına tıklandığında kapatma mantığı güncellendi
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isClickOutsideMobile = mobileDropdownRef.current && !mobileDropdownRef.current.contains(event.target);
      const isClickOutsideDesktop = desktopDropdownRef.current && !desktopDropdownRef.current.contains(event.target);

      if (isUserDropdownOpen) {
          if (
              (mobileDropdownRef.current && isClickOutsideMobile) &&
              (desktopDropdownRef.current && isClickOutsideDesktop)
          ) {
              setIsUserDropdownOpen(false);
          } else if (
             (mobileDropdownRef.current && isClickOutsideMobile && !desktopDropdownRef.current) ||
             (desktopDropdownRef.current && isClickOutsideDesktop && !mobileDropdownRef.current)
          ) {
             const activeRef = window.innerWidth < 768 ? mobileDropdownRef.current : desktopDropdownRef.current;
             if (activeRef && !activeRef.contains(event.target)) {
                 setIsUserDropdownOpen(false);
             }
          }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isUserDropdownOpen]);

  // Mobilde hamburger menü açıkken blur yönetimi
  useEffect(() => {
    const body = document.body;
    const mainContent = document.querySelector('main') || document.querySelector('#root > div:not(header)');
    
    if (isMobileMenuOpen) {
      body.style.overflow = 'hidden'; 
      if (mainContent && mainContent !== body) {
        mainContent.style.filter = 'blur(8px)';
        mainContent.style.webkitFilter = 'blur(8px)';
        mainContent.style.transition = 'filter 0.3s ease';
        mainContent.style.pointerEvents = 'none';
      }
    } else {
      body.style.overflow = ''; 
      if (mainContent && mainContent !== body) {
        mainContent.style.filter = 'none';
        mainContent.style.webkitFilter = 'none';
        mainContent.style.pointerEvents = 'auto';
      }
    }

    const handleScroll = () => {
        if(isMobileMenuOpen) {
            setIsMobileMenuOpen(false);
        }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      body.style.overflow = '';
      if (mainContent && mainContent !== body) {
        mainContent.style.filter = 'none';
        mainContent.style.webkitFilter = 'none';
        mainContent.style.pointerEvents = 'auto';
      }
    };
  }, [isMobileMenuOpen]);

  // Kaydedilen makaleleri getir
  useEffect(() => {
    const fetchSavedArticles = async () => {
      if (user && isUserDropdownOpen) {
        try {
          const articles = await savedArticlesAPI.getSavedArticles();
          setSavedArticles(articles.slice(0, 5)); 
        } catch (error) {
          console.error('Error fetching saved articles:', error);
        }
      }
    };
    fetchSavedArticles();
  }, [user, isUserDropdownOpen]);

  // Scroll davranışı
  useEffect(() => {
    const isArticleDetailPage = location.pathname.startsWith('/articles/') && location.pathname !== '/articles';
    
    if (!isArticleDetailPage) {
      setVisible(true);
      return;
    }

    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      if (currentScrollPos < 100) {
        setVisible(true);
      } else {
        setVisible(prevScrollPos > currentScrollPos);
      }
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos, location.pathname]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev);
    if (!isMobileMenuOpen) {
        setIsUserDropdownOpen(false);
    }
  };
  
  const toggleSearch = () => {
    setIsSearchOpen(prev => !prev);
  };
  
  const toggleUserDropdown = () => {
      setIsUserDropdownOpen(prev => !prev);
      if (!isUserDropdownOpen) {
          setIsMobileMenuOpen(false);
      }
  };

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
      <nav aria-label="Ana site navigasyonu" className="sr-only">
        <ul>
          <li><a href="https://openwall.com.tr/articles">Makaleler</a></li>
        </ul>
      </nav>
      
      <div className="px-4 sm:px-6 lg:px-8 flex items-center h-full relative">
        {/* Logo - Sol */}
        <div 
          className="flex items-center gap-2 z-30 select-none cursor-default order-1" 
          onClick={() => {
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

        {/* Navigation Links - Desktop */}
        <div className="hidden md:flex items-center justify-center flex-1 order-2">
          <nav className="flex items-center gap-8">
            <Link to="/" className={`text-[12px] font-normal transition-colors duration-200 ${location.pathname === '/' ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'}`}>Ana Sayfa</Link>
            <Link to="/articles" className={`text-[12px] font-normal transition-colors duration-200 ${location.pathname === '/articles' ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'}`}>Makaleler</Link>
            <Link to="/videos" className={`text-[12px] font-normal transition-colors duration-200 ${location.pathname === '/videos' ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'}`}>Videolar</Link>
            <Link to="/apod" className={`text-[12px] font-normal transition-colors duration-200 ${location.pathname.startsWith('/apod') ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'}`}>Nasa Apod</Link>
            <Link to="/moon" className={`text-[12px] font-normal transition-colors duration-200 ${location.pathname === '/moon' ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'}`}>Ay Evreleri</Link>
            <Link to="/asteroid" className={`text-[12px] font-normal transition-colors duration-200 ${location.pathname === '/asteroid' ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'}`}>Asteroid</Link>
            <Link to="/dictionary" className={`text-[12px] font-normal transition-colors duration-200 ${location.pathname === '/dictionary' ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'}`}>Sözlük</Link>

            {/* YENİ: Oi (harici domain) */}
            <a
              href="https://oi.openwall.com.tr"
              className="text-[12px] font-normal transition-colors duration-200 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              Oi
            </a>
          </nav>
        </div>

        {/* Mobil Action Group */}
        <div className={`flex items-center gap-3 md:hidden order-2 ml-auto`}> 
            {/* Tema */}
            <button
                onClick={toggleTheme}
                className="flex items-center justify-center w-8 h-8 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                aria-label="Tema değiştir"
            >
                {theme === 'dark' ? (<LuSun className="w-4 h-4" />) : (<LuMoon className="w-4 h-4" />)}
            </button>

            {/* Hamburger */}
            <button
                onClick={toggleMobileMenu}
                className={`p-1.5 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white`} 
                aria-label="Menüyü aç/kapat"
            >
                {isMobileMenuOpen ? <AiOutlineClose className="w-5 h-5" /> : <HiOutlineMenu className="w-5 h-5" />}
            </button>
        
            {/* Arama */}
            <button
                onClick={toggleSearch}
                className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                aria-label="Ara"
            >
                <AiOutlineSearch className="w-5 h-5" />
            </button>
            
            {/* Kullanıcı */}
            {user ? (
                <div className="relative" ref={mobileDropdownRef}>
                    <button
                        onClick={toggleUserDropdown}
                        className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium text-[11px] hover:opacity-70 transition-opacity"
                        aria-label="Kullanıcı Menüsü"
                    >
                        {(user.name || user.username).charAt(0).toUpperCase()}
                    </button>
                    {isUserDropdownOpen && (
                        <div 
                            className="absolute top-full right-0 mt-2 w-[250px] bg-white dark:bg-[#2A2A2A] rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 z-40 overflow-hidden" 
                            style={{ animation: 'dropdownFadeIn 0.15s ease-out' }}
                        >
                            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700/50">
                                <p className="text-[13px] font-medium text-gray-900 dark:text-white truncate">
                                    {user.name || user.username}
                                </p>
                                {user.email && (
                                    <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                                        {user.email}
                                    </p>
                                )}
                            </div>

                            <div className="py-1">
                                <Link to="/admin/dashboard" className="flex items-center gap-2.5 px-4 py-2 text-[13px] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors" onClick={() => setIsUserDropdownOpen(false)}> <FaUserShield className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" /> <span>Admin Panel</span> </Link>
                                <Link to="/saved-articles" className="flex items-center gap-2.5 px-4 py-2 text-[13px] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors" onClick={() => setIsUserDropdownOpen(false)}> <FaBookmark className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" /> <span>Kaydedilenler</span> {savedArticles.length > 0 && (<span className="ml-auto text-[11px] text-gray-400 dark:text-gray-500">{savedArticles.length}</span>)} </Link>
                                <button onClick={() => { toggleTheme(); setIsUserDropdownOpen(false); }} className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-[13px] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"> {theme === 'dark' ? (<LuSun className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />) : (<LuMoon className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />)} <span>{theme === 'dark' ? 'Aydınlık Tema' : 'Karanlık Tema'}</span> </button>
                            </div>

                            <div className="border-t border-gray-100 dark:border-gray-700/50 py-1">
                                <button onClick={() => { setIsUserDropdownOpen(false); handleLogout(); }} className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-[13px] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"> <FaSignOutAlt className="w-3.5 h-3.5 text-red-500 dark:text-red-400" /> <span>Çıkış Yap</span> </button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <>
                <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-[12px] text-white font-medium px-4 py-1 rounded-full transition-all duration-200 active:scale-95 text-center"
                    style={{
                        background: 'linear-gradient(180deg, #0071E3 0%, #0077ED 100%)',
                    }}
                    onTouchStart={(e) => {
                           e.currentTarget.style.background = 'linear-gradient(180deg, #0077ED 0%, #0071E3 100%)';
                    }}
                    onTouchEnd={(e) => {
                           e.currentTarget.style.background = 'linear-gradient(180deg, #0071E3 0%, #0077ED 100%)';
                    }}
                >
                    Giriş
                </Link>
                </>
            )}
        </div>
        

        {/* Desktop: Sağ Aksiyonlar */}
        <div className="hidden md:flex items-center gap-3 order-3 ml-auto">
            <button
                onClick={toggleSearch}
                className="flex items-center justify-center w-8 h-8 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                aria-label="Ara"
            >
                <AiOutlineSearch className="w-[17px] h-[17px]" />
            </button>

            {!user && (
                <button
                    onClick={toggleTheme}
                    className="flex items-center justify-center w-8 h-8 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    aria-label="Tema değiştir"
                >
                    {theme === 'dark' ? (<LuSun className="w-4 h-4" />) : (<LuMoon className="w-4 h-4" />)}
                </button>
            )}

            <div className="flex items-center gap-3">
                {user ? (
                    <div className="relative flex items-center gap-2" ref={desktopDropdownRef}>
                        <button
                            onClick={toggleUserDropdown}
                            className="flex items-center gap-2 px-2 py-1 text-[12px] text-gray-700 dark:text-gray-300 hover:opacity-70 rounded-md font-normal transition-all duration-150"
                        >
                            <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-200 font-medium text-[11px]">
                                {(user.name || user.username).charAt(0).toUpperCase()}
                            </div>
                        </button>
                        
                        {isUserDropdownOpen && (
                            <div 
                                className="absolute top-full right-0 mt-2 w-[280px] bg-white dark:bg-[#2A2A2A] rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 z-50 overflow-hidden"
                                style={{ animation: 'dropdownFadeIn 0.15s ease-out' }}
                            >
                                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700/50">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-200 font-medium text-sm">
                                            {(user.name || user.username).charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[13px] font-medium text-gray-900 dark:text-white truncate">{user.name || user.username}</p>
                                            {user.email && (<p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">{user.email}</p>)}
                                        </div>
                                    </div>
                                </div>

                                <div className="py-1">
                                    <Link to="/admin/dashboard" className="flex items-center gap-2.5 px-4 py-2 text-[13px] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors" onClick={() => setIsUserDropdownOpen(false)}> <FaUserShield className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" /> <span>Admin Panel</span> </Link>
                                    <Link to="/saved-articles" className="flex items-center gap-2.5 px-4 py-2 text-[13px] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors" onClick={() => setIsUserDropdownOpen(false)}> <FaBookmark className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" /> <span>Kaydedilenler</span> {savedArticles.length > 0 && (<span className="ml-auto text-[11px] text-gray-400 dark:text-gray-500">{savedArticles.length}</span>)} </Link>
                                    <button onClick={() => { toggleTheme(); setIsUserDropdownOpen(false); }} className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-[13px] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"> {theme === 'dark' ? (<LuSun className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />) : (<LuMoon className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />)} <span>{theme === 'dark' ? 'Aydınlık Tema' : 'Karanlık Tema'}</span> </button>
                                </div>

                                <div className="border-t border-gray-100 dark:border-gray-700/50 py-1">
                                    <button onClick={() => { setIsUserDropdownOpen(false); handleLogout(); }} className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-[13px] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"> <FaSignOutAlt className="w-3.5 h-3.5 text-red-500 dark:text-red-400" /> <span>Çıkış Yap</span> </button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center gap-4 ml-6">
                        <Link
                            to="/login"
                            className="text-[12px] text-white font-medium px-5 py-1.5 rounded-full transition-all duration-200 active:scale-95"
                            style={{ background: 'linear-gradient(180deg, #0071E3 0%, #0077ED 100%)' }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = 'linear-gradient(180deg, #0077ED 0%, #0071E3 100%)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'linear-gradient(180deg, #0071E3 0%, #0077ED 100%)'; }}
                        >
                            Giriş Yap
                        </Link>
                    </div>
                )}
            </div>
        </div>
      </div>
      
      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden mobile-menu absolute top-full left-0 right-0 shadow-2xl z-40 transition-all duration-300 ease-in-out" 
          style={{
             backgroundColor: theme === 'dark' ? 'rgba(0, 0, 0, 0.95)' : 'rgba(255, 255, 255, 0.95)',
             backdropFilter: 'blur(20px)',
             WebkitBackdropFilter: 'blur(20px)',
             maxHeight: 'calc(100vh - 48px)',
             overflowY: 'auto'
          }}
        >
          <nav className="px-5 py-4 flex flex-col space-y-1">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className={`text-[17px] font-medium transition-colors block py-3 px-3 rounded-xl ${location.pathname === '/' ? 'text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800' : 'text-gray-800 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}>Ana Sayfa</Link>
            <Link to="/articles" onClick={() => setIsMobileMenuOpen(false)} className={`text-[17px] font-medium transition-colors block py-3 px-3 rounded-xl ${location.pathname === '/articles' ? 'text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800' : 'text-gray-800 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}>Makaleler</Link>
            <Link to="/videos" onClick={() => setIsMobileMenuOpen(false)} className={`text-[17px] font-medium transition-colors block py-3 px-3 rounded-xl ${location.pathname === '/videos' ? 'text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800' : 'text-gray-800 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}>Videolar</Link>
            <Link to="/gallery" onClick={() => setIsMobileMenuOpen(false)} className={`text-[17px] font-medium transition-colors block py-3 px-3 rounded-xl ${location.pathname === '/gallery' ? 'text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800' : 'text-gray-800 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}>Galeri</Link>
            <Link to="/apod" onClick={() => setIsMobileMenuOpen(false)} className={`text-[17px] font-medium transition-colors block py-3 px-3 rounded-xl ${location.pathname.startsWith('/apod') ? 'text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800' : 'text-gray-800 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}>Nasa Apod</Link>
            <Link to="/moon" onClick={() => setIsMobileMenuOpen(false)} className={`text-[17px] font-medium transition-colors block py-3 px-3 rounded-xl ${location.pathname === '/moon' ? 'text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800' : 'text-gray-800 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}>Ay Evreleri</Link>
            <Link to="/asteroid" onClick={() => setIsMobileMenuOpen(false)} className={`text-[17px] font-medium transition-colors block py-3 px-3 rounded-xl ${location.pathname === '/asteroid' ? 'text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800' : 'text-gray-800 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}>Asteroid</Link>
            <Link to="/dictionary" onClick={() => setIsMobileMenuOpen(false)} className={`text-[17px] font-medium transition-colors block py-3 px-3 rounded-xl ${location.pathname === '/dictionary' ? 'text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800' : 'text-gray-800 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}>Sözlük</Link>

            {/* YENİ: Oi (harici domain, mobil) */}
            <a
              href="https://oi.openwall.com.tr"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-[17px] font-medium transition-colors block py-3 px-3 rounded-xl text-gray-800 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50"
            >
              Oi
            </a>

            {user && (
                <div className="pt-4 mt-2 border-t border-gray-200/50 dark:border-white/10 space-y-1">
                    {user.isAdmin && (
                        <Link to="/admin/dashboard" onClick={() => setIsMobileMenuOpen(false)}
                            className="text-[17px] font-medium flex items-center gap-3 py-3 px-3 rounded-xl text-blue-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                            <FaUserShield className="w-4 h-4" />
                            <span>Admin Panel</span>
                        </Link>
                    )}
                    <Link to="/saved-articles" onClick={() => setIsMobileMenuOpen(false)}
                        className="text-[17px] font-medium flex items-center gap-3 py-3 px-3 rounded-xl text-gray-800 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <FaBookmark className="w-4 h-4" />
                        <span>Kaydedilenler</span>
                    </Link>
                </div>
            )}
          </nav>
        </div>
      )}

      {/* Search Modal */}
      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={toggleSearch} 
      />
    </header>
  );
};

export default Header;
