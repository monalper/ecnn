// frontend/scripts/generate-sitemaps.cjs
const fs = require('fs');
const path = require('path');
const https = require('https');

// Backend API base URL
const BACKEND_URL = process.env.VITE_BACKEND_URL || 'https://ecnn-backend.vercel.app';
const BASE_URL = process.env.VITE_BASE_URL || 'https://openwall.com.tr';

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

// API çağrısı yapmak için helper fonksiyon
const fetchFromAPI = (endpoint) => {
  return new Promise((resolve, reject) => {
    const url = `${BACKEND_URL}${endpoint}`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
};

// Statik sayfalar sitemap'i oluştur
const generateStaticSitemap = () => {
  const currentDate = new Date().toISOString();
  
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
    <loc>${BASE_URL}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
  });

  sitemap += '</urlset>';
  return sitemap;
};

// Kategoriler sitemap'i oluştur
const generateCategoriesSitemap = () => {
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
    <loc>${BASE_URL}/category/${category}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
  });

  sitemap += '</urlset>';
  return sitemap;
};

// Makaleler sitemap'i oluştur
const generateArticlesSitemap = async () => {
  try {
    const articles = await fetchFromAPI('/api/articles');
    const currentDate = new Date().toISOString();

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

    articles.forEach(article => {
      const lastmod = article.updatedAt || article.createdAt || currentDate;
      const priority = article.isHighlight ? '0.7' : '0.5';
      const changefreq = 'monthly';
      
      sitemap += `  <url>
    <loc>${BASE_URL}/articles/${escapeXml(article.slug)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>`;
      
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
    return sitemap;
  } catch (error) {
    console.warn('Makaleler getirilemedi, mock data ile sitemap oluşturuluyor:', error.message);
    
    // Mock data ile sitemap oluştur
    const currentDate = new Date().toISOString();
    const mockArticles = [
      {
        slug: 'ornek-makale-1',
        title: 'Örnek Makale 1',
        description: 'Bu bir örnek makaledir',
        createdAt: currentDate,
        updatedAt: currentDate,
        isHighlight: true,
        coverImage: 'https://openwall.com.tr/images/example1.jpg'
      },
      {
        slug: 'ornek-makale-2',
        title: 'Örnek Makale 2',
        description: 'Bu da bir örnek makaledir',
        createdAt: currentDate,
        updatedAt: currentDate,
        isHighlight: false,
        coverImage: null
      }
    ];

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

    mockArticles.forEach(article => {
      const lastmod = article.updatedAt || article.createdAt || currentDate;
      const priority = article.isHighlight ? '0.7' : '0.5';
      const changefreq = 'monthly';
      
      sitemap += `  <url>
    <loc>${BASE_URL}/articles/${escapeXml(article.slug)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>`;
      
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
    return sitemap;
  }
};

// Videolar sitemap'i oluştur
const generateVideosSitemap = async () => {
  try {
    const videos = await fetchFromAPI('/api/videos');
    const currentDate = new Date().toISOString();

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

    videos.forEach(video => {
      const lastmod = video.updatedAt || video.createdAt || currentDate;
      
      sitemap += `  <url>
    <loc>${BASE_URL}/videos/${escapeXml(video.id)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
`;
    });

    sitemap += '</urlset>';
    return sitemap;
  } catch (error) {
    console.warn('Videolar getirilemedi, mock data ile sitemap oluşturuluyor:', error.message);
    
    // Mock data ile sitemap oluştur
    const currentDate = new Date().toISOString();
    const mockVideos = [
      {
        id: 'video-1',
        title: 'Örnek Video 1',
        createdAt: currentDate,
        updatedAt: currentDate
      },
      {
        id: 'video-2',
        title: 'Örnek Video 2',
        createdAt: currentDate,
        updatedAt: currentDate
      }
    ];

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

    mockVideos.forEach(video => {
      const lastmod = video.updatedAt || video.createdAt || currentDate;
      
      sitemap += `  <url>
    <loc>${BASE_URL}/videos/${escapeXml(video.id)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
`;
    });

    sitemap += '</urlset>';
    return sitemap;
  }
};

// Galeri sitemap'i oluştur
const generateGallerySitemap = async () => {
  try {
    const galleryItems = await fetchFromAPI('/api/gallery');
    const currentDate = new Date().toISOString();

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

    galleryItems.forEach(item => {
      const lastmod = item.updatedAt || item.createdAt || currentDate;
      
      sitemap += `  <url>
    <loc>${BASE_URL}/gallery/${escapeXml(item.id)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
`;
    });

    sitemap += '</urlset>';
    return sitemap;
  } catch (error) {
    console.warn('Galeri öğeleri getirilemedi, mock data ile sitemap oluşturuluyor:', error.message);
    
    // Mock data ile sitemap oluştur
    const currentDate = new Date().toISOString();
    const mockGalleryItems = [
      {
        id: 'gallery-1',
        title: 'Örnek Galeri 1',
        createdAt: currentDate,
        updatedAt: currentDate
      },
      {
        id: 'gallery-2',
        title: 'Örnek Galeri 2',
        createdAt: currentDate,
        updatedAt: currentDate
      }
    ];

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

    mockGalleryItems.forEach(item => {
      const lastmod = item.updatedAt || item.createdAt || currentDate;
      
      sitemap += `  <url>
    <loc>${BASE_URL}/gallery/${escapeXml(item.id)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
`;
    });

    sitemap += '</urlset>';
    return sitemap;
  }
};

// Sözlük sitemap'i oluştur
const generateDictionarySitemap = async () => {
  try {
    const dictionaryItems = await fetchFromAPI('/api/dictionary');
    const currentDate = new Date().toISOString();

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

    dictionaryItems.forEach(item => {
      const lastmod = item.updatedAt || item.createdAt || currentDate;
      
      sitemap += `  <url>
    <loc>${BASE_URL}/dict/${escapeXml(item.word)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.4</priority>
  </url>
`;
    });

    sitemap += '</urlset>';
    return sitemap;
  } catch (error) {
    console.warn('Sözlük öğeleri getirilemedi, mock data ile sitemap oluşturuluyor:', error.message);
    
    // Mock data ile sitemap oluştur
    const currentDate = new Date().toISOString();
    const mockDictionaryItems = [
      {
        word: 'teknoloji',
        definition: 'Teknoloji tanımı',
        createdAt: currentDate,
        updatedAt: currentDate
      },
      {
        word: 'felsefe',
        definition: 'Felsefe tanımı',
        createdAt: currentDate,
        updatedAt: currentDate
      }
    ];

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

    mockDictionaryItems.forEach(item => {
      const lastmod = item.updatedAt || item.createdAt || currentDate;
      
      sitemap += `  <url>
    <loc>${BASE_URL}/dict/${escapeXml(item.word)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.4</priority>
  </url>
`;
    });

    sitemap += '</urlset>';
    return sitemap;
  }
};

// News sitemap'i oluştur (son 48 saatlik içerik)
const generateNewsSitemap = async () => {
  try {
    const articles = await fetchFromAPI('/api/articles');
    const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
    
    // Son 48 saatlik makaleleri filtrele
    const recentArticles = articles.filter(article => 
      new Date(article.createdAt) > new Date(twoDaysAgo)
    );

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
`;

    recentArticles.forEach(article => {
      sitemap += `  <url>
    <loc>${BASE_URL}/articles/${escapeXml(article.slug)}</loc>
    <lastmod>${article.updatedAt || article.createdAt}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
    <news:news>
      <news:publication>
        <news:name>OpenWall</news:name>
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
    return sitemap;
  } catch (error) {
    console.warn('News sitemap oluşturulamadı, boş sitemap oluşturuluyor:', error.message);
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
</urlset>`;
  }
};

// Sitemap index oluştur
const generateSitemapIndex = () => {
  const currentDate = new Date().toISOString();
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${BASE_URL}/sitemap-static.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${BASE_URL}/sitemap-articles.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${BASE_URL}/sitemap-categories.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${BASE_URL}/sitemap-videos.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${BASE_URL}/sitemap-gallery.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${BASE_URL}/sitemap-dictionary.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${BASE_URL}/sitemap-news.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
</sitemapindex>`;
};

// Ana fonksiyon
const generateAllSitemaps = async () => {
  console.log('🚀 Sitemap\'ler oluşturuluyor...');
  
  const publicDir = path.join(__dirname, '../public');
  
  try {
    // Statik sitemap'ler
    console.log('📄 Statik sitemap oluşturuluyor...');
    fs.writeFileSync(path.join(publicDir, 'sitemap-static.xml'), generateStaticSitemap());
    
    console.log('📂 Kategoriler sitemap oluşturuluyor...');
    fs.writeFileSync(path.join(publicDir, 'sitemap-categories.xml'), generateCategoriesSitemap());
    
    // Dinamik sitemap'ler
    console.log('📰 Makaleler sitemap oluşturuluyor...');
    fs.writeFileSync(path.join(publicDir, 'sitemap-articles.xml'), await generateArticlesSitemap());
    
    console.log('🎥 Videolar sitemap oluşturuluyor...');
    fs.writeFileSync(path.join(publicDir, 'sitemap-videos.xml'), await generateVideosSitemap());
    
    console.log('🖼️ Galeri sitemap oluşturuluyor...');
    fs.writeFileSync(path.join(publicDir, 'sitemap-gallery.xml'), await generateGallerySitemap());
    
    console.log('📚 Sözlük sitemap oluşturuluyor...');
    fs.writeFileSync(path.join(publicDir, 'sitemap-dictionary.xml'), await generateDictionarySitemap());
    
    console.log('📰 News sitemap oluşturuluyor...');
    fs.writeFileSync(path.join(publicDir, 'sitemap-news.xml'), await generateNewsSitemap());
    
    // Ana sitemap index
    console.log('📋 Sitemap index oluşturuluyor...');
    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), generateSitemapIndex());
    
    console.log('✅ Tüm sitemap\'ler başarıyla oluşturuldu!');
    console.log(`📍 Sitemap index: ${BASE_URL}/sitemap.xml`);
    
  } catch (error) {
    console.error('❌ Sitemap oluşturulurken hata:', error);
    process.exit(1);
  }
};

// Script çalıştırıldığında
if (require.main === module) {
  generateAllSitemaps();
}

module.exports = { generateAllSitemaps };
