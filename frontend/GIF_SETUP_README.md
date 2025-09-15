# GIF Search Functionality Setup

Bu proje, makale ve video detay sayfalarında GIF arama ve yorum olarak gönderme özelliği içerir.

## Kurulum

### 1. GIPHY API Anahtarı Alın

1. [GIPHY Developer Dashboard](https://developers.giphy.com/dashboard/) adresine gidin
2. Ücretsiz hesap oluşturun
3. Yeni bir uygulama oluşturun
4. API anahtarınızı kopyalayın

### 2. Environment Variable Ekleyin

Frontend klasöründe `.env` dosyası oluşturun ve aşağıdaki satırı ekleyin:

```
VITE_GIPHY_API_KEY=your_giphy_api_key_here
```

`your_giphy_api_key_here` yerine GIPHY'dan aldığınız gerçek API anahtarını yazın.

### 3. Uygulamayı Yeniden Başlatın

Environment variable'ı ekledikten sonra development server'ı yeniden başlatın:

```bash
npm run dev
```

## Özellikler

- **GIF Arama**: Kullanıcılar GIF arayabilir
- **Trending GIF'ler**: Popüler GIF'ler otomatik olarak gösterilir
- **Markdown Desteği**: GIF'ler markdown formatında yorum olarak gönderilir
- **Responsive Tasarım**: Mobil ve desktop uyumlu
- **Dark Mode Desteği**: Karanlık tema ile uyumlu

## Kullanım

1. Makale veya video detay sayfasında yorum yap butonunun yanındaki GIF butonuna tıklayın
2. Açılan popup'ta GIF arayın veya trending GIF'leri görüntüleyin
3. İstediğiniz GIF'e tıklayın
4. GIF otomatik olarak yorum metnine eklenir
5. Yorumunuzu gönderin

## API Limitleri

GIPHY ücretsiz planı:
- Günde 1000 istek
- Saatte 100 istek
- Saniyede 10 istek

Daha yüksek limitler için ücretli planları inceleyebilirsiniz.
