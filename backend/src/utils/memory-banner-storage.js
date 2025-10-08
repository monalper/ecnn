// backend/src/utils/memory-banner-storage.js
// Geçici in-memory banner storage (DynamoDB tablosu yokken kullanılır)

let banners = [];
let nextId = 1;

const memoryBannerStorage = {
  // Tüm banner'ları getir
  getAllBanners: () => {
    return [...banners];
  },

  // Aktif banner'ları getir
  getActiveBanners: () => {
    return banners.filter(banner => banner.isActive);
  },

  // Banner oluştur
  createBanner: (bannerData) => {
    const banner = {
      ...bannerData,
      bannerId: `mem-${nextId++}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    banners.push(banner);
    return banner;
  },

  // Banner güncelle
  updateBanner: (bannerId, updateData) => {
    const index = banners.findIndex(banner => banner.bannerId === bannerId);
    if (index === -1) {
      throw new Error('Banner not found');
    }
    
    banners[index] = {
      ...banners[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    return banners[index];
  },

  // Banner sil
  deleteBanner: (bannerId) => {
    const index = banners.findIndex(banner => banner.bannerId === bannerId);
    if (index === -1) {
      throw new Error('Banner not found');
    }
    
    banners.splice(index, 1);
    return { message: 'Banner deleted successfully' };
  },

  // Banner durumunu değiştir
  toggleBannerStatus: (bannerId) => {
    const index = banners.findIndex(banner => banner.bannerId === bannerId);
    if (index === -1) {
      throw new Error('Banner not found');
    }
    
    banners[index].isActive = !banners[index].isActive;
    banners[index].updatedAt = new Date().toISOString();
    
    return banners[index];
  }
};

module.exports = memoryBannerStorage;
