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
            "@id": data.url || window.location.href
          },
          "articleSection": data.section || "General",
          "keywords": data.keywords || data.tags?.join(', '),
          "wordCount": data.wordCount,
          "timeRequired": data.readingTime,
          // Yeni eklenen alanlar
          "articleBody": data.content,
          "inLanguage": "tr-TR",
          "isAccessibleForFree": true,
          "isPartOf": {
            "@type": "WebSite",
            "name": "Openwall",
            "url": baseUrl
          },
          "about": data.tags || [],
          "mentions": data.references || [],
          "publisherImprint": {
            "@type": "Organization",
            "name": "Openwall",
            "url": baseUrl
          }
        };
        
      case 'WebSite':
        return {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Openwall",
          "url": baseUrl,
          "description": "Openwall, çeşitli alanlarda yazılmış makaleleri okuyun.",
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
          "name": "Openwall",
          "url": baseUrl,
          "logo": `${baseUrl}/logo.png`,
          "description": "Çeşitli alanlarda yazılmış makaleleri okuyun",
          "sameAs": [
            "https://twitter.com/openwall",
            "https://facebook.com/openwall",
            "https://linkedin.com/company/openwall"
          ],
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "email": "info@monologed.com.tr"
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
            "name": "Openwall",
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
        
      case 'VideoObject':
        return {
          "@context": "https://schema.org",
          "@type": "VideoObject",
          "name": data.title,
          "description": data.description,
          "thumbnailUrl": data.thumbnailUrl,
          "uploadDate": data.uploadDate,
          "duration": data.duration,
          "contentUrl": data.videoUrl,
          "embedUrl": data.embedUrl,
          "publisher": {
            "@type": "Organization",
            "name": "Openwall",
            "logo": {
              "@type": "ImageObject",
              "url": `${baseUrl}/logo.png`
            }
          }
        };
        
      case 'ImageObject':
        return {
          "@context": "https://schema.org",
          "@type": "ImageObject",
          "name": data.title,
          "description": data.description,
          "contentUrl": data.imageUrl,
          "thumbnailUrl": data.thumbnailUrl,
          "uploadDate": data.uploadDate,
          "publisher": {
            "@type": "Organization",
            "name": "Openwall"
          }
        };
        
      case 'NASAAPOD':
        return {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": data.title,
          "description": data.description,
          "image": {
            "@type": "ImageObject",
            "url": data.image,
            "contentUrl": data.image,
            "description": data.title,
            "width": 1200,
            "height": 630
          },
          "author": {
            "@type": "Organization",
            "name": "NASA",
            "url": "https://www.nasa.gov"
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
          "dateModified": data.publishedTime,
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": data.url
          },
          "articleSection": "Astronomy",
          "keywords": data.keywords,
          "wordCount": data.wordCount,
          "timeRequired": data.readingTime,
          "articleBody": data.content,
          "inLanguage": "tr-TR",
          "isAccessibleForFree": true,
          "isPartOf": {
            "@type": "WebSite",
            "name": "Openwall",
            "url": baseUrl
          },
          "about": [
            {
              "@type": "Thing",
              "name": "Astronomy",
              "description": "The study of celestial objects and phenomena"
            },
            {
              "@type": "Thing", 
              "name": "Space",
              "description": "The physical universe beyond Earth's atmosphere"
            },
            {
              "@type": "Thing",
              "name": "NASA",
              "description": "National Aeronautics and Space Administration"
            }
          ],
          "mentions": [
            {
              "@type": "Organization",
              "name": "NASA",
              "url": "https://www.nasa.gov"
            }
          ],
          "publisherImprint": {
            "@type": "Organization",
            "name": "Openwall",
            "url": baseUrl
          },
          "copyrightHolder": {
            "@type": "Organization",
            "name": data.copyright || "NASA"
          },
          "copyrightYear": new Date(data.publishedTime).getFullYear(),
          "genre": "Educational",
          "educationalLevel": "Beginner",
          "audience": {
            "@type": "Audience",
            "audienceType": "General Public"
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