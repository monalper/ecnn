import React from 'react';
import { Helmet } from 'react-helmet-async';

const SchemaMarkup = ({ 
  type = 'Article',
  data = {},
  breadcrumbs = [],
  organization = {}
}) => {
  const baseUrl = 'https://openwall.com.tr';
  
  const generateSchema = () => {
    switch (type) {
      case 'Article':
        return {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": data.title,
          "description": data.description,
          "image": data.image || `${baseUrl}/og-image.jpg`,
          "author": {
            "@type": "Person",
            "name": data.author || "OpenWall"
          },
          "publisher": {
            "@type": "Organization",
            "name": "OpenWall",
            "logo": {
              "@type": "ImageObject",
              "url": `${baseUrl}/logo.png`
            },
            "url": baseUrl
          },
          "datePublished": data.publishedTime,
          "dateModified": data.modifiedTime,
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": data.url || window.location.href
          },
          "articleSection": data.section || "General",
          "keywords": data.keywords || data.tags?.join(', '),
          "wordCount": data.wordCount,
          "timeRequired": data.readingTime
        };
        
      case 'WebSite':
        return {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "OpenWall",
          "url": baseUrl,
          "description": "OpenWall - Teknoloji, felsefe, sanat, spor, siyaset, ekonomi, sağlık, eğitim, çevre, sosyoloji, psikoloji, din, müzik, sinema, seyahat ve yemek gibi çeşitli alanlarda kaliteli içerikler sunan kapsamlı platform.",
          "potentialAction": {
            "@type": "SearchAction",
            "target": `${baseUrl}/search?q={search_term_string}`,
            "query-input": "required name=search_term_string"
          }
        };
        
      case 'Organization':
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "OpenWall",
          "url": baseUrl,
          "logo": `${baseUrl}/logo.png`,
          "description": "Çeşitli alanlarda kaliteli içerikler sunan kapsamlı platform",
          "sameAs": [
            "https://twitter.com/openwall",
            "https://facebook.com/openwall",
            "https://linkedin.com/company/openwall"
          ],
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "email": "info@openwall.com.tr"
          }
        };
        
      case 'BreadcrumbList':
        return {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": breadcrumbs.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": item.url
          }))
        };
        
      case 'NewsArticle':
        return {
          "@context": "https://schema.org",
          "@type": "NewsArticle",
          "headline": data.title,
          "description": data.description,
          "image": data.image,
          "author": {
            "@type": "Person",
            "name": data.author
          },
          "publisher": {
            "@type": "Organization",
            "name": "OpenWall",
            "logo": {
              "@type": "ImageObject",
              "url": `${baseUrl}/logo.png`
            }
          },
          "datePublished": data.publishedTime,
          "dateModified": data.modifiedTime,
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": data.url
          }
        };
        
      default:
        return null;
    }
  };

  const schema = generateSchema();
  
  if (!schema) return null;

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

export default SchemaMarkup; 