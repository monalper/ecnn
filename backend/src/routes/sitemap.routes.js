const express = require('express');
const router = express.Router();
const sitemapController = require('../controllers/sitemap.controller');

// GET /sitemap.xml -> Sitemap index (ana sitemap)
router.get('/sitemap.xml', sitemapController.generateSitemapIndex);

// GET /sitemap-static.xml -> Statik sayfalar sitemap'i
router.get('/sitemap-static.xml', sitemapController.generateStaticSitemap);

// GET /sitemap-articles.xml -> Makaleler sitemap'i
router.get('/sitemap-articles.xml', sitemapController.generateArticlesSitemap);

// GET /sitemap-categories.xml -> Kategoriler sitemap'i
router.get('/sitemap-categories.xml', sitemapController.generateCategoriesSitemap);

// GET /sitemap-videos.xml -> Videolar sitemap'i
router.get('/sitemap-videos.xml', sitemapController.generateVideosSitemap);

// GET /sitemap-gallery.xml -> Galeri sitemap'i
router.get('/sitemap-gallery.xml', sitemapController.generateGallerySitemap);

// GET /sitemap-dictionary.xml -> Sözlük sitemap'i
router.get('/sitemap-dictionary.xml', sitemapController.generateDictionarySitemap);

// GET /sitemap-news.xml -> News sitemap'i (son 48 saatlik içerik)
router.get('/sitemap-news.xml', sitemapController.generateNewsSitemap);

// GET /robots.txt -> Robots.txt
router.get('/robots.txt', sitemapController.generateRobotsTxt);

module.exports = router; 