import React from 'react';
import { Helmet } from 'react-helmet-async';

const MetaTags = ({ 
  title, 
  description, 
  keywords, 
  image, 
  url, 
  type = 'article',
  author,
  publishedTime,
  modifiedTime,
  section,
  tags = [],
  readingTime,
  wordCount,
  isHighlight = false,
  isHomepage = false
}) => {
  const siteName = 'The Openwall';
  const fullTitle = isHomepage ? title : (title ? `${title} | ${siteName}` : siteName);
  const defaultDescription = 'The Openwall: Birçok konuda yazılmış denemeleri keşfedin.';
  const defaultImage = 'https://openwall.com.tr/og-images/default/og-default.jpg'; // Güncellenmiş OG image yolu
  const currentUrl = url || window.location.href;
  const twitterHandle = '@openwall';

  return (
    <Helmet>
      {/* Temel Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta name="keywords" content={keywords || tags.join(', ')} />
      <meta name="author" content={author || siteName} />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title ? `${title} - ${siteName}` : siteName} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:image" content={image || defaultImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title || siteName} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="tr_TR" />
      
      {/* Enhanced Open Graph for Articles */}
      {type === 'article' && (
        <>
          <meta property="og:article:author" content={author} />
          <meta property="og:article:published_time" content={publishedTime} />
          <meta property="og:article:modified_time" content={modifiedTime || publishedTime} />
          <meta property="og:article:section" content={section} />
          <meta property="og:article:tag" content={tags.join(', ')} />
          {isHighlight && <meta property="og:article:tag" content="Öne Çıkan" />}
        </>
      )}
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={twitterHandle} />
      <meta name="twitter:creator" content={twitterHandle} />
      <meta name="twitter:title" content={title ? `${title} - ${siteName}` : siteName} />
      <meta name="twitter:description" content={description || defaultDescription} />
      <meta name="twitter:image" content={image || defaultImage} />
      <meta name="twitter:image:alt" content={title || siteName} />
      
      {/* Enhanced Twitter Card for Articles */}
      {type === 'article' && (
        <>
          <meta name="twitter:label1" content="Yazar" />
          <meta name="twitter:data1" content={author} />
          <meta name="twitter:label2" content="Okuma Süresi" />
          <meta name="twitter:data2" content={readingTime || 'Bilinmiyor'} />
        </>
      )}
      
      {/* Article Specific Meta Tags */}
      {type === 'article' && (
        <>
          <meta property="article:author" content={author} />
          <meta property="article:published_time" content={publishedTime} />
          <meta property="article:modified_time" content={modifiedTime} />
          <meta property="article:section" content={section} />
          {isHighlight && <meta property="article:tag" content="Öne Çıkan" />}
          {tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
          {/* Yeni eklenen makale meta tag'leri */}
          <meta property="article:content_tier" content="premium" />
          <meta property="article:content_rating" content="general" />
          <meta property="article:content_language" content="tr-TR" />
          <meta property="article:content_region" content="TR" />
          <meta property="article:content_category" content="entellektuel-icerik" />
          <meta property="article:content_type" content="makale" />
          <meta property="article:content_format" content="html" />
          <meta property="article:content_length" content={wordCount ? `${wordCount} kelime` : ''} />
          <meta property="article:reading_time" content={readingTime} />
          <meta property="article:difficulty_level" content="orta" />
          <meta property="article:target_audience" content="entellektuel-kitle" />
        </>
      )}
      
      {/* Canonical URL */}
      <link rel="canonical" href={currentUrl} />
      
      {/* Diğer Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#f97316" />
      <meta name="msapplication-TileColor" content="#f97316" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content={siteName} />
      
      {/* Reading Time ve Word Count */}
      {readingTime && <meta name="article:reading_time" content={readingTime} />}
      {wordCount && <meta name="article:word_count" content={wordCount} />}
      
      {/* Enhanced Hreflang Tags */}
      <link rel="alternate" hrefLang="tr" href={currentUrl} />
      <link rel="alternate" hrefLang="tr-TR" href={currentUrl} />
      <link rel="alternate" hrefLang="x-default" href={currentUrl} />
      
      {/* Additional SEO Meta Tags */}
      <meta name="geo.region" content="TR" />
      <meta name="geo.country" content="Turkey" />
      <meta name="language" content="Turkish" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />
      <meta name="revisit-after" content="1 days" />
      <meta name="expires" content="never" />
      <meta name="cache-control" content="public, max-age=3600" />
      
      {/* Mobile and App Meta Tags */}
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="format-detection" content="telephone=no" />
      
      {/* Security Meta Tags */}
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-Frame-Options" content="SAMEORIGIN" />
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
      
      {/* Preconnect for Performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://openwall.s3.eu-north-1.amazonaws.com" />
      
      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//platform.twitter.com" />
      <link rel="dns-prefetch" href="//www.facebook.com" />
      
      {/* Preload kritik kaynaklar */}
      <link rel="preload" href="/assets/hero.mp4" as="video" type="video/mp4" />
      <link rel="preload" href="/site-logo.png" as="image" />
      
      {/* Resource hints */}
      <link rel="prefetch" href="/articles" />
      <link rel="prefetch" href="/categories" />
    </Helmet>
  );
};

export default MetaTags; 
