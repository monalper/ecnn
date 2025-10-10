import React from 'react';
import { Helmet } from 'react-helmet-async';

const SchemaMarkup = ({ 
  type = 'Article',
  data = {},
  breadcrumbs = [],
  organization = {},
  readingTimeMinutes 
}) => {
  const baseUrl = 'https://openwall.com.tr';
  
  const generateSchema = () => {
    switch (type) {
      case 'Article':
      case 'NewsArticle':
        // URL'nin prop olarak gelmesi zorunlu (SSR Güvenliği)
        if (!data.url) {
            console.error(`${type} Schema requires a 'data.url' property.`);
            return null;
        }
        
        const timeRequired = readingTimeMinutes ? `PT${readingTimeMinutes}M` : undefined;

        return {
          "@context": "https://schema.org",
          "@type": type,
          "headline": data.title,
          "description": data.description,
          "image": data.image || `${baseUrl}/og-images/default/og-default.jpg`,
          "author": {
            "@type": "Person",
            "name": data.author || "Openwall"
          },
          "publisher": {
            "@type": "Organization",
            "name": "Openwall",
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
            // SSR'da güvenli kullanım
            "@id": data.url 
          },
          "inLanguage": "tr", 
          ...(timeRequired && { "timeRequired": timeRequired }), 
          
          ...(type === 'NewsArticle' && {
            "isAccessibleForFree": true, 
          }),
        };

      case 'WebSite':
        return {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "url": baseUrl,
          "name": "The Openwall",
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
          "name": organization.name || "The Openwall",
          "url": organization.url || baseUrl,
          "logo": {
            "@type": "ImageObject",
            "url": organization.logo || `${baseUrl}/logo.png`
          },
          "sameAs": organization.sameAs || [
            "https://twitter.com/openwall",
            "https://facebook.com/openwall",
            "https://linkedin.com/company/openwall"
          ]
        };

      case 'BreadcrumbList':
        if (breadcrumbs.length === 0) return null;
        return {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": breadcrumbs.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": item.item || undefined
          }))
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
        {JSON.stringify(schema, null, 2)}
      </script>
    </Helmet>
  );
};

export default SchemaMarkup;