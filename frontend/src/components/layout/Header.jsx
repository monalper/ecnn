// ECNN - Kopya/frontend/src/components/layout/Header.jsx
import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './lora-font-import';

const Header = ({ scrollPercent, customTitle }) => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const { theme, toggleTheme } = useTheme();

  // Convert sayfası için özel başlık
  const isConvertPage = location.pathname === '/convert';
  const isDesignerPage = location.pathname === '/designer';
  const isChartsPage = location.pathname === '/charts';

  return (
    <header className="bg-site-background dark:bg-dark-primary border-b border-slate-200 dark:border-white/20 fixed top-0 left-0 right-0 z-50 h-16 md:h-20 transition-colors">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-full relative">
        <div className="flex-1 hidden md:block" />
        <Link to="/" className="header-site-title text-xl md:text-2xl font-bold font-logo text-text-heading tracking-tight flex items-center gap-1 absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2" style={{whiteSpace: 'nowrap'}}>
          {isConvertPage ? (
            <span>
              <span>openwall </span>
              <span className="lora-italic-semibold">convert</span>
            </span>
          ) : isDesignerPage ? (
            <span>
              <span>openwall </span>
              <span className="lora-italic-semibold">designer</span>
            </span>
          ) : isChartsPage ? (
            <span>
              <span>openwall </span>
              <span className="lora-italic-semibold">charts</span>
            </span>
          ) : customTitle === 'dictionary' ? (
            <span>
              <span>openwall </span>
              <span className="lora-italic-semibold">dictionary</span>
            </span>
          ) : customTitle ? (
            <span>
              <span>openwall </span>
              <span className="lora-italic-semibold">climate</span>
            </span>
          ) : (
            <>
              <span className="lora-italic-semibold">a</span>
              <span style={{marginLeft: '0.15em'}}>openwall</span>
              <span className="lora-italic-semibold" style={{marginLeft: '0.15em'}}>archive</span>
            </>
          )}
        </Link>
        <div className="flex-1 hidden md:block" />
        {/* Completion Percentage and Theme Toggle */}
        <div className="flex items-center gap-4 absolute right-8 top-1/2 -translate-y-1/2">
          {/* Completion Percentage (sticky-like) */}
          {typeof scrollPercent === 'number' && (
            <span
              className="hidden sm:inline font-bold px-3 py-1 rounded text-[15px]"
              style={{
                color: theme === 'dark' ? '#facc15' : '#181818',
                background: 'transparent',
                transition: 'color 0.2s',
                userSelect: 'none',
                textShadow: theme === 'dark' ? '0 1px 4px #18181899' : 'none',
                whiteSpace: 'nowrap',
                position: 'relative',
              }}
            >
              %{Math.round(scrollPercent)} tamamlandı
            </span>
          )}

        </div>
      </div>
      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-200 shadow-lg">
          <nav className="container mx-auto px-4 py-3 flex flex-col space-y-3">
            <Link 
              to="/" 
              className="header-nav-link text-sm font-bold tracking-extrawidest uppercase text-text-muted hover:text-text-main transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              BLOG
            </Link>
            <Link 
              to="/articles" 
              className="header-nav-link text-sm font-bold tracking-extrawidest uppercase text-text-muted hover:text-text-main transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              MAKALELER
            </Link>
            <Link 
              to="/gallery" 
              className="header-nav-link text-sm font-bold tracking-extrawidest uppercase text-text-muted hover:text-text-main transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              GALERİ
            </Link>
            <Link 
              to="/highlights" 
              className="header-nav-link text-sm font-bold tracking-extrawidest uppercase text-text-muted hover:text-text-main transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              HIGHLIGHTS
            </Link>
            <Link 
              to="/convert" 
              className="header-nav-link text-sm font-bold tracking-extrawidest uppercase text-text-muted hover:text-text-main transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              CONVERT
            </Link>
            <Link 
              to="/designer" 
              className="header-nav-link text-sm font-bold tracking-extrawidest uppercase text-text-muted hover:text-text-main transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              DESIGNER
            </Link>
            <Link
              to="/charts"
              className="header-nav-link text-sm font-bold tracking-extrawidest uppercase text-text-muted hover:text-text-main transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              CHARTS
            </Link>
            <Link 
              to="/about" 
              className="header-nav-link text-sm font-bold tracking-extrawidest uppercase text-text-muted hover:text-text-main transition-colors"
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
