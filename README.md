<div align="center">

# The Openwall
openwall.com.tr


[![My Skills](https://skillicons.dev/icons?i=js,html,css,ts)](https://skillicons.dev)
[![My Skills](https://skillicons.dev/icons?i=nodejs)](https://skillicons.dev)
[![My Skills](https://skillicons.dev/icons?i=aws,gcp,react)](https://skillicons.dev)
[![My Skills](https://skillicons.dev/icons?i=ps,xd)](https://skillicons.dev)

</div>

---

## Proje Hakkında

**OpenWall**, Türkiye'de entelektüel içerik arayan okuyucular için tasarlanmış, 16 farklı kategoride kaliteli içerikler sunan modern bir web platformudur. Platform, akademisyenler, öğrenciler, profesyoneller ve genel okuyucu kitlesine hitap eden kapsamlı bir içerik deneyimi sunar.

### Misyon
- Entelektüel içerik üretimini desteklemek
- Kaliteli ve güvenilir bilgi sunmak
- Çeşitli alanlarda derinlemesine analizler yapmak
- Okuyucuları düşünmeye teşvik etmek

### Vizyon
Türkiye'nin en kapsamlı ve güvenilir entelektüel içerik platformu olmak.

---

## Özellikler

### Kullanıcı Deneyimi
- **Modern UI/UX**: TailwindCSS ile tasarlanmış responsive arayüz
- **Mobil Uyumlu**: Tüm cihazlarda mükemmel görünüm
- **Dark/Light Mode**: Kullanıcı tercihine göre tema değişimi
- **Hızlı Yükleme**: Vite ile optimize edilmiş performans

### İçerik Yönetimi
- **16 Kategori**: Teknoloji, felsefe, sanat, spor, siyaset, ekonomi, sağlık, eğitim, çevre, sosyoloji, psikoloji, din, müzik, sinema, seyahat, yemek
- **Zengin Editör**: TipTap tabanlı gelişmiş metin editörü
- **Galeri Sistemi**: Görsel içerik yönetimi
- **Video Player**: Özel tasarlanmış video oynatıcı
- **Sözlük**: Terim ve kavram açıklamaları

### Güvenlik & Yönetim
- **JWT Authentication**: Güvenli kullanıcı kimlik doğrulama
- **Admin Paneli**: Kapsamlı içerik yönetim sistemi
- **Güvenli Upload**: AWS S3 ile güvenli dosya yükleme
- **Şifre Koruması**: Hassas içerikler için ek güvenlik

### SEO & Optimizasyon
- **SEO Optimizasyonu**: Meta etiketleri, schema markup
- **Sitemap**: Otomatik sitemap.xml oluşturma
- **Bot Desteği**: robots.txt ve crawler optimizasyonu
- **Analytics**: Detaylı kullanıcı analitikleri

---

## Teknoloji Stack

### Frontend
<table>
<tr>
<td align="center" width="20%">
<img src="https://skillicons.dev/icons?i=react" width="40" height="40"/>
<br/><b>React18</b>
</td>
<td align="center" width="20%">
<img src="https://skillicons.dev/icons?i=vite" width="40" height="40"/>
<br/><b>Vite</b>
</td>
<td align="center" width="20%">
<img src="https://skillicons.dev/icons?i=tailwind" width="40" height="40"/>
<br/><b>TailwindCSS</b>
</td>
<td align="center" width="20%">
<img src="https://skillicons.dev/icons?i=js" width="40" height="40"/>
<br/><b>JavaScript</b>
</td>
<td align="center" width="20%">
<img src="https://skillicons.dev/icons?i=html" width="40" height="40"/>
<br/><b>HTML5</b>
</td>
</tr>
</table>

### Backend
<table>
<tr>
<td align="center" width="20%">
<img src="https://skillicons.dev/icons?i=nodejs&theme=dark" width="40" height="40"/>
<br/><b>Node.js</b>
</td>
<td align="center" width="20%">
<img src="https://skillicons.dev/icons?i=express" width="40" height="40"/>
<br/><b>Express.js</b>
</td>
<td align="center" width="20%">
<img src="https://skillicons.dev/icons?i=aws" width="40" height="40"/>
<br/><b>AWS</b>
</td>
<td align="center" width="20%">
<img src="https://skillicons.dev/icons?i=dynamodb" width="40" height="40"/>
<br/><b>DynamoDB</b>
</td>
<td align="center" width="20%">
<img src="https://skillicons.dev/icons?i=docker" width="40" height="40"/>
<br/><b>Docker</b>
</td>
</tr>
</table>

### Araçlar & Servisler
- **Paket Yöneticisi**: npm
- **Build Tool**: Vite
- **CSS Framework**: TailwindCSS
- **PWA**: Service Worker
- **Hosting**: Vercel
- **Database**: AWS DynamoDB
- **Storage**: AWS S3
- **Auth**: JWT

---

## Hızlı Başlangıç

### Gereksinimler
- Node.js (v18 veya üzeri)
- npm (v8 veya üzeri)
- AWS hesabı (DynamoDB ve S3 için)

### Kurulum

1. **Repository'yi klonlayın**
```bash
git clone https://github.com/monalper/ecnn.git
cd ecnn
```

2. **Backend kurulumu**
```bash
cd backend
npm install
cp .env.example .env
# .env dosyasını düzenleyin
npm run dev
```

3. **Frontend kurulumu**
```bash
cd frontend
npm install
cp .env.example .env
# .env dosyasını düzenleyin
npm run dev
```

4. **Veritabanı tablolarını oluşturun**
```bash
cd backend
npm run create-gallery-table
npm run create-videos-table
```

### Erişim
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Admin Panel**: http://localhost:5173/admin

---

## Proje Yapısı

```
📦 OpenWall
├── 📁 frontend/                 # React frontend uygulaması
│   ├── 📁 src/
│   │   ├── 📁 components/       # React bileşenleri
│   │   │   ├── 📁 article/      # Makale bileşenleri
│   │   │   ├── 📁 auth/         # Kimlik doğrulama
│   │   │   ├── 📁 layout/       # Layout bileşenleri
│   │   │   ├── 📁 seo/          # SEO bileşenleri
│   │   │   └── 📁 video/        # Video bileşenleri
│   │   ├── 📁 contexts/         # React context'leri
│   │   ├── 📁 hooks/            # Custom hooks
│   │   ├── 📁 pages/            # Sayfa bileşenleri
│   │   ├── 📁 services/         # API servisleri
│   │   └── 📁 extensions/       # Editor eklentileri
│   ├── 📁 public/               # Statik dosyalar
│   └── 📄 package.json
├── 📁 backend/                  # Node.js backend uygulaması
│   ├── 📁 src/
│   │   ├── 📁 config/           # Konfigürasyon dosyaları
│   │   ├── 📁 controllers/      # API controller'ları
│   │   ├── 📁 middlewares/      # Express middleware'leri
│   │   ├── 📁 models/           # Veritabanı modelleri
│   │   ├── 📁 routes/           # API route'ları
│   │   └── 📁 utils/            # Yardımcı fonksiyonlar
│   └── 📄 package.json
└── 📄 README.md
```

---

## Konfigürasyon

### Environment Variables

#### Backend (.env)
```env
# AWS Konfigürasyonu
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_REGION=eu-north-1

# DynamoDB Tabloları
DYNAMODB_USERS_TABLE=OpenWallUsers
DYNAMODB_ARTICLES_TABLE=OpenWallArticles
DYNAMODB_GALLERY_TABLE=OpenWallGallery
DYNAMODB_VIDEO_TABLE=OpenWallVideos
DYNAMODB_DICTIONARY_TABLE=OpenWallDictionary

# S3 Bucket
S3_BUCKET_NAME=your_bucket_name

# JWT
JWT_SECRET=your_jwt_secret

# CORS
FRONTEND_URL=http://localhost:5173
```

#### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## API Dokümantasyonu

### Authentication
```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

### Articles
```http
GET    /api/articles              # Tüm makaleleri listele
GET    /api/articles/:id          # Belirli makaleyi getir
POST   /api/articles              # Yeni makale oluştur (Admin)
PUT    /api/articles/:id          # Makaleyi güncelle (Admin)
DELETE /api/articles/:id          # Makaleyi sil (Admin)
```

### Gallery
```http
GET    /api/gallery               # Galeri öğelerini listele
GET    /api/gallery/:id           # Belirli galeri öğesini getir
POST   /api/gallery               # Yeni galeri öğesi oluştur (Admin)
PUT    /api/gallery/:id           # Galeri öğesini güncelle (Admin)
DELETE /api/gallery/:id           # Galeri öğesini sil (Admin)
```

### Videos
```http
GET    /api/videos                # Videoları listele
GET    /api/videos/:id            # Belirli videoyu getir
POST   /api/videos                # Yeni video oluştur (Admin)
PUT    /api/videos/:id            # Videoyu güncelle (Admin)
DELETE /api/videos/:id            # Videoyu sil (Admin)
```

### Dictionary
```http
GET    /api/dictionary            # Sözlük terimlerini listele
GET    /api/dictionary/:word      # Belirli terimi getir
POST   /api/dictionary            # Yeni terim ekle (Admin)
PUT    /api/dictionary/:id        # Terimi güncelle (Admin)
DELETE /api/dictionary/:id        # Terimi sil (Admin)
```

---

## The Openwall : Kimlik

<div align="center">

![LOGO BW](https://raw.githubusercontent.com/monalper/ecnn/refs/heads/main/frontend/public/OPENWALL%20NEW%20LOGO.png) ![LOGO WB](https://raw.githubusercontent.com/monalper/ecnn/refs/heads/main/frontend/public/OPENWALL%20NEW%20LOGO%20%E2%80%93%201.png)

![LOGO HERO](https://raw.githubusercontent.com/monalper/ecnn/refs/heads/main/frontend/public/Openwall%20New%20Logo%20Hero.png)

</div>

---

## Deployment

### Vercel Deployment

1. **Vercel CLI ile deploy**
```bash
npm i -g vercel
vercel login
vercel --prod
```

2. **GitHub ile otomatik deploy**
- Repository'yi Vercel'e bağlayın
- Otomatik deployment aktif olacak

### Environment Variables (Production)
Vercel dashboard'da aşağıdaki environment variable'ları ekleyin:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`
- `JWT_SECRET`
- `S3_BUCKET_NAME`

---

## Katkıda Bulun

Katkılarınızı bekliyoruz! Lütfen aşağıdaki adımları takip edin:

1. **Fork** yapın
2. **Feature branch** oluşturun (`git checkout -b feature/amazing-feature`)
3. **Commit** yapın (`git commit -m 'Add amazing feature'`)
4. **Push** yapın (`git push origin feature/amazing-feature`)
5. **Pull Request** oluşturun

### Katkı Kuralları
- Kod standartlarına uyun
- Test yazın
- Dokümantasyonu güncelleyin
- Açıklayıcı commit mesajları yazın

---

## Roadmap

### Gelecek Özellikler
- [ ] **Çoklu Dil Desteği**: İngilizce ve diğer diller
- [ ] **Mobil Uygulama**: React Native ile
- [ ] **AI Entegrasyonu**: İçerik önerileri
- [ ] **Yorum Sistemi**: Kullanıcı etkileşimi
- [ ] **Analytics Dashboard**: Detaylı istatistikler
- [ ] **Bildirim Sistemi**: Email ve push bildirimleri
- [ ] **E-kitap Desteği**: PDF ve EPUB formatları
- [ ] **Podcast Entegrasyonu**: Ses içerikleri

---

## Bilinen Sorunlar

- [ ] Video yükleme sırasında büyük dosyalar için timeout
- [ ] Mobil cihazlarda editor performansı
- [ ] Safari'de bazı CSS animasyonları

---

## 📬 İletişim

<p align="center">
  <table>
    <tr>
      <td align="center" width="100">
        <a href="https://openwall.com.tr" target="_blank">
          <img src="https://raw.githubusercontent.com/monalper/ecnn/refs/heads/main/frontend/public/icon.png" width="40" alt="Website" />
        </a>
        <br/><sub><b>Website</b></sub>
      </td>
      <td align="center" width="100">
        <a href="mailto:info@monologed.com" target="_blank">
          <img src="https://raw.githubusercontent.com/LelouchFR/skill-icons/main/assets/gmail-dark.svg" width="40" alt="Email" />
        </a>
        <br/><sub><b>Email</b></sub>
      </td>
      <td align="center" width="100">
        <a href="https://github.com/monalper" target="_blank">
          <img src="https://raw.githubusercontent.com/LelouchFR/skill-icons/main/assets/github-dark.svg" width="40" alt="GitHub" />
        </a>
        <br/><sub><b>GitHub</b></sub>
      </td>
      <td align="center" width="100">
        <a href="https://twitter.com/WrittenbyAlper" target="_blank">
          <img src="https://raw.githubusercontent.com/LelouchFR/skill-icons/main/assets/x-dark.svg" width="40" alt="Twitter/X" />
        </a>
        <br/><sub><b>Twitter/X</b></sub>
      </td>
      <td align="center" width="100">
        <a href="https://reddit.com" target="_blank">
          <img src="https://raw.githubusercontent.com/LelouchFR/skill-icons/main/assets/reddit.svg" width="40" alt="Reddit" />
        </a>
        <br/><sub><b>Reddit</b></sub>
      </td>
      <td align="center" width="100">
        <a href="https://discord.com" target="_blank">
          <img src="https://raw.githubusercontent.com/LelouchFR/skill-icons/main/assets/discord.svg" width="40" alt="Discord" />
        </a>
        <br/><sub><b>Discord</b></sub>
      </td>
      <td align="center" width="100">
        <a href="https://behance.net" target="_blank">
          <img src="https://raw.githubusercontent.com/LelouchFR/skill-icons/main/assets/behance.svg" width="40" alt="Behance" />
        </a>
        <br/><sub><b>Behance</b></sub>
      </td>
    </tr>
  </table>
</p>





---

## ⚖️ Lisans & Teşekkürler

Bu proje **MIT Lisansı** altında lisanslanmıştır.  
Özgürce kullanabilirsiniz.

---

### Destek Olun

Bu projeyi beğendiyseniz bir **⭐ Yıldızlayabilirsiniz.**

by <a href="https://github.com/monalper"><b>WrittenbyAlper</b></a>

---

### GitHub Bilgileri

[![GitHub stars](https://img.shields.io/github/stars/monalper/ecnn?style=flat&logo=github)](https://github.com/monalper/ecnn/stargazers)  
[![GitHub forks](https://img.shields.io/github/forks/monalper/ecnn?style=flat&logo=github)](https://github.com/monalper/ecnn/fork)  
[![GitHub issues](https://img.shields.io/github/issues/monalper/ecnn?style=flat&logo=github)](https://github.com/monalper/ecnn/issues)


