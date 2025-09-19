// backend/src/controllers/sitemap.controller.js
const { docClient, ARTICLES_TABLE, VIDEO_TABLE, GALLERY_TABLE } = require('../config/aws.config');
const { ScanCommand } = require("@aws-sdk/lib-dynamodb");
const VideoModel = require('../models/video.model');
const GalleryModel = require('../models/gallery.model');
const { docClient: dictClient, TABLE_NAME: DICTIONARY_TABLE } = require('../models/dictionary.dynamodb');

// XML escape fonksiyonu
const escapeXml = (unsafe) => {
  if (!unsafe) return '';
  return unsafe.toString()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
};

// Sitemap cache
let sitemapCache = {};
let sitemapLastUpdate = {};
const CACHE_DURATION = 3600000; // 1 saat

// Sitemap index oluştur
const generateSitemapIndex = async (req, res) => {
  try {
    const baseUrl = 'https://openwall.com.tr';
    const currentDate = new Date().toISOString();
    
    const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap-static.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-articles.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-categories.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-videos.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-gallery.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-dictionary.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-news.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
</sitemapindex>`;

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.send(sitemapIndex);

  } catch (error) {
    console.error('Sitemap index oluşturulurken hata:', error);
    res.status(500).json({ message: 'Sitemap index oluşturulamadı.' });
  }
};

// Statik sayfalar sitemap'i
const generateStaticSitemap = async (req, res) => {
  try {
    const now = Date.now();
    const cacheKey = 'static';
    
    if (sitemapCache[cacheKey] && sitemapLastUpdate[cacheKey] && (now - sitemapLastUpdate[cacheKey]) < CACHE_DURATION) {
      res.setHeader('Content-Type', 'application/xml; charset=utf-8');
      res.setHeader('Cache-Control', 'public, max-age=3600');
      res.setHeader('X-Cache', 'HIT');
      return res.send(sitemapCache[cacheKey]);
    }

    const baseUrl = 'https://openwall.com.tr';
    const currentDate = new Date().toISOString();
    
    // Statik sayfalar - daha gerçekçi priority ve changefreq değerleri
    const staticPages = [
      { url: '/', priority: '1.0', changefreq: 'daily' },
      { url: '/articles', priority: '0.9', changefreq: 'daily' },
      { url: '/categories', priority: '0.8', changefreq: 'weekly' },
      { url: '/highlights', priority: '0.8', changefreq: 'daily' },
      { url: '/gallery', priority: '0.6', changefreq: 'weekly' },
      { url: '/videos', priority: '0.6', changefreq: 'weekly' },
      { url: '/dictionary', priority: '0.6', changefreq: 'weekly' },
      { url: '/about', priority: '0.3', changefreq: 'yearly' },
      { url: '/climatechange', priority: '0.4', changefreq: 'monthly' },
      { url: '/legal/disclaimer', priority: '0.2', changefreq: 'yearly' }
    ];

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

    staticPages.forEach(page => {
      sitemap += `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
    });

    sitemap += '</urlset>';

    // Cache'e kaydet
    sitemapCache[cacheKey] = sitemap;
    sitemapLastUpdate[cacheKey] = now;

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.setHeader('X-Cache', 'MISS');
    res.send(sitemap);

  } catch (error) {
    console.error('Statik sitemap oluşturulurken hata:', error);
    res.status(500).json({ message: 'Statik sitemap oluşturulamadı.' });
  }
};

// Makaleler sitemap'i
const generateArticlesSitemap = async (req, res) => {
  try {
    const now = Date.now();
    const cacheKey = 'articles';
    
    if (sitemapCache[cacheKey] && sitemapLastUpdate[cacheKey] && (now - sitemapLastUpdate[cacheKey]) < CACHE_DURATION) {
      res.setHeader('Content-Type', 'application/xml; charset=utf-8');
      res.setHeader('Cache-Control', 'public, max-age=3600');
      res.setHeader('X-Cache', 'HIT');
      return res.send(sitemapCache[cacheKey]);
    }

    const baseUrl = 'https://openwall.com.tr';
    const currentDate = new Date().toISOString();
    
    // Makaleleri getir
    let articles = [];
    try {
      const articlesCommand = new ScanCommand({
        TableName: ARTICLES_TABLE,
        FilterExpression: '#status = :status',
        ExpressionAttributeNames: {
          '#status': 'status'
        },
        ExpressionAttributeValues: {
          ':status': 'published'
        }
      });

      const articlesResult = await docClient.send(articlesCommand);
      articles = articlesResult.Items || [];
    } catch (dbError) {
      console.warn('Makaleler getirilemedi:', dbError.message);
      articles = [];
    }

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

    articles.forEach(article => {
      const lastmod = article.updatedAt || article.createdAt || currentDate;
      const priority = article.isHighlight ? '0.7' : '0.5';
      const changefreq = 'monthly'; // Makaleler genellikle aylık güncellenir
      
      sitemap += `  <url>
    <loc>${baseUrl}/articles/${escapeXml(article.slug)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>`;
      
      // Kapak resmi varsa ekle
      if (article.coverImage) {
        sitemap += `
    <image:image>
      <image:loc>${escapeXml(article.coverImage)}</image:loc>
      <image:title>${escapeXml(article.title)}</image:title>
      <image:caption>${escapeXml(article.description || article.title)}</image:caption>
    </image:image>`;
      }
      
      sitemap += `
  </url>
`;
    });

    sitemap += '</urlset>';

    // Cache'e kaydet
    sitemapCache[cacheKey] = sitemap;
    sitemapLastUpdate[cacheKey] = now;

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.setHeader('X-Cache', 'MISS');
    res.send(sitemap);

  } catch (error) {
    console.error('Makaleler sitemap oluşturulurken hata:', error);
    res.status(500).json({ message: 'Makaleler sitemap oluşturulamadı.' });
  }
};

// Kategoriler sitemap'i
const generateCategoriesSitemap = async (req, res) => {
  try {
    const now = Date.now();
    const cacheKey = 'categories';
    
    if (sitemapCache[cacheKey] && sitemapLastUpdate[cacheKey] && (now - sitemapLastUpdate[cacheKey]) < CACHE_DURATION) {
      res.setHeader('Content-Type', 'application/xml; charset=utf-8');
      res.setHeader('Cache-Control', 'public, max-age=3600');
      res.setHeader('X-Cache', 'HIT');
      return res.send(sitemapCache[cacheKey]);
    }

    const baseUrl = 'https://openwall.com.tr';
    const currentDate = new Date().toISOString();
    
    const categories = [
      'teknoloji', 'felsefe', 'sanat', 'spor', 'siyaset', 'ekonomi', 
      'saglik', 'egitim', 'cevre', 'sosyoloji', 'psikoloji', 'din', 
      'muzik', 'sinema', 'seyahat', 'yemek'
    ];

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

    categories.forEach(category => {
      sitemap += `  <url>
    <loc>${baseUrl}/category/${category}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
    });

    sitemap += '</urlset>';

    // Cache'e kaydet
    sitemapCache[cacheKey] = sitemap;
    sitemapLastUpdate[cacheKey] = now;

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.setHeader('X-Cache', 'MISS');
    res.send(sitemap);

  } catch (error) {
    console.error('Kategoriler sitemap oluşturulurken hata:', error);
    res.status(500).json({ message: 'Kategoriler sitemap oluşturulamadı.' });
  }
};

// Videolar sitemap'i
const generateVideosSitemap = async (req, res) => {
  try {
    const now = Date.now();
    const cacheKey = 'videos';
    
    if (sitemapCache[cacheKey] && sitemapLastUpdate[cacheKey] && (now - sitemapLastUpdate[cacheKey]) < CACHE_DURATION) {
      res.setHeader('Content-Type', 'application/xml; charset=utf-8');
      res.setHeader('Cache-Control', 'public, max-age=3600');
      res.setHeader('X-Cache', 'HIT');
      return res.send(sitemapCache[cacheKey]);
    }

    const baseUrl = 'https://openwall.com.tr';
    const currentDate = new Date().toISOString();
    
    let videos = [];
    try {
      videos = await VideoModel.getAll();
    } catch (dbError) {
      console.warn('Videolar getirilemedi:', dbError.message);
      videos = [];
    }

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

    videos.forEach(video => {
      const lastmod = video.updatedAt || video.createdAt || currentDate;
      
      sitemap += `  <url>
    <loc>${baseUrl}/videos/${escapeXml(video.id)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
`;
    });

    sitemap += '</urlset>';

    // Cache'e kaydet
    sitemapCache[cacheKey] = sitemap;
    sitemapLastUpdate[cacheKey] = now;

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.setHeader('X-Cache', 'MISS');
    res.send(sitemap);

  } catch (error) {
    console.error('Videolar sitemap oluşturulurken hata:', error);
    res.status(500).json({ message: 'Videolar sitemap oluşturulamadı.' });
  }
};

// Galeri sitemap'i
const generateGallerySitemap = async (req, res) => {
  try {
    const now = Date.now();
    const cacheKey = 'gallery';
    
    if (sitemapCache[cacheKey] && sitemapLastUpdate[cacheKey] && (now - sitemapLastUpdate[cacheKey]) < CACHE_DURATION) {
      res.setHeader('Content-Type', 'application/xml; charset=utf-8');
      res.setHeader('Cache-Control', 'public, max-age=3600');
      res.setHeader('X-Cache', 'HIT');
      return res.send(sitemapCache[cacheKey]);
    }

    const baseUrl = 'https://openwall.com.tr';
    const currentDate = new Date().toISOString();
    
    let galleryItems = [];
    try {
      galleryItems = await GalleryModel.getAll();
    } catch (dbError) {
      console.warn('Galeri öğeleri getirilemedi:', dbError.message);
      galleryItems = [];
    }

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

    galleryItems.forEach(item => {
      const lastmod = item.updatedAt || item.createdAt || currentDate;
      
      sitemap += `  <url>
    <loc>${baseUrl}/gallery/${escapeXml(item.id)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
`;
    });

    sitemap += '</urlset>';

    // Cache'e kaydet
    sitemapCache[cacheKey] = sitemap;
    sitemapLastUpdate[cacheKey] = now;

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.setHeader('X-Cache', 'MISS');
    res.send(sitemap);

  } catch (error) {
    console.error('Galeri sitemap oluşturulurken hata:', error);
    res.status(500).json({ message: 'Galeri sitemap oluşturulamadı.' });
  }
};

// Sözlük sitemap'i
const generateDictionarySitemap = async (req, res) => {
  try {
    const now = Date.now();
    const cacheKey = 'dictionary';
    
    if (sitemapCache[cacheKey] && sitemapLastUpdate[cacheKey] && (now - sitemapLastUpdate[cacheKey]) < CACHE_DURATION) {
      res.setHeader('Content-Type', 'application/xml; charset=utf-8');
      res.setHeader('Cache-Control', 'public, max-age=3600');
      res.setHeader('X-Cache', 'HIT');
      return res.send(sitemapCache[cacheKey]);
    }

    const baseUrl = 'https://openwall.com.tr';
    const currentDate = new Date().toISOString();
    
    let dictionaryItems = [];
    try {
      const dictCommand = new ScanCommand({
        TableName: DICTIONARY_TABLE
      });
      const dictResult = await dictClient.send(dictCommand);
      dictionaryItems = dictResult.Items || [];
    } catch (dbError) {
      console.warn('Sözlük öğeleri getirilemedi:', dbError.message);
      dictionaryItems = [];
    }

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

    dictionaryItems.forEach(item => {
      const lastmod = item.updatedAt || item.createdAt || currentDate;
      
      sitemap += `  <url>
    <loc>${baseUrl}/dict/${escapeXml(item.word)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.4</priority>
  </url>
`;
    });

    sitemap += '</urlset>';

    // Cache'e kaydet
    sitemapCache[cacheKey] = sitemap;
    sitemapLastUpdate[cacheKey] = now;

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.setHeader('X-Cache', 'MISS');
    res.send(sitemap);

  } catch (error) {
    console.error('Sözlük sitemap oluşturulurken hata:', error);
    res.status(500).json({ message: 'Sözlük sitemap oluşturulamadı.' });
  }
};

// News sitemap'i (son 48 saatlik içerik)
const generateNewsSitemap = async (req, res) => {
  try {
    const now = Date.now();
    const cacheKey = 'news';
    
    if (sitemapCache[cacheKey] && sitemapLastUpdate[cacheKey] && (now - sitemapLastUpdate[cacheKey]) < CACHE_DURATION) {
      res.setHeader('Content-Type', 'application/xml; charset=utf-8');
      res.setHeader('Cache-Control', 'public, max-age=3600');
      res.setHeader('X-Cache', 'HIT');
      return res.send(sitemapCache[cacheKey]);
    }

    const baseUrl = 'https://openwall.com.tr';
    const currentDate = new Date().toISOString();
    const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
    
    // Son 48 saatlik makaleleri getir
    let recentArticles = [];
    try {
      const articlesCommand = new ScanCommand({
        TableName: ARTICLES_TABLE,
        FilterExpression: '#status = :status AND createdAt > :twoDaysAgo',
        ExpressionAttributeNames: {
          '#status': 'status'
        },
        ExpressionAttributeValues: {
          ':status': 'published',
          ':twoDaysAgo': twoDaysAgo
        }
      });

      const articlesResult = await docClient.send(articlesCommand);
      recentArticles = articlesResult.Items || [];
    } catch (dbError) {
      console.warn('Son makaleler getirilemedi:', dbError.message);
      recentArticles = [];
    }

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
`;

    recentArticles.forEach(article => {
      sitemap += `  <url>
    <loc>${baseUrl}/articles/${escapeXml(article.slug)}</loc>
    <lastmod>${article.updatedAt || article.createdAt}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
    <news:news>
      <news:publication>
        <news:name>The Openwall</news:name>
        <news:language>tr</news:language>
      </news:publication>
      <news:publication_date>${article.createdAt}</news:publication_date>
      <news:title>${escapeXml(article.title)}</news:title>
      <news:keywords>${escapeXml(article.tags ? article.tags.join(',') : '')}</news:keywords>
      <news:stock_tickers>${escapeXml(article.categories ? article.categories.join(',') : '')}</news:stock_tickers>
    </news:news>
  </url>
`;
    });

    sitemap += '</urlset>';

    // Cache'e kaydet
    sitemapCache[cacheKey] = sitemap;
    sitemapLastUpdate[cacheKey] = now;

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.setHeader('X-Cache', 'MISS');
    res.send(sitemap);

  } catch (error) {
    console.error('News sitemap oluşturulurken hata:', error);
    res.status(500).json({ message: 'News sitemap oluşturulamadı.' });
  }
};

// Eski sitemap fonksiyonu (geriye dönük uyumluluk için)
const generateSitemap = generateSitemapIndex;

// Sitemap cache'ini temizle (makale güncellendiğinde çağrılır)
const clearSitemapCache = () => {
  sitemapCache = {};
  sitemapLastUpdate = {};
  console.log('Sitemap cache temizlendi');
};

// Robots.txt oluştur
const generateRobotsTxt = async (req, res) => {
  try {
    const baseUrl = 'https://openwall.com.tr';
    
    const robotsTxt = `User-agent: *
Allow: /

# Ana içerik sayfaları - tam erişim
Allow: /articles/
Allow: /categories/
Allow: /highlights/
Allow: /gallery/
Allow: /videos/
Allow: /dictionary/
Allow: /about/
Allow: /climatechange/

# Kategori sayfaları
Allow: /category/

# Statik dosyalar
Allow: /images/
Allow: /og-images/
Allow: /assets/
Allow: /css/
Allow: /js/

# Admin sayfalarını engelle
Disallow: /admin/
Disallow: /login
Disallow: /register
Disallow: /profile/
Disallow: /dashboard/

# API endpoint'lerini engelle
Disallow: /api/
Disallow: /private/

# Next.js sistem dosyalarını engelle
Disallow: /_next/
Disallow: /static/

# Sitemap Index
Sitemap: ${baseUrl}/sitemap.xml

# Host
Host: ${baseUrl}

# Crawl-delay (makale sayfaları için optimize)
Crawl-delay: 1

# Google için özel kurallar
User-agent: Googlebot
Allow: /articles/
Allow: /categories/
Allow: /highlights/
Allow: /gallery/
Allow: /videos/
Allow: /dictionary/
Crawl-delay: 0.5

# Bing için özel kurallar
User-agent: Bingbot
Allow: /articles/
Allow: /categories/
Allow: /highlights/
Allow: /gallery/
Allow: /videos/
Allow: /dictionary/
Crawl-delay: 0.5

# Yandex için özel kurallar
User-agent: YandexBot
Allow: /articles/
Allow: /categories/
Allow: /highlights/
Allow: /gallery/
Allow: /videos/
Allow: /dictionary/
Crawl-delay: 0.5

# Site bilgileri
# The Openwall - Türkçe entellektüel içerik platformu
# 16 farklı kategoride makale, video ve görsel içerik
# Günlük güncellenen içerikler
`;

    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Cache-Control', 'public, max-age=86400'); // 24 saat cache
    res.send(robotsTxt);

  } catch (error) {
    console.error('Robots.txt oluşturulurken hata:', error);
    res.status(500).json({ message: 'Robots.txt oluşturulamadı.' });
  }
};

module.exports = {
  generateSitemap,
  generateSitemapIndex,
  generateStaticSitemap,
  generateArticlesSitemap,
  generateCategoriesSitemap,
  generateVideosSitemap,
  generateGallerySitemap,
  generateDictionarySitemap,
  generateNewsSitemap,
  generateRobotsTxt,
  clearSitemapCache
}; 
