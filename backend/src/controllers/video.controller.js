const VideoModel = require('../models/video.model');
const { v4: uuidv4 } = require('uuid');
const { s3Client, S3_BUCKET_NAME } = require('../config/aws.config');
const { PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const path = require('path');
const { docClient, USERS_TABLE } = require('../config/aws.config');
const { GetCommand } = require('@aws-sdk/lib-dynamodb');

// Helper function to get username by userId
const getUsernameById = async (userId) => {
  try {
    const params = {
      TableName: USERS_TABLE,
      Key: { userId }
    };
    const { Item: user } = await docClient.send(new GetCommand(params));
    return user ? user.username : 'Bilinmeyen';
  } catch (error) {
    console.error('Username fetch error:', error);
    return 'Bilinmeyen';
  }
};

// Get all video items
const getAllVideoItems = async (req, res) => {
  try {
    const items = await VideoModel.getAll();
    
    // Add username for each video
    const itemsWithUsername = await Promise.all(
      items.map(async (item) => {
        if (item.createdBy) {
          const username = await getUsernameById(item.createdBy);
          return { ...item, createdByUsername: username };
        }
        return item;
      })
    );
    
    res.json(itemsWithUsername);
  } catch (error) {
    console.error('Video items fetch error:', error);
    
    // If table doesn't exist, return empty array instead of error
    if (error.name === 'ResourceNotFoundException') {
      console.log('Video table does not exist, returning empty array');
      return res.json([]);
    }
    
    res.status(500).json({ message: 'Video öğeleri alınırken hata oluştu.' });
  }
};

// Get video item by ID
const getVideoItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await VideoModel.getById(id);
    
    if (!item) {
      return res.status(404).json({ message: 'Video öğesi bulunamadı.' });
    }
    
    // Add username if createdBy exists
    if (item.createdBy) {
      const username = await getUsernameById(item.createdBy);
      item.createdByUsername = username;
    }
    
    res.json(item);
  } catch (error) {
    console.error('Video item fetch error:', error);
    
    if (error.name === 'ResourceNotFoundException') {
      return res.status(404).json({ message: 'Video öğesi bulunamadı.' });
    }
    
    res.status(500).json({ message: 'Video öğesi alınırken hata oluştu.' });
  }
};

// Create new video item
const createVideoItem = async (req, res) => {
  try {
    const { title, description, videoKey, videoUrl, thumbnailKey, thumbnailUrl, duration, subtitles } = req.body;
    const userId = req.user.userId;

    if (!title || !videoKey || !videoUrl) {
      return res.status(400).json({ 
        message: 'Başlık, video anahtarı ve video URL\'i gereklidir.' 
      });
    }

    // Başlık uzunluğu kontrolü
    if (title.length > 100) {
      return res.status(400).json({ 
        message: 'Başlık 100 karakterden uzun olamaz.' 
      });
    }

    const videoItem = {
      id: uuidv4(),
      title,
      description: description || '',
      videoKey,
      videoUrl,
      thumbnailKey: thumbnailKey || '',
      thumbnailUrl: thumbnailUrl || '',
      duration: duration || 0,
      subtitles: subtitles || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: userId
    };

    const createdItem = await VideoModel.create(videoItem);
    res.status(201).json(createdItem);
  } catch (error) {
    console.error('Video item creation error:', error);
    
    if (error.name === 'ResourceNotFoundException') {
      return res.status(500).json({ 
        message: 'Video tablosu bulunamadı. Lütfen DynamoDB tablosunu oluşturun.' 
      });
    }
    
    res.status(500).json({ message: 'Video öğesi oluşturulurken hata oluştu.' });
  }
};

// Update video item
const updateVideoItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, videoKey, videoUrl, thumbnailKey, thumbnailUrl, duration, subtitles } = req.body;

    // Başlık uzunluğu kontrolü
    if (title !== undefined && title.length > 100) {
      return res.status(400).json({ 
        message: 'Başlık 100 karakterden uzun olamaz.' 
      });
    }

    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (videoKey !== undefined) updates.videoKey = videoKey;
    if (videoUrl !== undefined) updates.videoUrl = videoUrl;
    if (thumbnailKey !== undefined) updates.thumbnailKey = thumbnailKey;
    if (thumbnailUrl !== undefined) updates.thumbnailUrl = thumbnailUrl;
    if (duration !== undefined) updates.duration = duration;
    if (subtitles !== undefined) updates.subtitles = subtitles;

    const updatedItem = await VideoModel.update(id, updates);
    res.json(updatedItem);
  } catch (error) {
    console.error('Video item update error:', error);
    
    if (error.name === 'ResourceNotFoundException') {
      return res.status(500).json({ 
        message: 'Video tablosu bulunamadı. Lütfen DynamoDB tablosunu oluşturun.' 
      });
    }
    
    if (error.message === 'Video item not found') {
      return res.status(404).json({ message: 'Video öğesi bulunamadı.' });
    }
    res.status(500).json({ message: 'Video öğesi güncellenirken hata oluştu.' });
  }
};

// Delete video item
const deleteVideoItem = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get the item first to get the video and thumbnail keys
    const item = await VideoModel.getById(id);
    if (!item) {
      return res.status(404).json({ message: 'Video öğesi bulunamadı.' });
    }

    // Delete from S3 if videoKey exists
    if (item.videoKey) {
      try {
        const deleteVideoParams = {
          Bucket: S3_BUCKET_NAME,
          Key: item.videoKey
        };
        await s3Client.send(new DeleteObjectCommand(deleteVideoParams));
      } catch (s3Error) {
        console.error('S3 video delete error:', s3Error);
        // Continue with deletion even if S3 delete fails
      }
    }

    // Delete from S3 if thumbnailKey exists
    if (item.thumbnailKey) {
      try {
        const deleteThumbnailParams = {
          Bucket: S3_BUCKET_NAME,
          Key: item.thumbnailKey
        };
        await s3Client.send(new DeleteObjectCommand(deleteThumbnailParams));
      } catch (s3Error) {
        console.error('S3 thumbnail delete error:', s3Error);
        // Continue with deletion even if S3 delete fails
      }
    }

    // Delete subtitle files from S3 if they exist
    if (item.subtitles && Array.isArray(item.subtitles)) {
      for (const subtitle of item.subtitles) {
        if (subtitle.key) {
          try {
            const deleteSubtitleParams = {
              Bucket: S3_BUCKET_NAME,
              Key: subtitle.key
            };
            await s3Client.send(new DeleteObjectCommand(deleteSubtitleParams));
          } catch (s3Error) {
            console.error('S3 subtitle delete error:', s3Error);
            // Continue with deletion even if S3 delete fails
          }
        }
      }
    }

    await VideoModel.delete(id);
    res.json({ message: 'Video öğesi başarıyla silindi.' });
  } catch (error) {
    console.error('Video item deletion error:', error);
    
    if (error.name === 'ResourceNotFoundException') {
      return res.status(500).json({ 
        message: 'Video tablosu bulunamadı. Lütfen DynamoDB tablosunu oluşturun.' 
      });
    }
    
    res.status(500).json({ message: 'Video öğesi silinirken hata oluştu.' });
  }
};

// Get presigned URL for video upload
const getPresignedUrlForVideoUpload = async (req, res) => {
  try {
    const { fileName, contentType } = req.body;
    const userId = req.user.userId;

    if (!fileName || !contentType) {
      return res.status(400).json({ 
        message: 'Dosya adı (fileName) ve içerik tipi (contentType) gereklidir.' 
      });
    }
    
    if (!contentType.startsWith('video/')) {
      return res.status(400).json({ 
        message: 'Sadece video dosyaları yüklenebilir (video/*).' 
      });
    }

    const fileExtension = path.extname(fileName);
    if (!fileExtension) {
      return res.status(400).json({ 
        message: 'Dosya adı geçerli bir uzantıya sahip olmalıdır.' 
      });
    }
    
    const s3Key = `videos/${userId}/${uuidv4()}${fileExtension}`;

    const params = {
      Bucket: S3_BUCKET_NAME,
      Key: s3Key,
      ContentType: contentType,
    };

    const command = new PutObjectCommand(params);
    const uploadUrl = await getSignedUrl(s3Client, command, { 
      expiresIn: 3600, // 1 saat süre (büyük dosyalar için)
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

// Get presigned URL for thumbnail upload
const getPresignedUrlForThumbnailUpload = async (req, res) => {
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
    
    const s3Key = `videos/thumbnails/${userId}/${uuidv4()}${fileExtension}`;

    const params = {
      Bucket: S3_BUCKET_NAME,
      Key: s3Key,
      ContentType: contentType,
    };

    const command = new PutObjectCommand(params);
    const uploadUrl = await getSignedUrl(s3Client, command, { 
      expiresIn: 1800, // 30 dakika süre
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

// Get presigned URL for subtitle upload
const getPresignedUrlForSubtitleUpload = async (req, res) => {
  try {
    const { fileName, contentType } = req.body;
    const userId = req.user.userId;

    if (!fileName || !contentType) {
      return res.status(400).json({ 
        message: 'Dosya adı (fileName) ve içerik tipi (contentType) gereklidir.' 
      });
    }
    
    // Accept common subtitle file types
    const allowedContentTypes = [
      'text/plain',
      'application/x-subrip',
      'text/vtt',
      'application/vtt',
      'text/srt',
      'application/srt'
    ];
    
    const fileExtension = path.extname(fileName).toLowerCase();
    const allowedExtensions = ['.srt', '.vtt', '.txt'];
    
    if (!allowedContentTypes.includes(contentType) && !allowedExtensions.includes(fileExtension)) {
      return res.status(400).json({ 
        message: 'Sadece SRT, VTT veya TXT dosyaları yüklenebilir.' 
      });
    }

    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
      return res.status(400).json({ 
        message: 'Dosya adı geçerli bir uzantıya sahip olmalıdır (.srt, .vtt, .txt).' 
      });
    }
    
    const s3Key = `videos/subtitles/${userId}/${uuidv4()}${fileExtension}`;

    const params = {
      Bucket: S3_BUCKET_NAME,
      Key: s3Key,
      ContentType: contentType,
    };

    const command = new PutObjectCommand(params);
    const uploadUrl = await getSignedUrl(s3Client, command, { 
      expiresIn: 1800, // 30 dakika süre
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
  getAllVideoItems,
  getVideoItemById,
  createVideoItem,
  updateVideoItem,
  deleteVideoItem,
  getPresignedUrlForVideoUpload,
  getPresignedUrlForThumbnailUpload,
  getPresignedUrlForSubtitleUpload
}; 