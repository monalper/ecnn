import React, { useState, useEffect } from 'react';

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(() => {
    // Initialize with a safe default
    if (typeof window === 'undefined') {
      return false;
    }
    return window.innerWidth < 768;
  });

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      return;
    }

    const checkIsMobile = () => {
      try {
        // Tailwind CSS'in md breakpoint'ini (768px) kullanıyoruz
        setIsMobile(window.innerWidth < 768);
      } catch (error) {
        console.warn('Error checking mobile status:', error);
        // Don't update state if there's an error
      }
    };

    // Pencere boyutu değiştiğinde kontrol et
    window.addEventListener('resize', checkIsMobile);

    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  return isMobile;
};

export default useIsMobile;
