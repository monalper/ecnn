// frontend/src/components/ScrollToTop.jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Her sayfa değişikliğinde sayfanın en üstüne git
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
