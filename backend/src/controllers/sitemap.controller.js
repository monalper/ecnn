// backend/src/controllers/sitemap.controller.js
const { docClient, ARTICLES_TABLE } = require('../config/aws.config');
const { ScanCommand } = require("@aws-sdk/lib-dynamodb");

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
let sitemapCache = null;
let sitemapLastUpdate = null;
const CACHE_DURATION = 3600000; // 1 saat

const generateSitemap = async (req, res) => {
  try {
    const now = Date.now();
    
    // Cache'i geçici olarak devre dışı bırak
    // if (sitemapCache && sitemapLastUpdate && (now - sitemapLastUpdate) < CACHE_DURATION) {
    //   res.setHeader('Content-Type', 'application/xml');
    //   res.setHeader('Cache-Control', 'public, max-age=3600');
    //   res.setHeader('X-Cache', 'HIT');
    //   return res.send(sitemapCache);
    // }

    const baseUrl = 'https://openwall.com.tr';
    const currentDate = new Date().toISOString();
    
    // Statik sayfalar
    const staticPages = [
      { url: '/', priority: '1.0', changefreq: 'daily' },
      { url: '/articles', priority: '0.9', changefreq: 'daily' },
      { url: '/categories', priority: '0.9', changefreq: 'weekly' },
      { url: '/highlights', priority: '0.9', changefreq: 'daily' },
      { url: '/gallery', priority: '0.8', changefreq: 'weekly' },
      { url: '/videos', priority: '0.8', changefreq: 'weekly' },
      { url: '/dictionary', priority: '0.8', changefreq: 'weekly' },
      { url: '/about', priority: '0.7', changefreq: 'monthly' },
      { url: '/climatechange', priority: '0.7', changefreq: 'weekly' },
      { url: '/legal/disclaimer', priority: '0.3', changefreq: 'yearly' }
    ];

    // Kategori sayfaları
    const categories = [
      'teknoloji', 'felsefe', 'sanat', 'spor', 'siyaset', 'ekonomi', 
      'saglik', 'egitim', 'cevre', 'sosyoloji', 'psikoloji', 'din', 
      'muzik', 'sinema', 'seyahat', 'yemek'
    ];

    // Makaleleri getir (hata durumunda boş array döndür)
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
      console.warn('Makaleler getirilemedi, sadece statik sayfalar eklenecek:', dbError.message);
      articles = [];
    }

    // XML sitemap oluştur
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

    // Statik sayfaları ekle
    staticPages.forEach(page => {
      sitemap += `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
    });

    // Kategori sayfalarını ekle
    categories.forEach(category => {
      sitemap += `  <url>
    <loc>${baseUrl}/category/${category}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
    });

    // Makaleleri ekle
    articles.forEach(article => {
      const lastmod = article.updatedAt || article.createdAt || currentDate;
      const priority = article.isHighlight ? '0.9' : '0.7';
      const changefreq = article.isHighlight ? 'weekly' : 'monthly';
      
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
      
      // Makale içerik bilgileri ekle
      if (article.content) {
        const wordCount = article.content.replace(/<[^>]+>/g, '').split(/\s+/).length;
        sitemap += `
    <news:news>
      <news:publication>
        <news:name>OpenWall</news:name>
        <news:language>tr</news:language>
      </news:publication>
      <news:publication_date>${article.createdAt}</news:publication_date>
      <news:title>${escapeXml(article.title)}</news:title>
      <news:keywords>${escapeXml(article.tags ? article.tags.join(',') : '')}</news:keywords>
      <news:stock_tickers>${escapeXml(article.categories ? article.categories.join(',') : '')}</news:stock_tickers>
    </news:news>`;
      }
      
      sitemap += `
  </url>
`;
    });

    sitemap += '</urlset>';

    // Cache'e kaydet
    sitemapCache = sitemap;
    sitemapLastUpdate = now;

    // XML response olarak gönder
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.setHeader('X-Cache', 'MISS');
    res.send(sitemap);

  } catch (error) {
    console.error('Sitemap oluşturulurken hata:', error);
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.status(500).send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://openwall.com.tr/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`);
  }
};

// Sitemap cache'ini temizle (makale güncellendiğinde çağrılır)
const clearSitemapCache = () => {
  sitemapCache = null;
  sitemapLastUpdate = null;
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

# Sitemap
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
# OpenWall - Türkçe entellektüel içerik platformu
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
  generateRobotsTxt,
  clearSitemapCache
}; 
