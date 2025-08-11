// backend/src/routes/article.routes.js (Herkese Açık Rotalar)
const express = require('express');
const router = express.Router();
const articleController = require('../controllers/article.controller');
const { verifyToken } = require('../middlewares/auth.middleware'); // Opsiyonel, bazı article endpointleri için gerekebilir
const { isAdmin } = require('../middlewares/auth.middleware'); // isAdmin middleware'i

// GET /api/articles -> Tüm yayınlanmış makaleleri listele (status = published)
router.get('/', articleController.listPublishedArticles);

// GET /api/articles/highlighted -> Öne çıkan makaleleri getir (ÖNEMLİ: /:slug'dan önce gelmeli)
router.get('/highlighted', articleController.getHighlightedArticles);

// GET /api/articles/:slug -> Makale detayı
router.get('/:slug', articleController.getArticleBySlug);

// POST /api/articles/:slug/view -> Görüntülenme sayısını artır
router.post('/:slug/view', articleController.incrementViewCount);

// PUT /api/articles/:slug/view-count -> Admin: Görüntülenme sayısını manuel ayarla
router.put('/:slug/view-count', verifyToken, isAdmin, articleController.setViewCount);

module.exports = router;