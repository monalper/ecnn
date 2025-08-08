// backend/src/controllers/sitemap.controller.js
const { docClient, ARTICLES_TABLE } = require('../config/aws.config');
const { ScanCommand } = require("@aws-sdk/lib-dynamodb");

// Sitemap cache
let sitemapCache = null;
let sitemapLastUpdate = null;
const CACHE_DURATION = 3600000; // 1 saat

const generateSitemap = async (req, res) => {
  try {
    const now = Date.now();
    
    // Cache kontrolü
    if (sitemapCache && sitemapLastUpdate && (now - sitemapLastUpdate) < CACHE_DURATION) {
      res.setHeader('Content-Type', 'application/xml');
      res.setHeader('Cache-Control', 'public, max-age=3600');
      res.setHeader('X-Cache', 'HIT');
      return res.send(sitemapCache);
    }

    const baseUrl = process.env.FRONTEND_URL || 'https://openwall.com.tr';
    const currentDate = new Date().toISOString();
    
    // Statik sayfalar
    const staticPages = [
      { url: '/', priority: '1.0', changefreq: 'daily' },
      { url: '/about', priority: '0.8', changefreq: 'monthly' },
      { url: '/categories', priority: '0.8', changefreq: 'weekly' },
      { url: '/highlights', priority: '0.8', changefreq: 'daily' },
      { url: '/legal/disclaimer', priority: '0.3', changefreq: 'yearly' }
    ];

    // Makaleleri getir
    const articlesCommand = new ScanCommand({
      TableName: ARTICLES_TABLE,
      FilterExpression: 'status = :status',
      ExpressionAttributeValues: {
        ':status': 'published'
      }
    });

    const articlesResult = await docClient.send(articlesCommand);
    const articles = articlesResult.Items || [];

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

    // Makaleleri ekle
    articles.forEach(article => {
      const lastmod = article.updatedAt || article.createdAt || currentDate;
      const priority = article.isHighlight ? '0.9' : '0.7';
      const changefreq = article.isHighlight ? 'weekly' : 'monthly';
      
      sitemap += `  <url>
    <loc>${baseUrl}/articles/${article.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>`;
      
      // Kapak resmi varsa ekle
      if (article.coverImage) {
        sitemap += `
    <image:image>
      <image:loc>${article.coverImage}</image:loc>
      <image:title>${article.title}</image:title>
      <image:caption>${article.description || article.title}</image:caption>
    </image:image>`;
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
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.setHeader('X-Cache', 'MISS');
    res.send(sitemap);

  } catch (error) {
    console.error('Sitemap oluşturulurken hata:', error);
    res.status(500).json({ message: 'Sitemap oluşturulamadı.' });
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
    const baseUrl = process.env.FRONTEND_URL || 'https://openwall.com.tr';
    
    const robotsTxt = `User-agent: *
Allow: /

# Admin sayfalarını engelle
Disallow: /admin/
Disallow: /login

# API endpoint'lerini engelle
Disallow: /api/

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Crawl-delay
Crawl-delay: 1

# Host
Host: ${baseUrl}
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