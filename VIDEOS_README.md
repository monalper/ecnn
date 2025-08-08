# OpenWall Video Sistemi

Bu dokümantasyon, OpenWall projesine eklenen video sistemi özelliklerini açıklar.

## Özellikler

### 🎥 Video Yönetimi
- **Video Yükleme**: Admin panelinden video dosyaları yükleyebilme
- **Thumbnail Desteği**: Her video için özel thumbnail yükleme
- **Video Bilgileri**: Başlık, açıklama, süre bilgileri
- **Güvenli Erişim**: Şifre korumalı video erişimi

### 🎮 Custom Video Player
- **Modern Kontroller**: Play/pause, ses kontrolü, tam ekran
- **Progress Bar**: Video ilerleme çubuğu
- **Responsive Tasarım**: Mobil ve masaüstü uyumlu
- **Keyboard Shortcuts**: Klavye kısayolları desteği

## Kurulum

### 1. Backend Kurulumu

#### DynamoDB Tablosu Oluşturma
```bash
cd backend
npm run create-videos-table
```

#### Gerekli Environment Variables
```env
DYNAMODB_VIDEO_TABLE=OpenWallVideos
AWS_REGION=eu-north-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
S3_BUCKET_NAME=your_bucket_name
```

### 2. Frontend Kurulumu
```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

### Public Endpoints
- `GET /api/videos` - Tüm videoları listele
- `GET /api/videos/:id` - Belirli bir videoyu getir

### Admin Endpoints (Authentication Required)
- `POST /api/videos` - Yeni video oluştur
- `PUT /api/videos/:id` - Video güncelle
- `DELETE /api/videos/:id` - Video sil
- `POST /api/videos/upload` - Video dosyası yükle
- `POST /api/videos/upload-thumbnail` - Thumbnail yükle

## Kullanım

### Admin Panel
1. `/admin/videos` sayfasına gidin
2. "Yeni Video Ekle" butonuna tıklayın
3. Video dosyası, thumbnail ve bilgileri girin
4. Kaydedin

### Kullanıcı Erişimi
1. `/videos` sayfasına gidin
2. Şifre girin: `goofygoober`
3. Videoları görüntüleyin ve oynatın

## Dosya Yapısı

### Backend
```
backend/src/
├── models/
│   └── video.model.js          # Video veritabanı modeli
├── controllers/
│   └── video.controller.js     # Video işlemleri
├── routes/
│   └── video.routes.js         # Video API rotaları
└── utils/
    └── create-videos-table.js  # DynamoDB tablo oluşturma
```

### Frontend
```
frontend/src/
├── pages/
│   ├── VideosPage.jsx          # Video listesi sayfası
│   ├── VideoDetailPage.jsx     # Video detay sayfası
│   └── admin/
│       └── AdminVideosPage.jsx # Admin video yönetimi
├── components/
│   └── CustomVideoPlayer.jsx   # Özel video oynatıcı
└── App.jsx                     # Rota tanımlamaları
```

## Video Formatları

### Desteklenen Video Formatları
- MP4 (H.264)
- WebM
- OGV

### Dosya Boyutu Limitleri
- Video: Sınırsız boyut
- Thumbnail: Maksimum 5MB

## Güvenlik

### Erişim Kontrolü
- Admin paneli: JWT token ile kimlik doğrulama
- Kullanıcı erişimi: Şifre korumalı (goofygoober)

### Dosya Güvenliği
- S3 presigned URL'ler ile güvenli yükleme
- CORS koruması
- Dosya tipi doğrulaması

## Özelleştirme

### Video Player Stilleri
`CustomVideoPlayer.jsx` dosyasından video oynatıcı stillerini özelleştirebilirsiniz.

### Thumbnail Placeholder
Varsayılan thumbnail görüntüsü için SVG data URL kullanılmaktadır.

## Sorun Giderme

### Yaygın Sorunlar

1. **Video Yüklenmiyor**
   - S3 bucket CORS ayarlarını kontrol edin
   - Dosya boyutu limitini kontrol edin
   - AWS credentials'ları doğrulayın

2. **Video Oynatılmıyor**
   - Video formatını kontrol edin
   - Browser video codec desteğini kontrol edin

3. **Thumbnail Görünmüyor**
   - Thumbnail dosyasının yüklendiğinden emin olun
   - S3 URL'lerinin erişilebilir olduğunu kontrol edin

### Log Kontrolü
```bash
# Backend logları
cd backend
npm run dev

# Frontend console
# Browser Developer Tools > Console
```

## Geliştirme

### Yeni Özellik Ekleme
1. Backend model ve controller'ı güncelleyin
2. Frontend component'lerini oluşturun
3. API rotalarını ekleyin
4. Test edin

### Test Etme
```bash
# Backend test
curl -X GET http://localhost:5000/api/videos

# Frontend test
# Browser'da /videos sayfasını ziyaret edin
```

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## İletişim

Sorularınız için: [your-email@example.com] 