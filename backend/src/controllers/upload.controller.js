// backend/src/controllers/upload.controller.js
const { s3Client, S3_BUCKET_NAME } = require('../config/aws.config');
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const multer = require('multer');

// Multer configuration for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Sadece resim dosyaları yüklenebilir.'), false);
    }
  }
});

// Direct upload function to handle CORS issues
const uploadCoverImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Dosya yüklenmedi.' });
    }

    const userId = req.user.userId;
    const fileExtension = path.extname(req.file.originalname);
    const s3Key = `covers/${userId}/${uuidv4()}${fileExtension}`;

    const params = {
      Bucket: S3_BUCKET_NAME,
      Key: s3Key,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
      // ACL: 'public-read' kaldırıldı - bucket ACL'leri desteklemiyor
    };

    await s3Client.send(new PutObjectCommand(params));

    const region = process.env.AWS_REGION || "eu-north-1";
    const accessUrl = `https://${S3_BUCKET_NAME}.s3.${region}.amazonaws.com/${s3Key}`;

    res.status(200).json({
      message: 'Kapak resmi başarıyla yüklendi.',
      accessUrl,
      key: s3Key
    });
  } catch (error) {
    console.error('Kapak resmi yüklenirken hata:', error);
    
    // Daha detaylı hata mesajları
    if (error.name === 'AccessDenied') {
      return res.status(403).json({ 
        message: 'AWS erişim hatası. Lütfen AWS credentials\'ları kontrol edin.' 
      });
    } else if (error.name === 'NoSuchBucket') {
      return res.status(404).json({ 
        message: 'S3 bucket bulunamadı. Lütfen bucket adını kontrol edin.' 
      });
    } else if (error.message && error.message.includes('ACL')) {
      return res.status(400).json({ 
        message: 'Bucket ACL\'leri desteklemiyor. Dosya yükleme başarısız.' 
      });
    }
    
    res.status(500).json({ 
      message: 'Dosya yükleme sırasında bir hata oluştu: ' + error.message 
    });
  }
};

const generatePresignedUrl = async (req, res, next, folderPrefix) => {
  const { fileName, contentType } = req.body;
  const userId = req.user.userId;

  if (!fileName || !contentType) {
    return res.status(400).json({ message: 'Dosya adı (fileName) ve içerik tipi (contentType) gereklidir.' });
  }
  if (!contentType.startsWith('image/')) {
    return res.status(400).json({ message: 'Sadece resim dosyaları yüklenebilir (image/*).' });
  }

  const fileExtension = path.extname(fileName);
  if (!fileExtension) {
    return res.status(400).json({ message: 'Dosya adı geçerli bir uzantıya sahip olmalıdır.' });
  }
  const s3Key = `${folderPrefix}/${userId}/${uuidv4()}${fileExtension}`;

  const params = {
    Bucket: S3_BUCKET_NAME,
    Key: s3Key,
    ContentType: contentType,
  };

  try {
    const command = new PutObjectCommand(params);
    const uploadUrl = await getSignedUrl(s3Client, command, { 
      expiresIn: 300,
      signableHeaders: new Set(['host']),
      unsignableHeaders: new Set(['x-amz-acl', 'x-amz-checksum-crc32', 'x-amz-sdk-checksum-algorithm'])
    });

    // S3 URL'ini oluştur
    const region = process.env.AWS_REGION || "eu-north-1";
    const accessUrl = `https://${S3_BUCKET_NAME}.s3.${region}.amazonaws.com/${s3Key}`;

    res.status(200).json({
      uploadUrl,
      key: s3Key,
      accessUrl
    });
  } catch (error) {
    console.error('Presigned URL oluşturulurken hata:', error);
    next(error);
  }
};

const getPresignedUrlForCover = (req, res, next) => {
  generatePresignedUrl(req, res, next, 'covers');
};

const getPresignedUrlForAvatar = (req, res, next) => {
  generatePresignedUrl(req, res, next, 'avatars');
};

const getPresignedUrlForContentImage = (req, res, next) => {
  generatePresignedUrl(req, res, next, 'content-images');
};

module.exports = {
  getPresignedUrlForCover,
  getPresignedUrlForAvatar,
  getPresignedUrlForContentImage,
  uploadCoverImage,
  upload
};
