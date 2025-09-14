# ECNN Frontend

ECNN (E-Commerce News Network) frontend uygulaması.

## Teknolojiler

- React
- Vite
- Tailwind CSS
- React Router
- Axios

## Kurulum

1. Repository'yi klonlayın:
```bash
git clone https://github.com/yourusername/ecnn-frontend.git
cd ecnn-frontend
```

2. NASA APOD özelliği için API anahtarı alın (opsiyonel):
   - [https://api.nasa.gov/](https://api.nasa.gov/) adresine gidin
   - Formu doldurarak ücretsiz API anahtarı alın
   - `.env` dosyası oluşturun ve `VITE_NASA_API_KEY=your_api_key_here` ekleyin
   - API anahtarı olmadan da çalışır, ancak rate limit nedeniyle sınırlı kullanım olabilir

3. Bağımlılıkları yükleyin:
```bash
npm install
```

4. Environment değişkenlerini ayarlayın:
```bash
cp .env.example .env
```
`.env` dosyasını düzenleyin ve gerekli değişkenleri ayarlayın.

5. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

## Özellikler

- Responsive tasarım
- Admin paneli
- Makale yönetimi
- Kullanıcı yönetimi
- JWT tabanlı kimlik doğrulama

## Deployment

Bu proje Vercel üzerinde deploy edilmiştir. Her push işleminden sonra otomatik olarak deploy edilir.

## Lisans

MIT
