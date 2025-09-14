// backend/src/middlewares/auth.middleware.js
const jwt = require('jsonwebtoken');
const { docClient, USERS_TABLE } = require('../config/aws.config');
const { GetCommand } = require('@aws-sdk/lib-dynamodb');

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Yetkilendirme tokenı bulunamadı veya formatı yanlış.' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token bulunamadı.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const params = {
      TableName: USERS_TABLE,
      Key: { userId: decoded.userId },
    };
    const { Item: user } = await docClient.send(new GetCommand(params));

    if (!user) {
      return res.status(401).json({ message: 'Kullanıcı bulunamadı veya token geçersiz.' });
    }
    
    // passwordHash gibi hassas bilgileri req.user'dan çıkar
    const { passwordHash, ...userData } = user;
    req.user = userData; // Kullanıcı bilgilerini request objesine ekle
    next();
  } catch (error) {
    console.error("Token doğrulama hatası:", error.name, error.message);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token süresi dolmuş. Lütfen tekrar giriş yapın.' });
    }
    if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Geçersiz token.' });
    }
    // Diğer beklenmedik JWT hataları için
    return res.status(401).json({ message: 'Token doğrulanamadı.' });
  }
};

// Optional verifyToken - token varsa doğrula, yoksa devam et
const optionalVerifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // Token yoksa req.user'ı null yap ve devam et
    req.user = null;
    return next();
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const params = {
      TableName: USERS_TABLE,
      Key: { userId: decoded.userId },
    };
    const { Item: user } = await docClient.send(new GetCommand(params));

    if (!user) {
      req.user = null;
      return next();
    }
    
    // passwordHash gibi hassas bilgileri req.user'dan çıkar
    const { passwordHash, ...userData } = user;
    req.user = userData; // Kullanıcı bilgilerini request objesine ekle
    next();
  } catch (error) {
    console.error("Optional token doğrulama hatası:", error.name, error.message);
    // Hata durumunda da devam et, sadece req.user'ı null yap
    req.user = null;
    next();
  }
};

const isAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: 'Yetkisiz erişim. Bu işlem için admin olmanız gerekmektedir.' });
  }
  next();
};

module.exports = { verifyToken, optionalVerifyToken, isAdmin };