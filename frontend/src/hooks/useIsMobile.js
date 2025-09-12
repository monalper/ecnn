import { useState, useEffect } from 'react';

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      // Tailwind CSS'in md breakpoint'ini (768px) kullanıyoruz
      setIsMobile(window.innerWidth < 768);
    };

    // İlk yüklemede kontrol et
    checkIsMobile();

    // Pencere boyutu değiştiğinde kontrol et
    window.addEventListener('resize', checkIsMobile);

    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  return isMobile;
};

export default useIsMobile;
