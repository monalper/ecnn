require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Rotaları import et
const authRoutes = require('./routes/auth.routes');
const articleRoutes = require('./routes/article.routes');
const adminArticleRoutes = require('./routes/admin.article.routes');
const userRoutes = require('./routes/user.routes');
const adminUserRoutes = require('./routes/admin.user.routes');
const uploadRoutes = require('./routes/upload.routes');
const shortlinkRoutes = require('./shortlink.routes');
const dictionaryRoutes = require('./routes/dictionary.routes');
const sitemapRoutes = require('./routes/sitemap.routes');
const galleryRoutes = require('./routes/gallery.routes');
const videoRoutes = require('./routes/video.routes');
const commentRoutes = require('./routes/comment.routes');


const app = express();

// CORS ayarları
const allowedOrigins = [
  'https://ecnn.vercel.app',      // Eski/diğer frontend
  'http://localhost:5173',       // Local geliştirme
  'https://openwall.vercel.app', // YENİ frontend domaininiz
  'https://openwall.com.tr',     // EKLENEN: Yeni domain
  'https://www.openwall.com.tr'  // www'lu domain de desteklensin
];

app.use(cors({
  origin: function (origin, callback) {
    // local çalışmada origin undefined olabilir
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
      callback(null, true);
    } else {
      callback(new Error('CORS policy violation'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'ECNN API is running!' });
});

// API endpoint
app.get('/api', (req, res) => {
  res.json({ message: 'ECNN API is running!' });
});

// API Rotaları
app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/admin/articles', adminArticleRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin/users', adminUserRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/comments', commentRoutes);

// Kısa link API endpointi
app.use('/api/shortlink', shortlinkRoutes);

// Sözlük API endpointi
app.use('/api/dictionary', dictionaryRoutes);

// Sitemap ve SEO endpointleri
app.use('/', sitemapRoutes);

// Kısa link yönlendirme endpointi (paylaşılacak olan)
app.get('/s/:shortId', require('./shortlink.controller').redirectShortlink);

// Hata Yönetimi Middleware'i
app.use((err, req, res, next) => {
  console.error("Global Hata Yakalayıcı:", err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Sunucuda bir hata oluştu.',
    error: process.env.NODE_ENV === 'development' ? { message: err.message, stack: err.stack } : {}
  });
});

// Vercel için export
module.exports = app;

// Sadece doğrudan çalıştırıldığında server'ı başlat
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  
  app.listen(PORT, () => {
    console.log(`ECNN backend sunucusu ${PORT} portunda çalışıyor.`);
    console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'https://ecnn.vercel.app'}`);
    console.log(`AWS Region: ${process.env.AWS_REGION}`);
    console.log(`Users Table: ${process.env.DYNAMODB_USERS_TABLE}`);
    console.log(`Articles Table: ${process.env.DYNAMODB_ARTICLES_TABLE}`);
    console.log(`Gallery Table: ${process.env.DYNAMODB_GALLERY_TABLE || 'OpenWallGallery'}`);
    console.log(`Videos Table: ${process.env.DYNAMODB_VIDEO_TABLE || 'OpenWallVideos'}`);
    console.log(`Comments Table: ${process.env.DYNAMODB_COMMENTS_TABLE || 'OpenWallComments'}`);
    console.log(`S3 Bucket: ${process.env.S3_BUCKET_NAME}`);
    console.log(`\n📝 Not: Galeri tablosu yoksa, 'npm run create-gallery-table' komutunu çalıştırın.`);
    console.log(`📝 Not: Videolar tablosu yoksa, 'npm run create-videos-table' komutunu çalıştırın.`);
    console.log(`📝 Not: Yorumlar tablosu yoksa, 'npm run create-comments-table' komutunu çalıştırın.`);
  });
}
