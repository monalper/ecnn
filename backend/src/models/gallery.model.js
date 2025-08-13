const { docClient, S3_BUCKET_NAME } = require('../config/aws.config');
const { PutCommand, GetCommand, QueryCommand, DeleteCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');

const GALLERY_TABLE = process.env.DYNAMODB_GALLERY_TABLE || 'OpenWallGallery';

class GalleryModel {
  static async create(galleryItem) {
    const params = {
      TableName: GALLERY_TABLE,
      Item: {
        id: galleryItem.id,
        title: galleryItem.title,
        description: galleryItem.description,
        imageKey: galleryItem.imageKey,
        imageUrl: galleryItem.imageUrl,
        createdAt: galleryItem.createdAt,
        updatedAt: galleryItem.updatedAt,
        createdBy: galleryItem.createdBy
      }
    };

    await docClient.send(new PutCommand(params));
    return galleryItem;
  }

  static async getById(id) {
    const params = {
      TableName: GALLERY_TABLE,
      Key: { id }
    };

    const result = await docClient.send(new GetCommand(params));
    return result.Item;
  }

  static async getAll() {
    const params = {
      TableName: GALLERY_TABLE
    };

    const result = await docClient.send(new ScanCommand(params));
    return result.Items || [];
  }

  static async update(id, updates) {
    const existingItem = await this.getById(id);
    if (!existingItem) {
      throw new Error('Gallery item not found');
    }

    const updatedItem = {
      ...existingItem,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    const params = {
      TableName: GALLERY_TABLE,
      Item: updatedItem
    };

    await docClient.send(new PutCommand(params));
    return updatedItem;
  }

  static async delete(id) {
    const params = {
      TableName: GALLERY_TABLE,
      Key: { id }
    };

    await docClient.send(new DeleteCommand(params));
    return { id };
  }
}

module.exports = GalleryModel; 