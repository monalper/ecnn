const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');
const galleryController = require('../controllers/gallery.controller');

// Public routes (no authentication required)
router.get('/', galleryController.getAllGalleryItems);
router.get('/:id', galleryController.getGalleryItemById);

// Admin routes (authentication and admin role required)
router.post('/', verifyToken, isAdmin, galleryController.createGalleryItem);
router.put('/:id', verifyToken, isAdmin, galleryController.updateGalleryItem);
router.delete('/:id', verifyToken, isAdmin, galleryController.deleteGalleryItem);

// Gallery image upload route (admin only)
router.post('/upload', verifyToken, isAdmin, galleryController.getPresignedUrlForGalleryImage);

module.exports = router; 