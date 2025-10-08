const { docClient, S3_BUCKET_NAME } = require('../config/aws.config');
const { PutCommand, GetCommand, QueryCommand, DeleteCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');

const VIDEO_TABLE = process.env.DYNAMODB_VIDEO_TABLE || 'OpenWallVideos';

class VideoModel {
  static async create(videoItem) {
    const params = {
      TableName: VIDEO_TABLE,
      Item: {
        id: videoItem.id,
        title: videoItem.title,
        description: videoItem.description,
        videoKey: videoItem.videoKey,
        videoUrl: videoItem.videoUrl,
        thumbnailKey: videoItem.thumbnailKey,
        thumbnailUrl: videoItem.thumbnailUrl,
        duration: videoItem.duration,
        subtitles: videoItem.subtitles || [],
        likeCount: videoItem.likeCount || 0,
        createdAt: videoItem.createdAt,
        updatedAt: videoItem.updatedAt,
        createdBy: videoItem.createdBy
      }
    };

    await docClient.send(new PutCommand(params));
    return videoItem;
  }

  static async getById(id) {
    const params = {
      TableName: VIDEO_TABLE,
      Key: { id }
    };

    const result = await docClient.send(new GetCommand(params));
    return result.Item;
  }

  static async getAll() {
    const params = {
      TableName: VIDEO_TABLE
    };

    const result = await docClient.send(new ScanCommand(params));
    return result.Items || [];
  }

  static async update(id, updates) {
    const existingItem = await this.getById(id);
    if (!existingItem) {
      throw new Error('Video item not found');
    }

    const updatedItem = {
      ...existingItem,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    const params = {
      TableName: VIDEO_TABLE,
      Item: updatedItem
    };

    await docClient.send(new PutCommand(params));
    return updatedItem;
  }

  static async delete(id) {
    const params = {
      TableName: VIDEO_TABLE,
      Key: { id }
    };

    await docClient.send(new DeleteCommand(params));
    return { id };
  }
}

module.exports = VideoModel; 