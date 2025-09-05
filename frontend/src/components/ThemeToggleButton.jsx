import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { 
  FaSun, 
  FaMoon, 
  FaDesktop, 
  FaCheck 
} from 'react-icons/fa';

const ThemeToggleButton = () => {
  const { theme, changeTheme, isSystemTheme } = useTheme();
  const [showMenu, setShowMenu] = useState(false);

  const handleThemeSelect = (selectedTheme) => {
    console.log('Tema seçildi:', selectedTheme);
    try {
      changeTheme(selectedTheme);
      setShowMenu(false);
    } catch (error) {
      console.error('Tema değiştirilirken hata:', error);
    }
  };

  const handleSystemTheme = () => {
    console.log('Sistem teması seçildi');
    try {
      localStorage.removeItem('theme');
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      changeTheme(systemTheme);
      setShowMenu(false);
    } catch (error) {
      console.error('Sistem teması uygulanırken hata:', error);
    }
  };

  return (
    <div className="fixed z-50 bottom-6 right-6 theme-toggle-container">
      {/* Ana Buton */}
      <button
        onClick={() => setShowMenu(!showMenu)}
        className={`
          relative p-4 rounded-2xl shadow-2xl transition-all duration-300 ease-out
          bg-white/90 dark:bg-slate-800/90 backdrop-blur-md theme-toggle-glass
          hover:bg-white dark:hover:bg-slate-700 hover:scale-105
          active:scale-95 focus:outline-none focus:ring-4 focus:ring-orange-500/30
          border border-white/20 dark:border-slate-600/30 theme-toggle-button
          ${showMenu ? 'scale-105 ring-4 ring-orange-500/30' : ''}
        `}
        style={{ 
          boxShadow: theme === 'dark' 
            ? '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1)' 
            : '0 8px 32px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.2)'
        }}
        aria-label="Tema değiştir"
      >
        {/* Icon with smooth rotation */}
        <div className={`transition-transform duration-500 ${showMenu ? 'rotate-180' : ''}`}>
          {theme === 'dark' ? (
            <FaMoon 
              className="h-7 w-7" 
              style={{ color: '#f5f5f7' }}
            />
          ) : (
            <FaSun 
              className="h-7 w-7 text-slate-700"
            />
          )}
        </div>
        
        {/* Pulse animation ring */}
        <div className={`
          absolute inset-0 rounded-2xl border-2 border-orange-400/50
          ${showMenu ? 'animate-ping' : 'hidden'}
        `} />
      </button>

      {/* Dropdown Menü */}
      {showMenu && (
        <>
          {/* Overlay - menü dışına tıklandığında kapat */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowMenu(false)}
          />
          
          {/* Menü */}
          <div className={`
            absolute bottom-16 right-0 mb-2 min-w-[220px] z-50
            bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl theme-toggle-glass
            rounded-2xl shadow-2xl border border-white/20 dark:border-slate-600/30
            theme-toggle-slide-in theme-toggle-menu
            ${showMenu ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
          `}
          style={{
            boxShadow: theme === 'dark' 
              ? '0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1)' 
              : '0 20px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.2)'
          }}>
            <div className="p-3">
              <div className="text-xs font-semibold text-slate-600 dark:text-slate-300 px-3 py-2 mb-2 bg-slate-50/50 dark:bg-slate-700/30 rounded-lg">
                🎨 Tema Seçimi
              </div>
              
              {/* Sistem Teması */}
              <button
                onClick={handleSystemTheme}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                  transition-all duration-200 ease-out group relative overflow-hidden
                  ${isSystemTheme 
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25' 
                    : 'hover:bg-slate-100/80 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300 hover:scale-[1.02]'
                  }
                `}
              >
                <div className={`transition-transform duration-200 ${isSystemTheme ? 'scale-110' : 'group-hover:scale-110'}`}>
                  <FaDesktop className="w-5 h-5" />
                </div>
                <span className="flex-1">Sistem Teması</span>
                {isSystemTheme && (
                  <div className="transition-all duration-200 scale-100">
                    <FaCheck className="w-5 h-5" />
                  </div>
                )}
                {/* Hover effect background */}
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl" />
              </button>

              {/* Açık Tema */}
              <button
                onClick={() => handleThemeSelect('light')}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                  transition-all duration-200 ease-out group relative overflow-hidden
                  ${theme === 'light' && !isSystemTheme
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25' 
                    : 'hover:bg-slate-100/80 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300 hover:scale-[1.02]'
                  }
                `}
              >
                <div className={`transition-transform duration-200 ${theme === 'light' && !isSystemTheme ? 'scale-110' : 'group-hover:scale-110'}`}>
                  <FaSun className="w-5 h-5" />
                </div>
                <span className="flex-1">Açık Tema</span>
                {theme === 'light' && !isSystemTheme && (
                  <div className="transition-all duration-200 scale-100">
                    <FaCheck className="w-5 h-5" />
                  </div>
                )}
                {/* Hover effect background */}
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl" />
              </button>

              {/* Karanlık Tema */}
              <button
                onClick={() => handleThemeSelect('dark')}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                  transition-all duration-200 ease-out group relative overflow-hidden
                  ${theme === 'dark' && !isSystemTheme
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25' 
                    : 'hover:bg-slate-100/80 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300 hover:scale-[1.02]'
                  }
                `}
              >
                <div className={`transition-transform duration-200 ${theme === 'dark' && !isSystemTheme ? 'scale-110' : 'group-hover:scale-110'}`}>
                  <FaMoon className="w-5 h-5" />
                </div>
                <span className="flex-1">Karanlık Tema</span>
                {theme === 'dark' && !isSystemTheme && (
                  <div className="transition-all duration-200 scale-100">
                    <FaCheck className="w-5 h-5" />
                  </div>
                )}
                {/* Hover effect background */}
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ThemeToggleButton;
