import React from 'react';
import { Helmet } from 'react-helmet-async';

const MetaTags = ({ 
  title, 
  description, 
  keywords, 
  image, 
  url, 
  type = 'website', 
  author,
  authorHandle, 
  imageWidth = 1200, 
  imageHeight = 630, 
  publishedTime,
  modifiedTime,
  section,
  tags = [],
}) => {
  const siteName = 'The Openwall';
<<<<<<< HEAD
  const fullTitle = title ? `${title} | ${siteName}` : siteName; 
  const defaultDescription = 'The Openwall: Birçok konuda yazılmış denemeleri keşfedin.';
  const defaultImage = 'https://openwall.com.tr/og-images/default/og-default.jpg';
  
  // URL zorunlu (SSR Güvenliği)
  if (!url) {
    console.error("MetaTags component requires a 'url' prop.");
    return null;
  }
  const currentUrl = url;
  
  const siteTwitterHandle = '@openwall';
  
  // Twitter handle normalizasyonu
  const normalizedAuthorHandle = authorHandle 
    ? (authorHandle.startsWith('@') ? authorHandle : `@${authorHandle}`)
    : siteTwitterHandle;
=======
  const fullTitle = isHomepage ? title : (title ? `${title} | ${siteName}` : siteName);
  const defaultDescription = 'The Openwall: Birçok konuda yazılmış denemeleri keşfedin.';
  const defaultImage = 'https://openwall.com.tr/og-images/default/og-default.jpg'; // Güncellenmiş OG image yolu
  const currentUrl = url || window.location.href;
  const twitterHandle = '@openwall';
>>>>>>> 0591475273e82caaef1de2aa2f05a5beff01b793

  return (
    <Helmet>
      {/* Temel Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta name="keywords" content={keywords || tags.join(', ')} />
      <meta name="author" content={author || siteName} />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <link rel="canonical" href={currentUrl} />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} /> 
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={image || defaultImage} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:image:width" content={imageWidth} /> 
      <meta property="og:image:height" content={imageHeight} /> 

      {/* İçerik Spesifik OG Etiketleri */}
      {type === 'article' && (
        <>
          <meta property="article:published_time" content={publishedTime} />
          <meta property="article:modified_time" content={modifiedTime} />
          <meta property="article:section" content={section} />
          {tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={siteTwitterHandle} />
      <meta name="twitter:creator" content={normalizedAuthorHandle} /> 
      <meta name="twitter:title" content={fullTitle} /> 
      <meta name="twitter:description" content={description || defaultDescription} />
      <meta name="twitter:image" content={image || defaultImage} />
      
      {/* Performance Preconnect/DNS Prefetch */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://openwall.s3.eu-north-1.amazonaws.com" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//platform.twitter.com" />
      <link rel="dns-prefetch" href="//www.facebook.com" />
      
    </Helmet>
  );
};

export default MetaTags;