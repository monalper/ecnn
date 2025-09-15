import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Banner from '../Banner';

/**
 * Sadece /admin/dashboard sayfasında Header ve Footer'ı gizler.
 * Diğer tüm sayfalarda gösterir.
 */
const ConditionalHeaderFooter = () => {
  const location = useLocation();
  // '/admin' ile başlayan tüm path'lerde gizle
  const shouldHide = location.pathname.startsWith('/admin');
  
  // Dictionary sayfasında ve kelime detay sayfalarında özel başlık göster
  const customTitle = (location.pathname === '/dictionary' || location.pathname.startsWith('/dict/')) ? 'dictionary' : null;
  
  return (
    <>
      {!shouldHide && (
        <>
          <Header customTitle={customTitle} />
          <Banner />
        </>
      )}
    </>
  );
};

export default ConditionalHeaderFooter;
