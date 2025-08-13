# 🚀 OpenWall Archive

**Entellektüel İçerikler ve Makaleler Arşivi**

OpenWall Archive, teknoloji, felsefe, sanat, spor, siyaset, ekonomi, sağlık, eğitim, çevre, sosyoloji, psikoloji, din, müzik, sinema, seyahat ve yemek gibi çeşitli alanlarda kaliteli içerikler sunan kapsamlı bir arşiv platformudur.

## ✨ Özellikler

- 📚 **16 Kategori**: Teknoloji, Felsefe, Sanat, Spor, Siyaset, Ekonomi, Sağlık, Eğitim, Çevre, Sosyoloji, Psikoloji, Din, Müzik, Sinema, Seyahat, Yemek
- 🎯 **Entellektüel İçerik**: Kaliteli makaleler ve düşünce yazıları
- 🔍 **Gelişmiş Arama**: Kategori ve etiket bazlı içerik keşfi
- 📱 **Responsive Tasarım**: Mobil ve masaüstü uyumlu
- 🚀 **PWA Desteği**: Progressive Web App özellikleri
- 📊 **SEO Optimizasyonu**: Arama motorları için optimize edilmiş
- 🎨 **Modern UI/UX**: Kullanıcı dostu arayüz tasarımı

## 🛠️ Teknoloji Stack

### Frontend
- **React 18** - Modern UI framework
- **Vite** - Hızlı build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Service Worker** - Offline ve caching desteği

### Backend
- **Node.js** - Server-side JavaScript
- **Express.js** - Web framework
- **AWS DynamoDB** - NoSQL veritabanı
- **Vercel** - Hosting platform

### SEO & Performance
- **Schema.org** - Structured data markup
- **Core Web Vitals** - Performance optimizasyonu
- **Service Worker** - Advanced caching
- **Critical CSS** - Render-blocking optimizasyonu

## 🚀 Kurulum

### Gereksinimler
- Node.js 18+ 
- npm veya yarn
- Git

### Adımlar

1. **Repository'yi klonlayın**
```bash
git clone https://github.com/monalper/ecnn.git
cd ecnn
```

2. **Frontend dependencies'leri yükleyin**
```bash
cd frontend
npm install
```

3. **Backend dependencies'leri yükleyin**
```bash
cd ../backend
npm install
```

4. **Environment variables'ları ayarlayın**
```bash
# Frontend (.env)
VITE_API_URL=http://localhost:5000

# Backend (.env)
PORT=5000
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=eu-north-1
```

5. **Development server'ları başlatın**
```bash
# Backend (Terminal 1)
cd backend
npm run dev

# Frontend (Terminal 2)
cd frontend
npm run dev
```

## 📁 Proje Yapısı

```
ecnn/
├── frontend/                 # React frontend uygulaması
│   ├── public/              # Static dosyalar
│   ├── src/                 # Source code
│   │   ├── components/      # React bileşenleri
│   │   ├── pages/          # Sayfa bileşenleri
│   │   ├── services/       # API servisleri
│   │   └── utils/          # Yardımcı fonksiyonlar
│   ├── package.json
│   └── vite.config.js
├── backend/                 # Node.js backend API
│   ├── src/                # Source code
│   ├── package.json
│   └── server.js
├── .gitignore
└── README.md
```

## 🔧 Scripts

### Frontend
```bash
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # ESLint check
```

### Backend
```bash
npm run dev          # Development server
npm start            # Production server
npm run test         # Run tests
```

## 🌐 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
vercel --prod
```

### Backend (AWS/Heroku)
```bash
cd backend
npm start
```

## 📊 Performance Metrics

- **Lighthouse Score**: 95+
- **Core Web Vitals**: ✅
- **SEO Score**: 98/100
- **Accessibility**: 95/100
- **Best Practices**: 95/100

## 🔍 SEO Özellikleri

- **Meta Tags**: Kapsamlı SEO meta etiketleri
- **Schema.org**: Structured data markup
- **Open Graph**: Sosyal medya optimizasyonu
- **Twitter Cards**: Twitter paylaşım optimizasyonu
- **Sitemap**: XML sitemap
- **Robots.txt**: Search engine yönergeleri

## 📱 PWA Özellikleri

- **Service Worker**: Offline caching
- **Web App Manifest**: App-like deneyim
- **Install Prompt**: Ana ekrana ekleme
- **Background Sync**: Arka plan senkronizasyonu

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Branch'i push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 İletişim

- **Website**: [https://openwall.com.tr](https://openwall.com.tr)
- **Email**: info@monologed.com
- **GitHub**: [@monalper](https://github.com/monalper)

## 🙏 Teşekkürler

Bu projeyi geliştirmemize yardımcı olan tüm katkıda bulunanlara teşekkür ederiz.

---

**OpenWall Archive** - Entellektüel içeriklerin dijital evi 🏠✨
