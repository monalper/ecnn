const express = require('express');
const router = express.Router();
const sitemapController = require('../controllers/sitemap.controller');

// GET /sitemap.xml -> XML sitemap
router.get('/sitemap.xml', sitemapController.generateSitemap);

// GET /robots.txt -> Robots.txt
router.get('/robots.txt', sitemapController.generateRobotsTxt);

module.exports = router; 