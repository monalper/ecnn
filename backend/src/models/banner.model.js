// backend/src/models/banner.model.js
const { docClient, BANNERS_TABLE } = require('../config/aws.config');
const { PutCommand, GetCommand, UpdateCommand, ScanCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');

// Banner modeli ve işlemleri
class BannerModel {
  constructor() {
    this.tableName = BANNERS_TABLE;
  }

  // Banner oluştur
  async createBanner(bannerData) {
    const {
      bannerId,
      text,
      isActive = true,
      backgroundColor = '#3B82F6',
      textColor = '#FFFFFF',
      link = null,
      linkText = null,
      createdBy
    } = bannerData;

    const now = new Date().toISOString();

    const banner = {
      bannerId, // Primary Key
      text,
      isActive,
      backgroundColor,
      textColor,
      link,
      linkText,
      createdBy,
      createdAt: now,
      updatedAt: now
    };

    const params = {
      TableName: this.tableName,
      Item: banner,
      ConditionExpression: "attribute_not_exists(bannerId)"
    };

    await docClient.send(new PutCommand(params));
    return banner;
  }

  // Banner getir
  async getBannerById(bannerId) {
    const params = {
      TableName: this.tableName,
      Key: { bannerId }
    };

    const { Item } = await docClient.send(new GetCommand(params));
    return Item;
  }

  // Aktif banner'ları getir
  async getActiveBanners() {
    const params = {
      TableName: this.tableName,
      FilterExpression: "isActive = :isActive",
      ExpressionAttributeValues: {
        ':isActive': true
      }
    };

    const { Items } = await docClient.send(new ScanCommand(params));
    return Items || [];
  }

  // Tüm banner'ları getir (admin için)
  async getAllBanners() {
    const params = {
      TableName: this.tableName
    };

    const { Items } = await docClient.send(new ScanCommand(params));
    return Items || [];
  }

  // Banner güncelle
  async updateBanner(bannerId, updateData) {
    const updateExpressions = [];
    const expressionAttributeValues = {};
    const expressionAttributeNames = {};

    // Dinamik olarak güncellenecek alanları hazırla
    Object.keys(updateData).forEach((key, index) => {
      if (updateData[key] !== undefined) {
        const valueKey = `:val${index}`;
        const nameKey = `#${key}`;
        
        updateExpressions.push(`${nameKey} = ${valueKey}`);
        expressionAttributeValues[valueKey] = updateData[key];
        expressionAttributeNames[nameKey] = key;
      }
    });

    if (updateExpressions.length === 0) {
      throw new Error('No fields to update');
    }

    // updatedAt'i her zaman ekle
    updateExpressions.push('#updatedAt = :updatedAt');
    expressionAttributeValues[':updatedAt'] = new Date().toISOString();
    expressionAttributeNames['#updatedAt'] = 'updatedAt';

    const params = {
      TableName: this.tableName,
      Key: { bannerId },
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW'
    };

    const { Attributes } = await docClient.send(new UpdateCommand(params));
    return Attributes;
  }

  // Banner sil
  async deleteBanner(bannerId) {
    const params = {
      TableName: this.tableName,
      Key: { bannerId }
    };

    await docClient.send(new DeleteCommand(params));
    return { message: 'Banner deleted successfully' };
  }

  // Banner'ı aktif/pasif yap
  async toggleBannerStatus(bannerId) {
    const banner = await this.getBannerById(bannerId);
    if (!banner) {
      throw new Error('Banner not found');
    }

    const newStatus = !banner.isActive;
    return await this.updateBanner(bannerId, { isActive: newStatus });
  }
}

module.exports = new BannerModel();
