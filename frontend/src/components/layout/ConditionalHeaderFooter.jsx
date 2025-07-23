import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

/**
 * Sadece /admin/dashboard sayfasında Header ve Footer'ı gizler.
 * Diğer tüm sayfalarda gösterir.
 */
const ConditionalHeaderFooter = () => {
  const location = useLocation();
  // '/admin' ile başlayan tüm path'lerde gizle
  const shouldHide = location.pathname.startsWith('/admin');
  return (
    <>
      {!shouldHide && <Header />}
    </>
  );
};

export default ConditionalHeaderFooter;
