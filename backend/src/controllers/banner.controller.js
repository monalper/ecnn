// backend/src/controllers/banner.controller.js
const bannerModel = require('../models/banner.model');
const memoryBannerStorage = require('../utils/memory-banner-storage');
const { v4: uuidv4 } = require('uuid');

// Public: Aktif banner'ları getir
exports.getActiveBanners = async (req, res, next) => {
  try {
    const banners = await bannerModel.getActiveBanners();
    res.status(200).json(banners);
  } catch (error) {
    console.error("Get Active Banners Error:", error);
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      code: error.code
    });
    
    // DynamoDB tablosu yoksa memory storage kullan
    console.log('DynamoDB hatası, memory storage kullanılıyor');
    const banners = memoryBannerStorage.getActiveBanners();
    return res.status(200).json(banners);
  }
};

// Admin: Tüm banner'ları listele
exports.getAllBanners = async (req, res, next) => {
  try {
    const banners = await bannerModel.getAllBanners();
    res.status(200).json(banners);
  } catch (error) {
    console.error("Get All Banners Error:", error);
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      code: error.code
    });
    
    // DynamoDB tablosu yoksa memory storage kullan
    console.log('DynamoDB hatası, memory storage kullanılıyor');
    const banners = memoryBannerStorage.getAllBanners();
    return res.status(200).json(banners);
  }
};

// Admin: Banner oluştur
exports.createBanner = async (req, res, next) => {
  try {
    console.log('Create Banner Request:', {
      body: req.body,
      user: req.user ? { userId: req.user.userId, isAdmin: req.user.isAdmin } : 'No user'
    });

    const { text, isActive, backgroundColor, textColor, link, linkText } = req.body;
    const createdBy = req.user.userId; // Admin kullanıcısı

    if (!text || text.trim() === '') {
      return res.status(400).json({ message: 'Banner metni gereklidir.' });
    }

    const bannerData = {
      bannerId: uuidv4(),
      text: text.trim(),
      isActive: isActive !== undefined ? isActive : true,
      backgroundColor: backgroundColor || '#3B82F6',
      textColor: textColor || '#FFFFFF',
      link: link || null,
      linkText: linkText || null,
      createdBy
    };

    console.log('Creating banner with data:', bannerData);
    const banner = await bannerModel.createBanner(bannerData);
    console.log('Banner created successfully:', banner);
    res.status(201).json(banner);
  } catch (error) {
    console.error("Create Banner Error:", error);
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    
    // DynamoDB tablosu yoksa memory storage kullan
    console.log('DynamoDB hatası, memory storage kullanılıyor');
    try {
      // bannerData'yı yeniden oluştur
      const { text, isActive, backgroundColor, textColor, link, linkText } = req.body;
      const createdBy = req.user.userId;
      
      const memoryBannerData = {
        bannerId: uuidv4(),
        text: text.trim(),
        isActive: isActive !== undefined ? isActive : true,
        backgroundColor: backgroundColor || '#3B82F6',
        textColor: textColor || '#FFFFFF',
        link: link || null,
        linkText: linkText || null,
        createdBy
      };
      
      const banner = memoryBannerStorage.createBanner(memoryBannerData);
      console.log('Banner created in memory storage:', banner);
      res.status(201).json(banner);
    } catch (memoryError) {
      console.error("Memory storage error:", memoryError);
      return res.status(500).json({ 
        message: 'Banner oluşturulurken hata oluştu: ' + memoryError.message 
      });
    }
  }
};

// Admin: Banner güncelle
exports.updateBanner = async (req, res, next) => {
  try {
    const { bannerId } = req.params;
    const updateData = req.body;

    // Güncellenecek alanları filtrele
    const allowedFields = ['text', 'isActive', 'backgroundColor', 'textColor', 'link', 'linkText'];
    const filteredUpdateData = {};
    
    Object.keys(updateData).forEach(key => {
      if (allowedFields.includes(key) && updateData[key] !== undefined) {
        filteredUpdateData[key] = updateData[key];
      }
    });

    if (Object.keys(filteredUpdateData).length === 0) {
      return res.status(400).json({ message: 'Güncellenecek geçerli alan bulunamadı.' });
    }

    const updatedBanner = await bannerModel.updateBanner(bannerId, filteredUpdateData);
    res.status(200).json(updatedBanner);
  } catch (error) {
    console.error("Update Banner Error:", error);
    
    // DynamoDB hatası varsa memory storage kullan
    console.log('DynamoDB hatası, memory storage kullanılıyor');
    try {
      const { bannerId } = req.params;
      const updateData = req.body;
      
      const allowedFields = ['text', 'isActive', 'backgroundColor', 'textColor', 'link', 'linkText'];
      const filteredUpdateData = {};
      
      Object.keys(updateData).forEach(key => {
        if (allowedFields.includes(key) && updateData[key] !== undefined) {
          filteredUpdateData[key] = updateData[key];
        }
      });

      if (Object.keys(filteredUpdateData).length === 0) {
        return res.status(400).json({ message: 'Güncellenecek geçerli alan bulunamadı.' });
      }

      const updatedBanner = memoryBannerStorage.updateBanner(bannerId, filteredUpdateData);
      res.status(200).json(updatedBanner);
    } catch (memoryError) {
      if (memoryError.message === 'Banner not found') {
        return res.status(404).json({ message: 'Banner bulunamadı.' });
      }
      return res.status(500).json({ message: 'Banner güncellenirken hata oluştu: ' + memoryError.message });
    }
  }
};

// Admin: Banner sil
exports.deleteBanner = async (req, res, next) => {
  try {
    const { bannerId } = req.params;
    
    const result = await bannerModel.deleteBanner(bannerId);
    res.status(200).json(result);
  } catch (error) {
    console.error("Delete Banner Error:", error);
    
    // DynamoDB hatası varsa memory storage kullan
    console.log('DynamoDB hatası, memory storage kullanılıyor');
    try {
      const { bannerId } = req.params;
      const result = memoryBannerStorage.deleteBanner(bannerId);
      res.status(200).json(result);
    } catch (memoryError) {
      if (memoryError.message === 'Banner not found') {
        return res.status(404).json({ message: 'Banner bulunamadı.' });
      }
      return res.status(500).json({ message: 'Banner silinirken hata oluştu: ' + memoryError.message });
    }
  }
};

// Admin: Banner durumunu değiştir (aktif/pasif)
exports.toggleBannerStatus = async (req, res, next) => {
  try {
    const { bannerId } = req.params;
    
    const updatedBanner = await bannerModel.toggleBannerStatus(bannerId);
    res.status(200).json(updatedBanner);
  } catch (error) {
    console.error("Toggle Banner Status Error:", error);
    
    // DynamoDB hatası varsa memory storage kullan
    console.log('DynamoDB hatası, memory storage kullanılıyor');
    try {
      const { bannerId } = req.params;
      const updatedBanner = memoryBannerStorage.toggleBannerStatus(bannerId);
      res.status(200).json(updatedBanner);
    } catch (memoryError) {
      if (memoryError.message === 'Banner not found') {
        return res.status(404).json({ message: 'Banner bulunamadı.' });
      }
      return res.status(500).json({ message: 'Banner durumu değiştirilirken hata oluştu: ' + memoryError.message });
    }
  }
};
