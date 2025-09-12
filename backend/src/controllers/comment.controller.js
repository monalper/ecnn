// backend/src/controllers/comment.controller.js
const commentModel = require('../models/comment.model');
const { v4: uuidv4 } = require('uuid');
const { checkCommentForBannedWords } = require('../utils/bannedWords');

// Yeni yorum oluştur
exports.createComment = async (req, res, next) => {
  try {
    const { articleSlug, authorName, authorEmail, content, parentCommentId } = req.body;
    
    // Validasyon
    if (!articleSlug || !authorName || !authorEmail || !content) {
      return res.status(400).json({ 
        message: 'Makale slug, yazar adı, e-posta ve içerik alanları zorunludur.' 
      });
    }

    // E-posta formatı kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(authorEmail)) {
      return res.status(400).json({ 
        message: 'Geçerli bir e-posta adresi giriniz.' 
      });
    }

    // İçerik uzunluğu kontrolü
    if (content.length < 10) {
      return res.status(400).json({ 
        message: 'Yorum en az 10 karakter olmalıdır.' 
      });
    }

    if (content.length > 1000) {
      return res.status(400).json({ 
        message: 'Yorum en fazla 1000 karakter olabilir.' 
      });
    }

    // IP adresi ve user agent bilgilerini al
    const ipAddress = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
    const userAgent = req.get('User-Agent');

    // Yasaklı kelime kontrolü
    const bannedWordsCheck = checkCommentForBannedWords(authorName, authorEmail, content);
    
    // Admin kontrolü - eğer kullanıcı admin ise yorumu otomatik onayla
    let isApproved = true; // Varsayılan olarak onaylı
    let isAdmin = false;
    
    // Eğer request'te user bilgisi varsa (authenticated user) admin kontrolü yap
    if (req.user && req.user.isAdmin) {
      isApproved = true; // Admin yorumları otomatik onaylı
      isAdmin = true;
    } else if (bannedWordsCheck.hasBannedWords) {
      // Yasaklı kelime içeriyorsa onay beklemeye al
      isApproved = false;
      console.log(`Yorum yasaklı kelime içeriyor: ${bannedWordsCheck.bannedWords.join(', ')}`);
    }

    const commentData = {
      commentId: uuidv4(),
      articleSlug,
      authorName: authorName.trim(),
      authorEmail: authorEmail.trim().toLowerCase(),
      content: content.trim(),
      parentCommentId: parentCommentId || null,
      isApproved,
      isAdmin,
      ipAddress,
      userAgent
    };

    const comment = await commentModel.createComment(commentData);

    // Eğer yanıt yorumu ise, ana yorumun yanıt sayısını artır
    if (parentCommentId) {
      await commentModel.updateReplyCount(parentCommentId, true);
    }

    // Kullanıcıya uygun mesaj gönder
    let responseMessage = 'Yorumunuz başarıyla gönderildi.';
    if (bannedWordsCheck.hasBannedWords && !isAdmin) {
      responseMessage = 'Yorumunuz gönderildi. Onay beklemektedir.';
    } else if (!isApproved) {
      responseMessage = 'Yorumunuz gönderildi. Onaylandıktan sonra yayınlanacaktır.';
    } else {
      responseMessage = 'Yorumunuz başarıyla gönderildi ve yayınlandı.';
    }

    res.status(201).json({
      message: responseMessage,
      comment: {
        commentId: comment.commentId,
        authorName: comment.authorName,
        content: comment.content,
        createdAt: comment.createdAt,
        isApproved: comment.isApproved,
        needsModeration: bannedWordsCheck.hasBannedWords && !isAdmin
      }
    });

  } catch (error) {
    console.error('Create Comment Error:', error);
    next(error);
  }
};

// Makaleye ait yorumları getir
exports.getCommentsByArticle = async (req, res, next) => {
  try {
    const { articleSlug } = req.params;
    const { includeReplies = 'true' } = req.query;

    if (!articleSlug) {
      return res.status(400).json({ message: 'Makale slug gerekli.' });
    }

    const comments = await commentModel.getCommentsByArticle(
      articleSlug, 
      includeReplies === 'true'
    );

    res.status(200).json(comments);

  } catch (error) {
    console.error('Get Comments By Article Error:', error);
    next(error);
  }
};

// Tüm yorumları getir (admin)
exports.getAllComments = async (req, res, next) => {
  try {
    const comments = await commentModel.getAllComments();
    res.status(200).json(comments);
  } catch (error) {
    console.error('Get All Comments Error:', error);
    next(error);
  }
};

// Yorumu ID ile getir
exports.getCommentById = async (req, res, next) => {
  try {
    const { commentId } = req.params;

    if (!commentId) {
      return res.status(400).json({ message: 'Yorum ID gerekli.' });
    }

    const comment = await commentModel.getCommentById(commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Yorum bulunamadı.' });
    }

    res.status(200).json(comment);

  } catch (error) {
    console.error('Get Comment By ID Error:', error);
    next(error);
  }
};

// Yorumu güncelle (admin)
exports.updateComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { content, isApproved, authorName, authorEmail } = req.body;

    if (!commentId) {
      return res.status(400).json({ message: 'Yorum ID gerekli.' });
    }

    // Yorumun var olup olmadığını kontrol et
    const existingComment = await commentModel.getCommentById(commentId);
    if (!existingComment) {
      return res.status(404).json({ message: 'Yorum bulunamadı.' });
    }

    const updateData = {};
    if (content !== undefined) updateData.content = content;
    if (isApproved !== undefined) updateData.isApproved = isApproved;
    if (authorName !== undefined) updateData.authorName = authorName;
    if (authorEmail !== undefined) updateData.authorEmail = authorEmail;

    const updatedComment = await commentModel.updateComment(commentId, updateData);

    res.status(200).json({
      message: 'Yorum güncellendi.',
      comment: updatedComment
    });

  } catch (error) {
    console.error('Update Comment Error:', error);
    next(error);
  }
};

// Yorumu sil (admin)
exports.deleteComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;

    if (!commentId) {
      return res.status(400).json({ message: 'Yorum ID gerekli.' });
    }

    // Yorumun var olup olmadığını kontrol et
    const existingComment = await commentModel.getCommentById(commentId);
    if (!existingComment) {
      return res.status(404).json({ message: 'Yorum bulunamadı.' });
    }

    await commentModel.deleteComment(commentId);

    // Eğer yanıt yorumu ise, ana yorumun yanıt sayısını azalt
    if (existingComment.parentCommentId) {
      await commentModel.updateReplyCount(existingComment.parentCommentId, false);
    }

    res.status(200).json({ message: 'Yorum silindi.' });

  } catch (error) {
    console.error('Delete Comment Error:', error);
    next(error);
  }
};

// Yorum beğeni sayısını güncelle
exports.toggleLike = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { action } = req.body; // 'like' veya 'unlike'

    if (!commentId) {
      return res.status(400).json({ message: 'Yorum ID gerekli.' });
    }

    if (!['like', 'unlike'].includes(action)) {
      return res.status(400).json({ message: 'Geçersiz işlem. "like" veya "unlike" olmalı.' });
    }

    // Yorumun var olup olmadığını kontrol et
    const existingComment = await commentModel.getCommentById(commentId);
    if (!existingComment) {
      return res.status(404).json({ message: 'Yorum bulunamadı.' });
    }

    const increment = action === 'like';
    const updatedComment = await commentModel.updateLikeCount(commentId, increment);

    res.status(200).json({
      message: `Yorum ${action === 'like' ? 'beğenildi' : 'beğeni kaldırıldı'}.`,
      likeCount: updatedComment.likeCount
    });

  } catch (error) {
    console.error('Toggle Like Error:', error);
    next(error);
  }
};

// Onay bekleyen yorumları getir (admin)
exports.getPendingComments = async (req, res, next) => {
  try {
    const comments = await commentModel.getPendingComments();
    res.status(200).json(comments);
  } catch (error) {
    console.error('Get Pending Comments Error:', error);
    next(error);
  }
};

// Yorum onay durumunu değiştir (admin)
exports.toggleApproval = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { isApproved } = req.body;

    if (!commentId) {
      return res.status(400).json({ message: 'Yorum ID gerekli.' });
    }

    if (typeof isApproved !== 'boolean') {
      return res.status(400).json({ message: 'Onay durumu boolean olmalı.' });
    }

    // Yorumun var olup olmadığını kontrol et
    const existingComment = await commentModel.getCommentById(commentId);
    if (!existingComment) {
      return res.status(404).json({ message: 'Yorum bulunamadı.' });
    }

    const updatedComment = await commentModel.updateComment(commentId, { isApproved });

    res.status(200).json({
      message: `Yorum ${isApproved ? 'onaylandı' : 'onay kaldırıldı'}.`,
      comment: updatedComment
    });

  } catch (error) {
    console.error('Toggle Approval Error:', error);
    next(error);
  }
};

module.exports = {
  createComment: exports.createComment,
  getCommentsByArticle: exports.getCommentsByArticle,
  getAllComments: exports.getAllComments,
  getCommentById: exports.getCommentById,
  updateComment: exports.updateComment,
  deleteComment: exports.deleteComment,
  toggleLike: exports.toggleLike,
  getPendingComments: exports.getPendingComments,
  toggleApproval: exports.toggleApproval
};
