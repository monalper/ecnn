// backend/src/routes/banner.routes.js
const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/banner.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Public routes
router.get('/active', bannerController.getActiveBanners);

// Admin routes - authentication required
router.use(authMiddleware.verifyToken);
router.use(authMiddleware.isAdmin);

router.get('/', bannerController.getAllBanners);
router.post('/', bannerController.createBanner);
router.put('/:bannerId', bannerController.updateBanner);
router.delete('/:bannerId', bannerController.deleteBanner);
router.patch('/:bannerId/toggle', bannerController.toggleBannerStatus);

module.exports = router;
