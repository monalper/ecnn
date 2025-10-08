// backend/src/routes/comment.routes.js
const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controller');
const { verifyToken, optionalVerifyToken, isAdmin } = require('../middlewares/auth.middleware');

// Herkese açık rotalar
// GET /api/comments/article/:articleSlug -> Makaleye ait yorumları getir
router.get('/article/:articleSlug', optionalVerifyToken, commentController.getCommentsByArticle);

// POST /api/comments -> Yeni yorum oluştur (authentication required)
router.post('/', verifyToken, commentController.createComment);

// POST /api/comments/:commentId/like -> Yorum beğeni sayısını güncelle
router.post('/:commentId/like', verifyToken, commentController.toggleLike);

// Admin rotaları
// GET /api/comments -> Tüm yorumları getir (admin)
router.get('/', verifyToken, isAdmin, commentController.getAllComments);

// GET /api/comments/pending -> Onay bekleyen yorumları getir (admin)
router.get('/pending', verifyToken, isAdmin, commentController.getPendingComments);

// GET /api/comments/:commentId -> Yorumu ID ile getir (admin)
router.get('/:commentId', verifyToken, isAdmin, commentController.getCommentById);

// PUT /api/comments/:commentId -> Yorumu güncelle (admin)
router.put('/:commentId', verifyToken, isAdmin, commentController.updateComment);

// DELETE /api/comments/:commentId -> Yorumu sil (admin veya kendi yorumu)
router.delete('/:commentId', verifyToken, commentController.deleteComment);

// PUT /api/comments/:commentId/approval -> Yorum onay durumunu değiştir (admin)
router.put('/:commentId/approval', verifyToken, isAdmin, commentController.toggleApproval);

module.exports = router;
