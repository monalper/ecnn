// backend/src/controllers/article.controller.js
const slugify = require('slugify'); // URL dostu slug'lar için
const { docClient, ARTICLES_TABLE, USERS_TABLE } = require('../config/aws.config');
const { PutCommand, GetCommand, ScanCommand, DeleteCommand, UpdateCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb');
const { clearSitemapCache } = require('./sitemap.controller');

// Basit cache sistemi
class SimpleCache {
  constructor() {
    this.cache = new Map();
  }

  set(key, value, ttl = 5 * 60 * 1000) { // 5 dakika default
    const expiry = Date.now() + ttl;
    this.cache.set(key, { value, expiry });
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }

  clear() {
    this.cache.clear();
  }
}

const articleCache = new SimpleCache();

// Yardımcı fonksiyon: Slug oluşturma
// Not: Slug'ın benzersizliği veritabanı seviyesinde (primary key) sağlanır.
// Eğer aynı başlıkla birden fazla makale oluşturulmaya çalışılırsa DynamoDB hata verecektir.
// Gerekirse, slug'a uuid veya tarih ekleyerek benzersizlik garanti altına alınabilir.
// Şimdilik, slugify ile basit bir dönüşüm yapıyoruz.
function createSlug(title) {
  if (!title) return '';
  return slugify(title, { lower: true, strict: true, locale: 'tr' });
}

exports.createArticle = async (req, res, next) => {
  const { title, description, content, coverImage, status = 'draft', categories = [] } = req.body;
  const authorId = req.user.userId; // verifyToken middleware'inden gelir

  if (!title || !content) {
    return res.status(400).json({ message: 'Başlık ve içerik alanları zorunludur.' });
  }

  try {
    const slug = createSlug(title);
    if (!slug) { // slugify boş bir başlık için boş string dönebilir
        return res.status(400).json({ message: 'Geçerli bir başlık girilmelidir (slug oluşturulamadı).' });
    }
    const now = new Date().toISOString();

    const newArticle = {
      slug, // Primary Key
      title,
      description: description || content.substring(0, 200), // Otomatik açıklama (ilk 200 karakter)
      content,
      coverImage: coverImage || '', // S3 URL'si
      authorId, // Users tablosundaki userId'ye referans
      status, // 'draft' veya 'published'
      categories: Array.isArray(categories) ? categories : [], // Kategoriler array olarak saklanır
      createdAt: now,
      updatedAt: now,
    };

    const putParams = {
      TableName: ARTICLES_TABLE,
      Item: newArticle,
      ConditionExpression: "attribute_not_exists(slug)" // Slug'ın benzersiz olmasını garantile
    };
    
    await docClient.send(new PutCommand(putParams));
    
    // Sitemap cache'ini temizle
    clearSitemapCache();
    
    res.status(201).json(newArticle);
  } catch (error) {
    if (error.name === 'ConditionalCheckFailedException') {
      return res.status(409).json({ message: 'Bu başlıkla bir makale zaten mevcut. Lütfen farklı bir başlık seçin (slug çakışması).' });
    }
    console.error("Create Article Error:", error);
    next(error);
  }
};

exports.updateArticle = async (req, res, next) => {
  const { slug: currentSlug } = req.params; // Düzenlenecek makalenin mevcut slug'ı
  const { title, description, content, coverImage, status, categories } = req.body;
  // const editorUserId = req.user.userId; // Makaleyi düzenleyen kullanıcı (isAdmin ile zaten yetkili)

  if (!title && !description && !content && coverImage === undefined && status === undefined && categories === undefined) {
    return res.status(400).json({ message: 'Güncellenecek en az bir alan gönderilmelidir.' });
  }

  try {
    const getParams = { TableName: ARTICLES_TABLE, Key: { slug: currentSlug } };
    const { Item: existingArticle } = await docClient.send(new GetCommand(getParams));

    if (!existingArticle) {
      return res.status(404).json({ message: 'Güncellenecek makale bulunamadı.' });
    }

    // Eğer başlık değişiyorsa ve slug'ın da değişmesi gerekiyorsa, bu durum daha karmaşıktır
    // çünkü primary key (slug) doğrudan güncellenemez. Yeni bir item oluşturup eskiyi silmek gerekir.
    // Bu örnekte, slug'ın sabit kaldığını varsayıyoruz. Eğer başlık değişse bile slug aynı kalır.
    // Eğer slug'ın da değişmesi isteniyorsa, create + delete mantığı uygulanmalıdır.
    // Şimdilik slug'ı değiştirmiyoruz.

    const now = new Date().toISOString();
    
    let updateExpressionParts = [];
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};

    if (title !== undefined) {
      updateExpressionParts.push('#t = :title');
      expressionAttributeNames['#t'] = 'title';
      expressionAttributeValues[':title'] = title;
    }
    if (description !== undefined) {
      updateExpressionParts.push('#d = :description');
      expressionAttributeNames['#d'] = 'description';
      expressionAttributeValues[':description'] = description;
    }
    if (content !== undefined) {
      updateExpressionParts.push('#c = :content');
      expressionAttributeNames['#c'] = 'content';
      expressionAttributeValues[':content'] = content;
    }
    if (coverImage !== undefined) {
      updateExpressionParts.push('#ci = :coverImage');
      expressionAttributeNames['#ci'] = 'coverImage';
      expressionAttributeValues[':coverImage'] = coverImage;
    }
    if (status !== undefined) {
      updateExpressionParts.push('#s = :status');
      expressionAttributeNames['#s'] = 'status';
      expressionAttributeValues[':status'] = status;
    }
    if (categories !== undefined) {
      updateExpressionParts.push('#cat = :categories');
      expressionAttributeNames['#cat'] = 'categories';
      expressionAttributeValues[':categories'] = Array.isArray(categories) ? categories : [];
    }
    
    updateExpressionParts.push('#ua = :updatedAt');
    expressionAttributeNames['#ua'] = 'updatedAt';
    expressionAttributeValues[':updatedAt'] = now;

    if (updateExpressionParts.length === 1 && updateExpressionParts[0].startsWith('#ua')) { // Sadece updatedAt güncelleniyorsa
        return res.status(200).json(existingArticle); // Değişiklik yok gibi kabul edilebilir veya sadece updatedAt güncellenir.
    }


    const updateParams = {
      TableName: ARTICLES_TABLE,
      Key: { slug: currentSlug },
      UpdateExpression: `SET ${updateExpressionParts.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW', // Güncellenmiş item'ı döndür
    };

    const { Attributes: updatedArticle } = await docClient.send(new UpdateCommand(updateParams));
    
    // Sitemap cache'ini temizle
    clearSitemapCache();
    
    res.status(200).json(updatedArticle);

  } catch (error) {
    console.error("Update Article Error:", error);
    next(error);
  }
};

exports.deleteArticle = async (req, res, next) => {
  const { slug } = req.params;
  try {
    const getParams = { TableName: ARTICLES_TABLE, Key: { slug } };
    const { Item: existingArticle } = await docClient.send(new GetCommand(getParams));

    if (!existingArticle) {
      return res.status(404).json({ message: 'Silinecek makale bulunamadı.' });
    }
    
    const deleteParams = { TableName: ARTICLES_TABLE, Key: { slug } };
    await docClient.send(new DeleteCommand(deleteParams));
    
    // Sitemap cache'ini temizle
    clearSitemapCache();

    res.status(200).json({ message: `'${slug}' başlıklı makale başarıyla silindi.` });
  } catch (error) {
    console.error("Delete Article Error:", error);
    next(error);
  }
};

exports.listPublishedArticles = async (req, res, next) => {
  try {
    // Cache kontrolü
    const cacheKey = 'published_articles_v2';
    const cachedData = articleCache.get(cacheKey);
    
    if (cachedData) {
      return res.status(200).json(cachedData);
    }

    const params = {
      TableName: ARTICLES_TABLE,
      FilterExpression: '#st = :status_val',
      ExpressionAttributeNames: { '#st': 'status' },
      ExpressionAttributeValues: { ':status_val': 'published' },
      // Sadece gerekli alanları getir
      ProjectionExpression: 'slug, title, description, content, coverImage, authorName, createdAt, updatedAt, isHighlight, tags, categories, viewCount'
    };
    
    const { Items } = await docClient.send(new ScanCommand(params));
    
    // Client-side sıralama
    const sortedItems = Items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Cache'e kaydet (5 dakika)
    articleCache.set(cacheKey, sortedItems, 5 * 60 * 1000);

    res.status(200).json(sortedItems);
  } catch (error) {
    console.error("List Published Articles Error:", error);
    next(error);
  }
};

// Yardımcı fonksiyon: Makaleye yazar bilgilerini eklemek için
async function enrichArticleWithAuthor(article) {
    if (article && article.authorId) {
        try {
            const authorParams = { TableName: USERS_TABLE, Key: { userId: article.authorId }};
            const { Item: author } = await docClient.send(new GetCommand(authorParams));
            if (author) {
                const { passwordHash, ...authorDetails } = author; // Hassas bilgileri çıkar
                article.author = authorDetails; // Makaleye yazar objesini ekle
            }
        } catch (authorError) {
            console.warn(`Yazar bilgisi getirilemedi (authorId: ${article.authorId}):`, authorError.message);
            // Yazar bilgisi olmasa da makaleyi döndürmeye devam et
        }
    }
    return article;
}


exports.getArticleBySlug = async (req, res, next) => {
  const { slug } = req.params;
  const isAdminUser = req.user && req.user.isAdmin; // Token varsa ve adminse

  try {
    const params = {
      TableName: ARTICLES_TABLE,
      Key: { slug },
    };
    let { Item: article } = await docClient.send(new GetCommand(params));

    if (!article) {
      return res.status(404).json({ message: 'Makale bulunamadı.' });
    }

    // Eğer kullanıcı admin değilse ve makale 'published' değilse, gösterme
    if (!isAdminUser && article.status !== 'published') {
      return res.status(404).json({ message: 'Makale bulunamadı veya henüz yayınlanmamış.' });
    }
    
    article = await enrichArticleWithAuthor(article);

    res.status(200).json(article);
  } catch (error) {
    console.error("Get Article By Slug Error:", error);
    next(error);
  }
};

// Admin için tüm makaleleri listele (taslaklar dahil)
exports.listAllArticlesForAdmin = async (req, res, next) => {
  try {
    const params = {
      TableName: ARTICLES_TABLE,
    };
    const { Items } = await docClient.send(new ScanCommand(params));
    // Client-side sıralama (GSI daha iyi performans sağlar)
    const sortedItems = Items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.status(200).json(sortedItems);
  } catch (error) {
    console.error("List All Articles (Admin) Error:", error);
    next(error);
  }
};

// Admin için makale detayı (taslaklar dahil)
exports.getArticleBySlugForAdmin = async (req, res, next) => {
    const { slug } = req.params;
    try {
      const params = {
        TableName: ARTICLES_TABLE,
        Key: { slug },
      };
      let { Item: article } = await docClient.send(new GetCommand(params));
  
      if (!article) {
        return res.status(404).json({ message: 'Makale bulunamadı.' });
      }
      
      article = await enrichArticleWithAuthor(article);
      res.status(200).json(article);
    } catch (error) {
      console.error("Get Article By Slug (Admin) Error:", error);
      next(error);
    }
};

// Makale öne çıkarma durumunu değiştir
exports.toggleArticleHighlight = async (req, res, next) => {
  const { slug } = req.params;
  const { isHighlighted } = req.body;

  try {
    console.log(`Toggling highlight for article: ${slug}, isHighlighted: ${isHighlighted}`);
    
    // Önce makalenin var olup olmadığını kontrol et
    const getParams = { TableName: ARTICLES_TABLE, Key: { slug } };
    const { Item: existingArticle } = await docClient.send(new GetCommand(getParams));

    if (!existingArticle) {
      return res.status(404).json({ message: 'Makale bulunamadı.' });
    }

    console.log(`Current article highlight status: ${existingArticle.isHighlight}`);

    // Makalenin öne çıkarma durumunu güncelle
    const updateParams = {
      TableName: ARTICLES_TABLE,
      Key: { slug },
      UpdateExpression: 'SET isHighlight = :isHighlight, updatedAt = :now',
      ExpressionAttributeValues: {
        ':isHighlight': isHighlighted,
        ':now': new Date().toISOString()
      },
      ReturnValues: 'ALL_NEW'
    };

    const { Attributes: updatedArticle } = await docClient.send(new UpdateCommand(updateParams));
    console.log(`Article highlight status updated to: ${updatedArticle.isHighlight}`);
    
    res.status(200).json({
      message: `Makale ${isHighlighted ? 'öne çıkarıldı' : 'öne çıkarma kaldırıldı'}`,
      article: updatedArticle
    });
  } catch (error) {
    console.error("Toggle Article Highlight Error:", error);
    res.status(500).json({ message: 'Makale öne çıkarma durumu güncellenemedi.' });
  }
};

// Öne çıkan makaleleri getir
exports.getHighlightedArticles = async (req, res, next) => {
  try {
    console.log('Fetching highlighted articles...');
    
    // Tüm makaleleri getir
    const scanParams = {
      TableName: ARTICLES_TABLE,
      FilterExpression: '#st = :status',
      ExpressionAttributeNames: {
        '#st': 'status'
      },
      ExpressionAttributeValues: {
        ':status': 'published'
      }
    };

    const { Items: allArticles } = await docClient.send(new ScanCommand(scanParams));
    console.log(`Found ${allArticles.length} published articles`);

    // Öne çıkan makaleleri filtrele
    const highlightedArticles = allArticles.filter(article => article.isHighlight === true);
    console.log(`Found ${highlightedArticles.length} highlighted articles`);

    // Makaleleri tarihe göre sırala (en yeni en üstte)
    const sortedArticles = highlightedArticles.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Her makale için yazar bilgilerini ekle
    const articlesWithAuthors = await Promise.all(
      sortedArticles.map(article => enrichArticleWithAuthor(article))
    );

    console.log(`Returning ${articlesWithAuthors.length} highlighted articles`);
    res.status(200).json(articlesWithAuthors);
    
  } catch (error) {
    console.error("Get Highlighted Articles Error:", error);
    res.status(500).json({ message: 'Öne çıkan makaleler getirilemedi.' });
  }
};

// Makale görüntülenme sayısını artır
exports.incrementViewCount = async (req, res) => {
  const { slug } = req.params;
  
  try {
    // Makaleyi bul
    const getCommand = new GetCommand({
      TableName: ARTICLES_TABLE,
      Key: { slug }
    });
    
    const result = await docClient.send(getCommand);
    
    if (!result.Item) {
      return res.status(404).json({ message: 'Makale bulunamadı.' });
    }
    
    // Görüntülenme sayısını artır
    const updateCommand = new UpdateCommand({
      TableName: ARTICLES_TABLE,
      Key: { slug },
      UpdateExpression: 'SET viewCount = if_not_exists(viewCount, :zero) + :inc',
      ExpressionAttributeValues: {
        ':inc': 1,
        ':zero': 0
      },
      ReturnValues: 'ALL_NEW'
    });
    
    const updateResult = await docClient.send(updateCommand);
    
    res.json({ 
      message: 'Görüntülenme sayısı güncellendi.',
      viewCount: updateResult.Attributes.viewCount 
    });
    
  } catch (error) {
    console.error('Görüntülenme sayısı artırılırken hata:', error);
    res.status(500).json({ message: 'Görüntülenme sayısı güncellenemedi.' });
  }
};

// Admin: Görüntülenme sayısını manuel olarak ayarla
exports.setViewCount = async (req, res) => {
  const { slug } = req.params;
  const { viewCount } = req.body;
  
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: 'Bu işlem için admin yetkisi gereklidir.' });
  }
  
  if (typeof viewCount !== 'number' || viewCount < 0) {
    return res.status(400).json({ message: 'Geçerli bir görüntülenme sayısı girin.' });
  }
  
  try {
    const updateCommand = new UpdateCommand({
      TableName: ARTICLES_TABLE,
      Key: { slug },
      UpdateExpression: 'SET viewCount = :viewCount',
      ExpressionAttributeValues: {
        ':viewCount': viewCount
      },
      ReturnValues: 'ALL_NEW'
    });
    
    const result = await docClient.send(updateCommand);
    
    if (!result.Attributes) {
      return res.status(404).json({ message: 'Makale bulunamadı.' });
    }
    
    res.json({ 
      message: 'Görüntülenme sayısı güncellendi.',
      viewCount: result.Attributes.viewCount 
    });
    
  } catch (error) {
    console.error('Görüntülenme sayısı ayarlanırken hata:', error);
    res.status(500).json({ message: 'Görüntülenme sayısı güncellenemedi.' });
  }
};

module.exports = {
  listPublishedArticles: exports.listPublishedArticles,
  getArticleBySlug: exports.getArticleBySlug,
  createArticle: exports.createArticle,
  updateArticle: exports.updateArticle,
  deleteArticle: exports.deleteArticle,
  listAllArticlesForAdmin: exports.listAllArticlesForAdmin,
  getArticleBySlugForAdmin: exports.getArticleBySlugForAdmin,
  toggleArticleHighlight: exports.toggleArticleHighlight,
  getHighlightedArticles: exports.getHighlightedArticles,
  incrementViewCount: exports.incrementViewCount,
  setViewCount: exports.setViewCount
};
