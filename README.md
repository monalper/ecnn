# OpenWall - Çok Kategorili İçerik Platformu

Bu proje, teknoloji, felsefe, sanat, spor, siyaset, ekonomi, sağlık, eğitim, çevre, sosyoloji, psikoloji, din, müzik, sinema, seyahat ve yemek gibi çeşitli alanlarda kaliteli içerikler sunan kapsamlı bir platformdur.

## Özellikler

- **16 Farklı Kategori**: Teknoloji, felsefe, sanat, spor, siyaset, ekonomi, sağlık, eğitim, çevre, sosyoloji, psikoloji, din, müzik, sinema, seyahat ve yemek
- **SEO Optimizasyonu**: Arama motorları için optimize edilmiş meta etiketler, schema markup ve sitemap
- **Responsive Tasarım**: Mobil ve masaüstü cihazlarda mükemmel görünüm
- **Admin Paneli**: İçerik yönetimi için gelişmiş admin arayüzü
- **Kullanıcı Yönetimi**: JWT tabanlı kimlik doğrulama sistemi
- **İçerik Editörü**: TipTap tabanlı zengin metin editörü

## Teknolojiler

### Frontend
- React 18
- Vite
- TailwindCSS
- Axios
- React Router
- TipTap Editor
- React Helmet (SEO)

### Backend
- Node.js
- Express.js
- AWS DynamoDB
- AWS S3
- JWT Authentication

## Kurulum

### Backend
```bash
cd backend
npm install
# .env dosyasını oluşturun ve gerekli environment variable'ları ekleyin
npm run dev
```

### Frontend
```bash
cd frontend
npm install
# .env dosyasını oluşturun ve gerekli environment variable'ları ekleyin
npm run dev
```

## Environment Variables

### Backend (.env)
```
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_REGION=eu-north-1
DYNAMODB_USERS_TABLE=OpenWallUsers
DYNAMODB_ARTICLES_TABLE=OpenWallArticles
S3_BUCKET_NAME=your_bucket_name
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:5000/api
```

## Kategoriler

Platform aşağıdaki 16 kategoride içerik sunar:

1. **Teknoloji** - Teknoloji dünyasındaki en son gelişmeler
2. **Felsefe** - Felsefi düşünceler ve teoriler
3. **Sanat** - Görsel sanatlar ve yaratıcılık
4. **Spor** - Spor dünyasından haberler ve analizler
5. **Siyaset** - Güncel siyasi gelişmeler
6. **Ekonomi** - Ekonomik trendler ve piyasa analizleri
7. **Sağlık** - Sağlık ve tıp alanındaki gelişmeler
8. **Eğitim** - Eğitim sistemi ve öğrenme yöntemleri
9. **Çevre** - Çevre koruma ve sürdürülebilirlik
10. **Sosyoloji** - Toplumsal olaylar ve sosyal değişimler
11. **Psikoloji** - Psikolojik araştırmalar ve davranış analizleri
12. **Din** - Dini konular ve manevi yaşam
13. **Müzik** - Müzik dünyasından haberler ve sanatçı profilleri
14. **Sinema** - Film dünyasından haberler ve eleştiriler
15. **Seyahat** - Seyahat rehberleri ve destinasyon önerileri
16. **Yemek** - Yemek kültürü ve gastronomi

## SEO Özellikleri

- Meta etiketleri optimizasyonu
- Schema.org markup desteği
- Otomatik sitemap.xml oluşturma
- robots.txt dosyası
- Open Graph ve Twitter Card desteği
- Canonical URL'ler
- Breadcrumb navigasyonu

## Deployment

Proje Vercel üzerinde deploy edilmiştir:
- Frontend: https://openwall.com.tr
- Backend: https://openwall-backend.vercel.app

## Lisans

MIT 