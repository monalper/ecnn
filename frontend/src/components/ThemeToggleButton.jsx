import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { 
  FaMoon, 
  FaCheck 
} from 'react-icons/fa';
import { MdSunny } from 'react-icons/md';

const ThemeToggleButton = () => {
  const { theme, changeTheme, isSystemTheme } = useTheme();
  const [showMenu, setShowMenu] = useState(false);

  const handleThemeSelect = (selectedTheme) => {
    changeTheme(selectedTheme);
    setShowMenu(false);
  };


  return (
    <div className="fixed z-50 bottom-6 right-6">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="p-3 bg-white dark:bg-gray-800 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none"
        aria-label="Tema değiştir"
      >
        {theme === 'dark' ? (
          <FaMoon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
        ) : (
          <MdSunny className="h-5 w-5 text-gray-700 dark:text-gray-300" />
        )}
      </button>

      {showMenu && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowMenu(false)}
          />
          
          <div className="absolute bottom-14 right-0 z-50 w-40 bg-white dark:bg-gray-800 rounded-lg">
            <div className="py-1">
              <button
                onClick={() => handleThemeSelect('light')}
                className={`w-full flex items-center justify-between px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  theme === 'light' ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                <span>Açık Tema</span>
                {theme === 'light' && <FaCheck className="w-4 h-4" />}
              </button>

              <button
                onClick={() => handleThemeSelect('dark')}
                className={`w-full flex items-center justify-between px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  theme === 'dark' ? 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                <span>Karanlık Tema</span>
                {theme === 'dark' && <FaCheck className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ThemeToggleButton;