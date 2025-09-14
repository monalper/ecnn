// backend/src/models/comment.model.js
const { docClient, COMMENTS_TABLE } = require('../config/aws.config');
const { PutCommand, GetCommand, ScanCommand, DeleteCommand, UpdateCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb');

// Yorum modeli ve işlemleri
class CommentModel {
  constructor() {
    this.tableName = COMMENTS_TABLE;
  }

  // Yeni yorum oluştur
  async createComment(commentData) {
    const {
      commentId,
      articleSlug,
      authorName,
      authorUsername,
      authorEmail,
      content,
      parentCommentId = null, // Yanıt için üst yorum ID'si
      isApproved = false, // Yorum onay durumu
      isAdmin = false, // Admin yorumu mu
      ipAddress = null,
      userAgent = null
    } = commentData;

    const now = new Date().toISOString();

    const comment = {
      commentId, // Primary Key
      articleSlug, // GSI için
      authorName,
      authorUsername,
      authorEmail,
      content,
      parentCommentId,
      isApproved,
      isAdmin,
      ipAddress,
      userAgent,
      createdAt: now,
      updatedAt: now,
      likeCount: 0,
      replyCount: 0
    };

    const params = {
      TableName: this.tableName,
      Item: comment,
      ConditionExpression: "attribute_not_exists(commentId)"
    };

    await docClient.send(new PutCommand(params));
    return comment;
  }

  // Makaleye ait yorumları getir (onaylanmış olanlar ve onay bekleyenler)
  async getCommentsByArticle(articleSlug, includeReplies = true) {
    const params = {
      TableName: this.tableName,
      IndexName: 'ArticleSlugIndex', // GSI
      KeyConditionExpression: 'articleSlug = :articleSlug',
      ExpressionAttributeValues: {
        ':articleSlug': articleSlug
      }
    };

    const { Items } = await docClient.send(new QueryCommand(params));
    
    if (!includeReplies) {
      // Sadece ana yorumları döndür (parentCommentId null olanlar) - yeniden eskiye sırala
      return Items.filter(comment => !comment.parentCommentId)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // Yorumları hiyerarşik yapıda organize et
    const comments = Items.filter(comment => !comment.parentCommentId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Ana yorumları yeniden eskiye sırala
    const replies = Items.filter(comment => comment.parentCommentId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Yanıtları da yeniden eskiye sırala

    // Her ana yoruma yanıtlarını ekle
    comments.forEach(comment => {
      comment.replies = replies.filter(reply => reply.parentCommentId === comment.commentId);
    });

    return comments;
  }

  // Tüm yorumları getir (admin için)
  async getAllComments() {
    const params = {
      TableName: this.tableName
    };

    const { Items } = await docClient.send(new ScanCommand(params));
    return Items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  // Yorumu ID ile getir
  async getCommentById(commentId) {
    const params = {
      TableName: this.tableName,
      Key: { commentId }
    };

    const { Item } = await docClient.send(new GetCommand(params));
    return Item;
  }

  // Yorumu güncelle
  async updateComment(commentId, updateData) {
    const now = new Date().toISOString();
    
    let updateExpressionParts = [];
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};

    if (updateData.content !== undefined) {
      updateExpressionParts.push('#content = :content');
      expressionAttributeNames['#content'] = 'content';
      expressionAttributeValues[':content'] = updateData.content;
    }
    if (updateData.isApproved !== undefined) {
      updateExpressionParts.push('#approved = :approved');
      expressionAttributeNames['#approved'] = 'isApproved';
      expressionAttributeValues[':approved'] = updateData.isApproved;
    }
    if (updateData.authorName !== undefined) {
      updateExpressionParts.push('#authorName = :authorName');
      expressionAttributeNames['#authorName'] = 'authorName';
      expressionAttributeValues[':authorName'] = updateData.authorName;
    }
    if (updateData.authorEmail !== undefined) {
      updateExpressionParts.push('#authorEmail = :authorEmail');
      expressionAttributeNames['#authorEmail'] = 'authorEmail';
      expressionAttributeValues[':authorEmail'] = updateData.authorEmail;
    }

    updateExpressionParts.push('#updatedAt = :updatedAt');
    expressionAttributeNames['#updatedAt'] = 'updatedAt';
    expressionAttributeValues[':updatedAt'] = now;

    const params = {
      TableName: this.tableName,
      Key: { commentId },
      UpdateExpression: `SET ${updateExpressionParts.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW'
    };

    const { Attributes } = await docClient.send(new UpdateCommand(params));
    return Attributes;
  }

  // Yorumu sil
  async deleteComment(commentId) {
    const params = {
      TableName: this.tableName,
      Key: { commentId }
    };

    await docClient.send(new DeleteCommand(params));
    return { message: 'Yorum silindi' };
  }

  // Yorum beğeni sayısını artır/azalt
  async updateLikeCount(commentId, increment = true) {
    const params = {
      TableName: this.tableName,
      Key: { commentId },
      UpdateExpression: 'SET likeCount = if_not_exists(likeCount, :zero) + :inc, updatedAt = :now',
      ExpressionAttributeValues: {
        ':inc': increment ? 1 : -1,
        ':zero': 0,
        ':now': new Date().toISOString()
      },
      ReturnValues: 'ALL_NEW'
    };

    const { Attributes } = await docClient.send(new UpdateCommand(params));
    return Attributes;
  }


  // Yanıt sayısını güncelle
  async updateReplyCount(commentId, increment = true) {
    const params = {
      TableName: this.tableName,
      Key: { commentId },
      UpdateExpression: 'SET replyCount = if_not_exists(replyCount, :zero) + :inc, updatedAt = :now',
      ExpressionAttributeValues: {
        ':inc': increment ? 1 : -1,
        ':zero': 0,
        ':now': new Date().toISOString()
      },
      ReturnValues: 'ALL_NEW'
    };

    const { Attributes } = await docClient.send(new UpdateCommand(params));
    return Attributes;
  }

  // Onay bekleyen yorumları getir
  async getPendingComments() {
    const params = {
      TableName: this.tableName,
      FilterExpression: '#approved = :approved',
      ExpressionAttributeNames: {
        '#approved': 'isApproved'
      },
      ExpressionAttributeValues: {
        ':approved': false
      }
    };

    const { Items } = await docClient.send(new ScanCommand(params));
    return Items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
}

module.exports = new CommentModel();
