// backend/src/models/user.model.js
const { docClient, USERS_TABLE } = require('../config/aws.config');
const { PutCommand, GetCommand, UpdateCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');

// User modeli ve işlemleri
class UserModel {
  constructor() {
    this.tableName = USERS_TABLE;
  }

  // Kullanıcı oluştur
  async createUser(userData) {
    const {
      userId,
      username,
      email,
      password,
      name,
      isAdmin = false,
      isActive = true
    } = userData;

    const now = new Date().toISOString();

    const user = {
      userId, // Primary Key
      username,
      email,
      password,
      name,
      isAdmin,
      isActive,
      likedComments: [], // Beğenilen yorumlar array'i
      likedVideos: [], // Beğenilen videolar array'i
      savedArticles: [], // Kaydedilen makaleler array'i (slug'lar)
      createdAt: now,
      updatedAt: now
    };

    const params = {
      TableName: this.tableName,
      Item: user,
      ConditionExpression: "attribute_not_exists(userId)"
    };

    await docClient.send(new PutCommand(params));
    return user;
  }

  // Kullanıcı getir
  async getUserById(userId) {
    const params = {
      TableName: this.tableName,
      Key: { userId }
    };

    const { Item } = await docClient.send(new GetCommand(params));
    return Item;
  }

  // Username ile kullanıcı getir
  async getUserByUsername(username) {
    const params = {
      TableName: this.tableName,
      FilterExpression: "username = :username",
      ExpressionAttributeValues: {
        ':username': username
      }
    };

    const { Items } = await docClient.send(ScanCommand(params));
    return Items.length > 0 ? Items[0] : null;
  }

  // Email ile kullanıcı getir
  async getUserByEmail(email) {
    const params = {
      TableName: this.tableName,
      FilterExpression: "email = :email",
      ExpressionAttributeValues: {
        ':email': email
      }
    };

    const { Items } = await docClient.send(ScanCommand(params));
    return Items.length > 0 ? Items[0] : null;
  }

  // Kullanıcının yorumu beğenip beğenmediğini kontrol et
  async hasUserLikedComment(userId, commentId) {
    const user = await this.getUserById(userId);
    if (!user) return false;
    
    return user.likedComments && user.likedComments.includes(commentId);
  }

  // Kullanıcının like'ını ekle/çıkar
  async toggleUserLike(userId, commentId, action) {
    const user = await this.getUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const likedComments = user.likedComments || [];
    const hasLiked = likedComments.includes(commentId);

    if (action === 'like' && hasLiked) {
      throw new Error('User already liked this comment');
    }

    if (action === 'unlike' && !hasLiked) {
      throw new Error('User has not liked this comment');
    }

    let newLikedComments;

    if (action === 'like') {
      newLikedComments = [...likedComments, commentId];
    } else {
      newLikedComments = likedComments.filter(id => id !== commentId);
    }

    const params = {
      TableName: this.tableName,
      Key: { userId },
      UpdateExpression: 'SET likedComments = :likedComments, updatedAt = :now',
      ExpressionAttributeValues: {
        ':likedComments': newLikedComments,
        ':now': new Date().toISOString()
      },
      ReturnValues: 'ALL_NEW'
    };

    const { Attributes } = await docClient.send(new UpdateCommand(params));
    return Attributes;
  }

  // Kullanıcının beğendiği yorumları getir
  async getUserLikedComments(userId) {
    const user = await this.getUserById(userId);
    if (!user) return [];
    
    return user.likedComments || [];
  }

  // Birden fazla yorum için kullanıcının beğeni durumunu kontrol et
  async getUserLikesForComments(userId, commentIds) {
    const user = await this.getUserById(userId);
    if (!user) return [];
    
    const likedComments = user.likedComments || [];
    return commentIds.filter(commentId => likedComments.includes(commentId));
  }

  // Kullanıcının videoyu beğenip beğenmediğini kontrol et
  async hasUserLikedVideo(userId, videoId) {
    const user = await this.getUserById(userId);
    if (!user) return false;
    
    return user.likedVideos && user.likedVideos.includes(videoId);
  }

  // Kullanıcının video like'ını ekle/çıkar
  async toggleUserVideoLike(userId, videoId, action) {
    const user = await this.getUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const likedVideos = user.likedVideos || [];
    const hasLiked = likedVideos.includes(videoId);

    if (action === 'like' && hasLiked) {
      throw new Error('User already liked this video');
    }

    if (action === 'unlike' && !hasLiked) {
      throw new Error('User has not liked this video');
    }

    let newLikedVideos;

    if (action === 'like') {
      newLikedVideos = [...likedVideos, videoId];
    } else {
      newLikedVideos = likedVideos.filter(id => id !== videoId);
    }

    const params = {
      TableName: this.tableName,
      Key: { userId },
      UpdateExpression: 'SET likedVideos = :likedVideos, updatedAt = :now',
      ExpressionAttributeValues: {
        ':likedVideos': newLikedVideos,
        ':now': new Date().toISOString()
      },
      ReturnValues: 'ALL_NEW'
    };

    const { Attributes } = await docClient.send(new UpdateCommand(params));
    return Attributes;
  }

  // Kullanıcının beğendiği videoları getir
  async getUserLikedVideos(userId) {
    const user = await this.getUserById(userId);
    if (!user) return [];
    
    return user.likedVideos || [];
  }

  // Kullanıcının makaleyi kaydedip kaydetmediğini kontrol et
  async hasUserSavedArticle(userId, articleSlug) {
    const user = await this.getUserById(userId);
    if (!user) return false;
    
    return user.savedArticles && user.savedArticles.includes(articleSlug);
  }

  // Kullanıcının kaydedilen makale durumunu değiştir (kaydet/kaldır)
  async toggleUserSavedArticle(userId, articleSlug, action) {
    const user = await this.getUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const savedArticles = user.savedArticles || [];
    const hasSaved = savedArticles.includes(articleSlug);

    if (action === 'save' && hasSaved) {
      throw new Error('User already saved this article');
    }

    if (action === 'unsave' && !hasSaved) {
      throw new Error('User has not saved this article');
    }

    let newSavedArticles;

    if (action === 'save') {
      newSavedArticles = [...savedArticles, articleSlug];
    } else {
      newSavedArticles = savedArticles.filter(slug => slug !== articleSlug);
    }

    const params = {
      TableName: this.tableName,
      Key: { userId },
      UpdateExpression: 'SET savedArticles = :savedArticles, updatedAt = :now',
      ExpressionAttributeValues: {
        ':savedArticles': newSavedArticles,
        ':now': new Date().toISOString()
      },
      ReturnValues: 'ALL_NEW'
    };

    const { Attributes } = await docClient.send(new UpdateCommand(params));
    return Attributes;
  }

  // Kullanıcının kaydedilen makalelerini getir
  async getUserSavedArticles(userId) {
    const user = await this.getUserById(userId);
    if (!user) return [];
    
    return user.savedArticles || [];
  }
}

module.exports = new UserModel();
