const express = require('express');
const router = express.Router();
const shortlinkController = require('./shortlink.controller');

// Kısa link oluşturma
router.post('/', shortlinkController.createShortlink);

// Kısa linkten yönlendirme
router.get('/:shortId', shortlinkController.redirectShortlink);

// Test endpoint'i - tüm kısa linkleri listele
router.get('/list/all', shortlinkController.listShortlinks);

module.exports = router;
