const GalleryModel = require('../models/gallery.model');
const { v4: uuidv4 } = require('uuid');
const { s3Client, S3_BUCKET_NAME } = require('../config/aws.config');
const { PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const path = require('path');

// Get all gallery items
const getAllGalleryItems = async (req, res) => {
  try {
    const items = await GalleryModel.getAll();
    res.json(items);
  } catch (error) {
    console.error('Gallery items fetch error:', error);
    
    // If table doesn't exist, return empty array instead of error
    if (error.name === 'ResourceNotFoundException') {
      console.log('Gallery table does not exist, returning empty array');
      return res.json([]);
    }
    
    res.status(500).json({ message: 'Galeri öğeleri alınırken hata oluştu.' });
  }
};

// Get gallery item by ID
const getGalleryItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await GalleryModel.getById(id);
    
    if (!item) {
      return res.status(404).json({ message: 'Galeri öğesi bulunamadı.' });
    }
    
    res.json(item);
  } catch (error) {
    console.error('Gallery item fetch error:', error);
    
    if (error.name === 'ResourceNotFoundException') {
      return res.status(404).json({ message: 'Galeri öğesi bulunamadı.' });
    }
    
    res.status(500).json({ message: 'Galeri öğesi alınırken hata oluştu.' });
  }
};

// Create new gallery item
const createGalleryItem = async (req, res) => {
  try {
    const { title, description, imageKey, imageUrl } = req.body;
    const userId = req.user.userId;

    if (!title || !imageKey || !imageUrl) {
      return res.status(400).json({ 
        message: 'Başlık, resim anahtarı ve resim URL\'i gereklidir.' 
      });
    }

    const galleryItem = {
      id: uuidv4(),
      title,
      description: description || '',
      imageKey,
      imageUrl,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: userId
    };

    const createdItem = await GalleryModel.create(galleryItem);
    res.status(201).json(createdItem);
  } catch (error) {
    console.error('Gallery item creation error:', error);
    
    if (error.name === 'ResourceNotFoundException') {
      return res.status(500).json({ 
        message: 'Galeri tablosu bulunamadı. Lütfen DynamoDB tablosunu oluşturun.' 
      });
    }
    
    res.status(500).json({ message: 'Galeri öğesi oluşturulurken hata oluştu.' });
  }
};

// Update gallery item
const updateGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, imageKey, imageUrl } = req.body;

    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (imageKey !== undefined) updates.imageKey = imageKey;
    if (imageUrl !== undefined) updates.imageUrl = imageUrl;

    const updatedItem = await GalleryModel.update(id, updates);
    res.json(updatedItem);
  } catch (error) {
    console.error('Gallery item update error:', error);
    
    if (error.name === 'ResourceNotFoundException') {
      return res.status(500).json({ 
        message: 'Galeri tablosu bulunamadı. Lütfen DynamoDB tablosunu oluşturun.' 
      });
    }
    
    if (error.message === 'Gallery item not found') {
      return res.status(404).json({ message: 'Galeri öğesi bulunamadı.' });
    }
    res.status(500).json({ message: 'Galeri öğesi güncellenirken hata oluştu.' });
  }
};

// Delete gallery item
const deleteGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get the item first to get the image key
    const item = await GalleryModel.getById(id);
    if (!item) {
      return res.status(404).json({ message: 'Galeri öğesi bulunamadı.' });
    }

    // Delete from S3 if imageKey exists
    if (item.imageKey) {
      try {
        const deleteParams = {
          Bucket: S3_BUCKET_NAME,
          Key: item.imageKey
        };
        await s3Client.send(new DeleteObjectCommand(deleteParams));
      } catch (s3Error) {
        console.error('S3 delete error:', s3Error);
        // Continue with deletion even if S3 delete fails
      }
    }

    await GalleryModel.delete(id);
    res.json({ message: 'Galeri öğesi başarıyla silindi.' });
  } catch (error) {
    console.error('Gallery item deletion error:', error);
    
    if (error.name === 'ResourceNotFoundException') {
      return res.status(500).json({ 
        message: 'Galeri tablosu bulunamadı. Lütfen DynamoDB tablosunu oluşturun.' 
      });
    }
    
    res.status(500).json({ message: 'Galeri öğesi silinirken hata oluştu.' });
  }
};

// Get presigned URL for gallery image upload
const getPresignedUrlForGalleryImage = async (req, res) => {
  try {
    const { fileName, contentType } = req.body;
    const userId = req.user.userId;

    if (!fileName || !contentType) {
      return res.status(400).json({ 
        message: 'Dosya adı (fileName) ve içerik tipi (contentType) gereklidir.' 
      });
    }
    
    if (!contentType.startsWith('image/')) {
      return res.status(400).json({ 
        message: 'Sadece resim dosyaları yüklenebilir (image/*).' 
      });
    }

    const fileExtension = path.extname(fileName);
    if (!fileExtension) {
      return res.status(400).json({ 
        message: 'Dosya adı geçerli bir uzantıya sahip olmalıdır.' 
      });
    }
    
    const s3Key = `gallery/${userId}/${uuidv4()}${fileExtension}`;

    const params = {
      Bucket: S3_BUCKET_NAME,
      Key: s3Key,
      ContentType: contentType,
    };

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
    res.status(500).json({ message: 'Presigned URL oluşturulurken hata oluştu.' });
  }
};

module.exports = {
  getAllGalleryItems,
  getGalleryItemById,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  getPresignedUrlForGalleryImage
}; 