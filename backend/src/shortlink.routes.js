const express = require('express');
const router = express.Router();
const shortlinkController = require('./shortlink.controller');

// Kısa link oluşturma
router.post('/', shortlinkController.createShortlink);

// Kısa linkten yönlendirme
router.get('/:shortId', shortlinkController.redirectShortlink);

module.exports = router;
