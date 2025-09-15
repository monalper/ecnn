const { docClient, USERS_TABLE } = require('../config/aws.config');
const { GetCommand, ScanCommand, UpdateCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb');

// Public: Kullanıcı profilini username ile getir
exports.getUserProfileByUsername = async (req, res, next) => {
  const { username } = req.params;
  console.log(`Fetching user profile for username: ${username}`);
  
  try {
    const params = {
      TableName: USERS_TABLE,
      FilterExpression: "username = :username",
      ExpressionAttributeValues: {
        ':username': username
      }
    };
    
    console.log('DynamoDB params:', JSON.stringify(params, null, 2));
    
    const { Items } = await docClient.send(new ScanCommand(params));
    console.log(`Found ${Items ? Items.length : 0} users with username: ${username}`);

    if (!Items || Items.length === 0) {
      console.log('No user found with username:', username);
      return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }
    
    // Get the first user found
    const userProfile = Items[0];
    console.log('User profile found:', {
      userId: userProfile.userId,
      username: userProfile.username,
      name: userProfile.name,
      isAdmin: userProfile.isAdmin
    });
    
    // Only return admin users for public profiles
    if (!userProfile.isAdmin) {
      console.log('User is not admin, returning 404');
      return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }
    
    // Prepare public profile data
    const publicProfile = {
      userId: userProfile.userId,
      username: userProfile.username,
      name: userProfile.name,
      avatarUrl: userProfile.avatarUrl || '',
      bio: userProfile.bio || '',
      createdAt: userProfile.createdAt,
      logCount: userProfile.logCount || 0,
      reviewCount: userProfile.reviewCount || 0,
      listCount: userProfile.listCount || 0,
      followerCount: userProfile.followerCount || 0,
      followingCount: userProfile.followingCount || 0,
      watchlistCount: userProfile.watchlistCount || 0,
      pinnedLogId: userProfile.pinnedLogId || ''
    };
    
    console.log('Returning public profile:', publicProfile);
    res.status(200).json(publicProfile);
  } catch (error) {
    console.error("Get User Profile Error:", error);
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      code: error.code
    });
    next(error);
  }
};

// Test endpoint to check all users
exports.testGetAllUsers = async (req, res, next) => {
  try {
    const params = {
      TableName: USERS_TABLE,
      ProjectionExpression: 'userId, username, name, isAdmin'
    };
    const { Items } = await docClient.send(new ScanCommand(params));
    
    console.log('All users in database:', Items);
    res.status(200).json(Items || []);
  } catch (error) {
    console.error("Test Get All Users Error:", error);
    next(error);
  }
};

// Admin: Tüm kullanıcıları listele
exports.listAllUsers = async (req, res, next) => {
  try {
    const params = {
      TableName: USERS_TABLE,
      // Admin panelinde gösterilecek alanlar. `passwordHash` hariç tutulmalı.
      ProjectionExpression: 'userId, username, email, #name, isAdmin, isVerified, createdAt, updatedAt',
      ExpressionAttributeNames: {
        '#name': 'name',
      },
    };
    const { Items } = await docClient.send(new ScanCommand(params));
    
    // Scan tüm tabloyu tarar, çok sayıda kullanıcı varsa GSI ile daha verimli sorgular düşünülebilir.
    // Şimdilik `passwordHash` zaten ProjectionExpression ile gelmiyor.
    res.status(200).json(Items || []);
  } catch (error) {
    console.error("List All Users Error:", error);
    next(error);
  }
};

// Admin: Kullanıcının admin yetkisini değiştir (toggle)
exports.toggleUserAdminStatus = async (req, res, next) => {
  const { userId } = req.params; // Admin yetkisi değiştirilecek kullanıcının ID'si
  const adminPerformingAction = req.user; // İşlemi yapan admin

  // Kendi admin yetkisini değiştirmesini engelle
  if (adminPerformingAction.userId === userId) {
    return res.status(400).json({ message: 'Kendi admin yetkinizi bu arayüzden değiştiremezsiniz.' });
  }

  try {
    const getParams = { TableName: USERS_TABLE, Key: { userId } };
    const { Item: userToUpdate } = await docClient.send(new GetCommand(getParams));

    if (!userToUpdate) {
      return res.status(404).json({ message: 'Yetkisi değiştirilecek kullanıcı bulunamadı.' });
    }

    const newIsAdminStatus = !userToUpdate.isAdmin; // Mevcut durumun tersini al

    const updateParams = {
      TableName: USERS_TABLE,
      Key: { userId },
      UpdateExpression: 'SET isAdmin = :newStatus, updatedAt = :now',
      ExpressionAttributeValues: {
        ':newStatus': newIsAdminStatus,
        ':now': new Date().toISOString(),
      },
      ReturnValues: 'UPDATED_NEW', // Sadece güncellenen attributeları döndür
    };
    const { Attributes: updatedAttributes } = await docClient.send(new UpdateCommand(updateParams));
    
    // Güncellenmiş kullanıcı bilgisini (passwordHash olmadan) döndür
    const { passwordHash, ...safeUpdatedUser } = { ...userToUpdate, ...updatedAttributes };


    res.status(200).json({ 
      message: `Kullanıcı '${userToUpdate.username}' için admin yetkisi başarıyla '${newIsAdminStatus ? 'verildi' : 'alındı'}'.`,
      user: safeUpdatedUser
    });
  } catch (error) {
    console.error("Toggle Admin Status Error:", error);
    next(error);
  }
};