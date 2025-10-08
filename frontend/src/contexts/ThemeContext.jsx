import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [isLoaded, setIsLoaded] = useState(false);

  // İlk yüklemede tema ayarla
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('theme');
      console.log('İlk yükleme - localStorage tema:', savedTheme);
      
      if (savedTheme && (savedTheme === 'dark' || savedTheme === 'light')) {
        setTheme(savedTheme);
        // Hemen uygula
        document.documentElement.classList.remove('dark', 'light');
        document.documentElement.classList.add(savedTheme);
      } else {
        // Sistem temasını algıla
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        console.log('Sistem teması algılandı:', systemTheme);
        setTheme(systemTheme);
        // Hemen uygula
        document.documentElement.classList.remove('dark', 'light');
        document.documentElement.classList.add(systemTheme);
      }
    } catch (error) {
      console.error('Tema yüklenirken hata:', error);
      // Hata durumunda varsayılan tema
      setTheme('light');
      document.documentElement.classList.remove('dark', 'light');
      document.documentElement.classList.add('light');
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Sistem teması değişikliklerini dinle
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleSystemThemeChange = (e) => {
      // Sadece sistem teması seçiliyse güncelle
      if (!localStorage.getItem('theme')) {
        const newSystemTheme = e.matches ? 'dark' : 'light';
        console.log('Sistem teması değişti:', newSystemTheme);
        setTheme(newSystemTheme);
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, []);

  // Tema değiştiğinde uygula
  useEffect(() => {
    if (!isLoaded) return; // İlk yüklemede çalışmasın
    
    console.log('Tema değişti, uygulanıyor:', theme);
    try {
      document.documentElement.classList.remove('dark', 'light');
      document.documentElement.classList.add(theme);
      localStorage.setItem('theme', theme);
    } catch (error) {
      console.error('Tema uygulanırken hata:', error);
    }
  }, [theme, isLoaded]);

  const changeTheme = (newTheme) => {
    console.log('changeTheme çağrıldı:', newTheme);
    if (newTheme === 'dark' || newTheme === 'light') {
      setTheme(newTheme);
    }
  };

  const toggleTheme = () => {
    console.log('toggleTheme çağrıldı, mevcut tema:', theme);
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  const isSystemTheme = !localStorage.getItem('theme');

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      changeTheme,
      toggleTheme,
      isSystemTheme,
      isLoaded
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

