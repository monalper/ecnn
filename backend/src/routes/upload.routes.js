const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');
const uploadController = require('../controllers/upload.controller');
const { setupCORS } = require('../config/s3-cors-setup');
const { checkBucketConfiguration } = require('../config/s3-bucket-check');
const { setupBucketPolicy } = require('../config/s3-bucket-policy');

// POST /api/upload/cover -> Makale kapağı için presigned URL al
// Sadece adminler makale kapağı yükleyebilmeli
router.post('/cover', verifyToken, isAdmin, uploadController.getPresignedUrlForCover);

// POST /api/upload/cover-direct -> Doğrudan kapak resmi yükle (CORS sorunu çözümü)
// Sadece adminler makale kapağı yükleyebilmeli
router.post('/cover-direct', verifyToken, isAdmin, uploadController.upload.single('coverImage'), uploadController.uploadCoverImage);

// POST /api/upload/setup-cors -> S3 CORS ayarlarını yapılandır (sadece admin)
router.post('/setup-cors', verifyToken, isAdmin, async (req, res) => {
  try {
    await setupCORS();
    res.json({ message: 'S3 CORS ayarları başarıyla güncellendi!' });
  } catch (error) {
    res.status(500).json({ message: 'CORS ayarları güncellenirken hata oluştu.' });
  }
});

// GET /api/upload/check-bucket -> S3 bucket yapılandırmasını kontrol et (sadece admin)
router.get('/check-bucket', verifyToken, isAdmin, async (req, res) => {
  try {
    await checkBucketConfiguration();
    res.json({ message: 'Bucket yapılandırması kontrol edildi. Console\'a bakın.' });
  } catch (error) {
    res.status(500).json({ message: 'Bucket kontrolü sırasında hata oluştu.' });
  }
});

// POST /api/upload/setup-policy -> S3 bucket policy ayarlarını yapılandır (sadece admin)
router.post('/setup-policy', verifyToken, isAdmin, async (req, res) => {
  try {
    await setupBucketPolicy();
    res.json({ message: 'S3 bucket policy başarıyla güncellendi!' });
  } catch (error) {
    res.status(500).json({ message: 'Bucket policy güncellenirken hata oluştu.' });
  }
});

// POST /api/upload/avatar -> Profil fotoğrafı için presigned URL al
// Tüm giriş yapmış kullanıcılar avatar yükleyebilmeli (kendileri için)
router.post('/avatar', verifyToken, uploadController.getPresignedUrlForAvatar);

// POST /api/upload/content-image -> Makale içeriği için presigned URL al
// Sadece adminler makale içeriği görseli yükleyebilmeli
router.post('/content-image', verifyToken, isAdmin, uploadController.getPresignedUrlForContentImage);

module.exports = router;