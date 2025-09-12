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
  const defaultDescription = 'OpenWall, çeşitli alanlarda yazılmış makaleleri okuyun.';
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
      <meta property="og:title" content={title || siteName} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:image" content={image || defaultImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title || siteName} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="tr_TR" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={twitterHandle} />
      <meta name="twitter:creator" content={twitterHandle} />
      <meta name="twitter:title" content={title || siteName} />
      <meta name="twitter:description" content={description || defaultDescription} />
      <meta name="twitter:image" content={image || defaultImage} />
      <meta name="twitter:image:alt" content={title || siteName} />
      
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
      
      {/* Hreflang Tags */}
      <link rel="alternate" hrefLang="tr" href={currentUrl} />
      <link rel="alternate" hrefLang="x-default" href={currentUrl} />
      
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
