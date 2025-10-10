require('dotenv').config();
const express = require('express');
const cors = require('cors');

// === ROUTE IMPORTS ===
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
const bannerRoutes = require('./routes/banner.routes');
const shareRoutes = require('./routes/share.routes'); // ✅ yeni eklendi

const app = express();

// === CORS AYARLARI ===
const allowedOrigins = [
  'https://ecnn.vercel.app',
  'http://localhost:5173',
  'https://openwall.vercel.app',
  'https://openwall.com.tr',
  'https://www.openwall.com.tr'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('CORS policy violation'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// === ROOT ===
app.get('/', (req, res) => {
  res.json({ message: 'ECNN API is running!' });
});

// === API ROUTES ===
app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/admin/articles', adminArticleRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin/users', adminUserRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/shortlink', shortlinkRoutes);
app.use('/api/dictionary', dictionaryRoutes);
app.use('/', sitemapRoutes);

// === YENİ PAYLAŞIM ROUTE'U ===
app.use('/', shareRoutes);

// === KISA LİNK ===
app.get('/s/:shortId', require('./shortlink.controller').redirectShortlink);

// === ERROR HANDLER ===
app.use((err, req, res, next) => {
  console.error('Global Hata:', err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Sunucuda bir hata oluştu.',
    error: process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}
  });
});

// === VERCEL EXPORT ===
module.exports = app;

// === LOKAL ÇALIŞMA ===
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 ECNN backend ${PORT} portunda çalışıyor.`);
    console.log(`Frontend: ${process.env.FRONTEND_URL || 'https://openwall.com.tr'}`);
  });
}
