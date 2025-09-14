// backend/src/models/commentLikes.model.js
const { docClient, COMMENT_LIKES_TABLE } = require('../config/aws.config');
const { PutCommand, GetCommand, DeleteCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb');

// Comment likes model and operations
class CommentLikesModel {
  constructor() {
    this.tableName = COMMENT_LIKES_TABLE;
  }

  // Add a like to a comment
  async addLike(commentId, userId) {
    const likeId = `${commentId}#${userId}`;
    const now = new Date().toISOString();

    const like = {
      likeId, // Primary Key: commentId#userId
      commentId,
      userId,
      createdAt: now
    };

    const params = {
      TableName: this.tableName,
      Item: like,
      ConditionExpression: "attribute_not_exists(likeId)" // Prevent duplicate likes
    };

    await docClient.send(new PutCommand(params));
    return like;
  }

  // Remove a like from a comment
  async removeLike(commentId, userId) {
    const likeId = `${commentId}#${userId}`;

    const params = {
      TableName: this.tableName,
      Key: { likeId }
    };

    await docClient.send(new DeleteCommand(params));
    return { message: 'Like removed' };
  }

  // Check if user has liked a comment
  async hasUserLiked(commentId, userId) {
    const likeId = `${commentId}#${userId}`;

    const params = {
      TableName: this.tableName,
      Key: { likeId }
    };

    const { Item } = await docClient.send(new GetCommand(params));
    return !!Item;
  }

  // Get all likes for a comment
  async getCommentLikes(commentId) {
    const params = {
      TableName: this.tableName,
      IndexName: 'CommentIdIndex', // GSI
      KeyConditionExpression: 'commentId = :commentId',
      ExpressionAttributeValues: {
        ':commentId': commentId
      }
    };

    const { Items } = await docClient.send(new QueryCommand(params));
    return Items || [];
  }

  // Get user's likes for multiple comments
  async getUserLikesForComments(commentIds, userId) {
    const likes = [];
    
    // Check each comment to see if user has liked it
    for (const commentId of commentIds) {
      const hasLiked = await this.hasUserLiked(commentId, userId);
      if (hasLiked) {
        likes.push(commentId);
      }
    }
    
    return likes;
  }
}

module.exports = new CommentLikesModel();
