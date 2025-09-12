const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');
const videoController = require('../controllers/video.controller');

// Public routes (no authentication required)
router.get('/', videoController.getAllVideoItems);
router.get('/:id', videoController.getVideoItemById);

// Admin routes (authentication and admin role required)
router.post('/', verifyToken, isAdmin, videoController.createVideoItem);
router.put('/:id', verifyToken, isAdmin, videoController.updateVideoItem);
router.delete('/:id', verifyToken, isAdmin, videoController.deleteVideoItem);

// Video upload routes (admin only)
router.post('/upload', verifyToken, isAdmin, videoController.getPresignedUrlForVideoUpload);
router.post('/upload-thumbnail', verifyToken, isAdmin, videoController.getPresignedUrlForThumbnailUpload);
router.post('/upload-subtitle', verifyToken, isAdmin, videoController.getPresignedUrlForSubtitleUpload);

module.exports = router; 