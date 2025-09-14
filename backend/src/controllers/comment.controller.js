// backend/src/controllers/comment.controller.js
const commentModel = require('../models/comment.model');
const userModel = require('../models/user.model');
const { v4: uuidv4 } = require('uuid');
const { checkCommentForBannedWords } = require('../utils/bannedWords');

// Yeni yorum oluştur
exports.createComment = async (req, res, next) => {
  try {
    // Authentication check - only logged in users can comment
    if (!req.user) {
      return res.status(401).json({ 
        message: 'Yorum yapabilmek için giriş yapmanız gerekmektedir.' 
      });
    }

    const { articleSlug, content, parentCommentId } = req.body;
    
    // Validasyon
    if (!articleSlug || !content) {
      return res.status(400).json({ 
        message: 'Makale slug ve içerik alanları zorunludur.' 
      });
    }

    // İçerik uzunluğu kontrolü
    if (content.length < 1) {
      return res.status(400).json({ 
        message: 'Yorum boş olamaz.' 
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
    const bannedWordsCheck = checkCommentForBannedWords(req.user.username, req.user.email, content);
    
    // Admin kontrolü - eğer kullanıcı admin ise yorumu otomatik onayla
    let isApproved = true; // Varsayılan olarak onaylı
    let isAdmin = false;
    
    // Admin kontrolü
    if (req.user.isAdmin) {
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
      authorName: req.user.name || req.user.username, // Display name
      authorUsername: req.user.username, // Username
      authorEmail: req.user.email,
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

    // If user is authenticated, add hasLiked status to comments
    if (req.user) {
      const userId = req.user.userId;
      
      try {
        // Collect all comment IDs (including replies)
        const commentIds = [];
        const collectCommentIds = (comments) => {
          comments.forEach(comment => {
            commentIds.push(comment.commentId);
            if (comment.replies && comment.replies.length > 0) {
              collectCommentIds(comment.replies);
            }
          });
        };
        
        collectCommentIds(comments);
        
        // Get user's liked comments
        const userLikedComments = await userModel.getUserLikesForComments(userId, commentIds);
        
        // Add hasLiked property to each comment
        const addLikeStatus = (comments) => {
          return comments.map(comment => ({
            ...comment,
            hasLiked: userLikedComments.includes(comment.commentId),
            replies: comment.replies ? addLikeStatus(comment.replies) : undefined
          }));
        };
        
        const commentsWithLikes = addLikeStatus(comments);
        return res.status(200).json(commentsWithLikes);
      } catch (error) {
        console.error('Error fetching user likes:', error);
        // If there's an error, return comments without like status
        const addDefaultLikeStatus = (comments) => {
          return comments.map(comment => ({
            ...comment,
            hasLiked: false,
            replies: comment.replies ? addDefaultLikeStatus(comment.replies) : undefined
          }));
        };
        
        const commentsWithDefaultLikes = addDefaultLikeStatus(comments);
        return res.status(200).json(commentsWithDefaultLikes);
      }
    }

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

// Yorumu sil (admin veya kendi yorumu)
exports.deleteComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;

    if (!commentId) {
      return res.status(400).json({ message: 'Yorum ID gerekli.' });
    }

    // Authentication check
    if (!req.user) {
      return res.status(401).json({ message: 'Yorum silmek için giriş yapmanız gerekmektedir.' });
    }

    // Yorumun var olup olmadığını kontrol et
    const existingComment = await commentModel.getCommentById(commentId);
    if (!existingComment) {
      return res.status(404).json({ message: 'Yorum bulunamadı.' });
    }

    // Yetki kontrolü: Admin veya kendi yorumu
    const isAdmin = req.user.isAdmin;
    const normalizedUserEmail = req.user.email ? req.user.email.toLowerCase().trim() : null;
    const normalizedAuthorEmail = existingComment.authorEmail ? existingComment.authorEmail.toLowerCase().trim() : null;
    const isOwnComment = normalizedUserEmail && normalizedAuthorEmail && normalizedUserEmail === normalizedAuthorEmail;
    
    if (!isAdmin && !isOwnComment) {
      return res.status(403).json({ 
        message: 'Bu yorumu silme yetkiniz bulunmamaktadır. Sadece kendi yorumlarınızı silebilirsiniz.' 
      });
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

// Yorum beğeni toggle
exports.toggleLike = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { action } = req.body; // 'like' or 'unlike'

    if (!commentId) {
      return res.status(400).json({ message: 'Yorum ID gerekli.' });
    }

    if (!['like', 'unlike'].includes(action)) {
      return res.status(400).json({ message: 'Geçersiz işlem. "like" veya "unlike" olmalı.' });
    }

    // Authentication check
    if (!req.user) {
      return res.status(401).json({ message: 'Beğeni yapabilmek için giriş yapmanız gerekmektedir.' });
    }

    const userId = req.user.userId;

    // Yorumun var olup olmadığını kontrol et
    const existingComment = await commentModel.getCommentById(commentId);
    if (!existingComment) {
      return res.status(404).json({ message: 'Yorum bulunamadı.' });
    }

    try {
      // Update user's liked comments
      await userModel.toggleUserLike(userId, commentId, action);
      
      // Update comment's like count
      await commentModel.updateLikeCount(commentId, action === 'like');
      
      // Get updated comment
      const updatedComment = await commentModel.getCommentById(commentId);

      res.status(200).json({
        message: `Yorum ${action === 'like' ? 'beğenildi' : 'beğeni kaldırıldı'}.`,
        likeCount: updatedComment.likeCount,
        hasLiked: action === 'like'
      });
    } catch (likeError) {
      // Handle duplicate like errors
      if (likeError.message.includes('already liked') || likeError.message.includes('has not liked')) {
        return res.status(400).json({ 
          message: action === 'like' ? 'Bu yorumu zaten beğendiniz.' : 'Bu yorumu beğenmediniz.' 
        });
      }
      
      // For other errors, re-throw
      throw likeError;
    }

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
