// Yorumlarda makale linklerini tespit etme ve işleme utility fonksiyonları

// Desteklenen site URL'lerini belirle
const getSupportedSiteUrls = () => {
  if (typeof window !== 'undefined') {
    return [
      window.location.origin, // Mevcut domain
      'https://www.openwall.com.tr', // Production domain
      'https://openwall.com.tr', // Production domain (www olmadan)
      'http://localhost:5173', // Development domain
      'http://localhost:3000' // Alternatif development domain
    ];
  }
  return [
    'https://www.openwall.com.tr',
    'https://openwall.com.tr',
    'http://localhost:5173',
    'http://localhost:3000'
  ];
};

// Makale slug'ını URL'den çıkarma
const extractArticleSlugFromUrl = (url) => {
  try {
    const urlObj = new URL(url);
    const supportedUrls = getSupportedSiteUrls();
    
    // Desteklenen URL'lerden birini kontrol et
    const isSupportedUrl = supportedUrls.some(supportedUrl => {
      try {
        const supportedUrlObj = new URL(supportedUrl);
        return urlObj.origin === supportedUrlObj.origin;
      } catch {
        return false;
      }
    });
    
    if (!isSupportedUrl) {
      return null;
    }
    
    // /articles/slug pattern'ini kontrol et
    const articleMatch = urlObj.pathname.match(/^\/articles\/([^\/]+)$/);
    if (articleMatch) {
      return articleMatch[1];
    }
    
    return null;
  } catch (error) {
    console.error('URL parse hatası:', error);
    return null;
  }
};

// Yorum içeriğindeki makale linklerini tespit et
export const findArticleLinksInComment = (content) => {
  if (!content || typeof content !== 'string') {
    return [];
  }
  
  // URL pattern'ini bul (http/https ile başlayan, www ile başlayan veya domain ile başlayan)
  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|openwall\.com\.tr\/articles\/[^\s]+)/g;
  const urls = content.match(urlRegex) || [];
  
  const articleLinks = [];
  
  urls.forEach(url => {
    let normalizedUrl = url;
    
    // www ile başlayan URL'leri https:// ile başlat
    if (url.startsWith('www.')) {
      normalizedUrl = `https://${url}`;
    }
    // openwall.com.tr ile başlayan URL'leri https:// ile başlat
    else if (url.startsWith('openwall.com.tr/')) {
      normalizedUrl = `https://${url}`;
    }
    
    const slug = extractArticleSlugFromUrl(normalizedUrl);
    if (slug) {
      articleLinks.push({
        url: normalizedUrl,
        slug,
        originalUrl: url
      });
    }
  });
  
  return articleLinks;
};

// Yorum içeriğinden makale linklerini kaldır ve temiz içerik döndür
export const removeArticleLinksFromContent = (content, articleLinks) => {
  if (!content || !articleLinks || articleLinks.length === 0) {
    return content;
  }
  
  let cleanContent = content;
  
  articleLinks.forEach(link => {
    // URL'yi içerikten kaldır - sadece makale linklerini kaldır
    // Regex ile tam eşleşme yaparak sadece makale linklerini kaldır
    const linkRegex = new RegExp(link.originalUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    cleanContent = cleanContent.replace(linkRegex, '').trim();
  });
  
  // Fazla boşlukları temizle ama çok fazla temizleme yapma
  cleanContent = cleanContent.replace(/\s{2,}/g, ' ').trim();
  
  return cleanContent;
};

// Site dışı linkleri tespit et
export const findExternalLinksInComment = (content) => {
  if (!content || typeof content !== 'string') {
    return [];
  }
  
  // URL pattern'ini bul (http/https ile başlayan, www ile başlayan veya domain ile başlayan)
  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.[a-zA-Z]{2,}(?:\/[^\s]*)?|github\.com(?:\/[^\s]*)?)/g;
  const urls = content.match(urlRegex) || [];
  
  const supportedUrls = getSupportedSiteUrls();
  const externalLinks = [];
  
  urls.forEach(url => {
    let normalizedUrl = url;
    
    // www ile başlayan URL'leri https:// ile başlat
    if (url.startsWith('www.')) {
      normalizedUrl = `https://${url}`;
    }
    // Domain ile başlayan URL'leri https:// ile başlat (openwall.com.tr hariç)
    else if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('openwall.com.tr/')) {
      normalizedUrl = `https://${url}`;
    }
    
    try {
      const urlObj = new URL(normalizedUrl);
      
      // Desteklenen URL'lerden biri değilse external link
      const isSupportedUrl = supportedUrls.some(supportedUrl => {
        try {
          const supportedUrlObj = new URL(supportedUrl);
          return urlObj.origin === supportedUrlObj.origin;
        } catch {
          return false;
        }
      });
      
      if (!isSupportedUrl) {
        externalLinks.push({
          url: normalizedUrl,
          originalUrl: url
        });
      }
    } catch (error) {
      console.error('External URL parse hatası:', error);
    }
  });
  
  return externalLinks;
};

// Yorum içeriğini işle ve makale linklerini ayır
export const processCommentContent = (content) => {
  if (!content || typeof content !== 'string') {
    return {
      cleanContent: '',
      articleLinks: [],
      externalLinks: [],
      hasArticleLinks: false,
      hasExternalLinks: false
    };
  }

  const articleLinks = findArticleLinksInComment(content);
  const externalLinks = findExternalLinksInComment(content);
  
  // Makale linklerini kaldır ama external linkleri koru
  let cleanContent = content;
  
  // Sadece makale linklerini kaldır
  articleLinks.forEach(link => {
    const linkRegex = new RegExp(link.originalUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    cleanContent = cleanContent.replace(linkRegex, '').trim();
  });
  
  // Fazla boşlukları temizle
  cleanContent = cleanContent.replace(/\s{2,}/g, ' ').trim();
  
  return {
    cleanContent,
    articleLinks,
    externalLinks,
    hasArticleLinks: articleLinks.length > 0,
    hasExternalLinks: externalLinks.length > 0
  };
};
