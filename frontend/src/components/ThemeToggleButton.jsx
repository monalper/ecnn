import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

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
    <div className="fixed z-50 bottom-6 right-6">
      {/* Ana Buton */}
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="p-3 rounded-full shadow-lg bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-orange"
        style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.18)' }}
        aria-label="Tema değiştir"
      >
        {theme === 'dark' ? (
          <svg className="h-6 w-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
          </svg>
        ) : (
          <svg className="h-6 w-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M6.05 17.95l-1.414 1.414M17.95 17.95l-1.414-1.414M6.05 6.05L4.636 7.464M12 8a4 4 0 100 8 4 4 0 000-8z" />
          </svg>
        )}
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
          <div className="absolute bottom-16 right-0 mb-2 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 min-w-[200px] z-50">
            <div className="p-2">
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 px-3 py-1 mb-1">
                Tema Seçimi
              </div>
              
              {/* Sistem Teması */}
              <button
                onClick={handleSystemTheme}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  isSystemTheme 
                    ? 'bg-brand-orange text-white' 
                    : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Sistem Teması
                {isSystemTheme && (
                  <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>

              {/* Açık Tema */}
              <button
                onClick={() => handleThemeSelect('light')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  theme === 'light' && !isSystemTheme
                    ? 'bg-brand-orange text-white' 
                    : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M6.05 17.95l-1.414 1.414M17.95 17.95l-1.414-1.414M6.05 6.05L4.636 7.464M12 8a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
                Açık Tema
                {theme === 'light' && !isSystemTheme && (
                  <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>

              {/* Karanlık Tema */}
              <button
                onClick={() => handleThemeSelect('dark')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  theme === 'dark' && !isSystemTheme
                    ? 'bg-brand-orange text-white' 
                    : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
                </svg>
                Karanlık Tema
                {theme === 'dark' && !isSystemTheme && (
                  <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ThemeToggleButton;
