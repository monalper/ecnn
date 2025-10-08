// backend/src/routes/user.routes.js
const express = require('express'); // Sadece bir kere, genellikle en üstte
const router = express.Router();
const userController = require('../controllers/user.controller'); // Bu dosyanın da var olması ve doğru exportları yapması gerekir
const { verifyToken } = require('../middlewares/auth.middleware');

// GET /api/users/test -> Test endpoint to check all users
router.get('/test', userController.testGetAllUsers);

// Kaydedilen makaleler - Auth gerekli
router.get('/saved-articles', verifyToken, userController.getSavedArticles);
router.post('/saved-articles/:slug', verifyToken, userController.toggleSavedArticle);
router.get('/saved-articles/:slug/check', verifyToken, userController.checkArticleSaved);

// GET /api/users/:username -> Kullanıcı profili (username ile)
router.get('/:username', userController.getUserProfileByUsername);

module.exports = router;