# CORS Hatası Çözümü - Kapak Fotoğrafı Yükleme

## Sorun
`openwall.com.tr` üzerinden makale kapak fotoğrafı eklerken CORS (Cross-Origin Resource Sharing) hatası alıyordunuz. Bu hata, tarayıcının güvenlik politikası nedeniyle AWS S3'e doğrudan frontend'den dosya yüklemeye izin vermemesinden kaynaklanıyordu.

## Çözüm
CORS sorununu çözmek için dosya yükleme işlemini backend üzerinden yapacak şekilde değiştirdik. Artık dosyalar doğrudan backend'e gönderiliyor ve backend bunları S3'e yüklüyor.

## Yapılan Değişiklikler

### Backend Değişiklikleri

1. **Multer Paketi Eklendi**
   ```bash
   cd backend
   npm install multer
   ```

2. **Yeni Upload Controller Fonksiyonu**
   - `backend/src/controllers/upload.controller.js` dosyasına `uploadCoverImage` fonksiyonu eklendi
   - Bu fonksiyon dosyayı doğrudan backend'e alıp S3'e yüklüyor

3. **Yeni Route Eklendi**
   - `backend/src/routes/upload.routes.js` dosyasına `/cover-direct` endpoint'i eklendi
   - Bu endpoint FormData ile gelen dosyaları işliyor

4. **S3 CORS Ayarları**
   - `backend/src/config/s3-cors-setup.js` dosyası oluşturuldu
   - S3 bucket'ının CORS ayarlarını otomatik olarak yapılandırıyor

### Frontend Değişiklikleri

1. **ArticleForm Bileşeni Güncellendi**
   - `frontend/src/components/article/ArticleForm.jsx` dosyasındaki `handleUploadCoverImage` fonksiyonu değiştirildi
   - Artık presigned URL yerine doğrudan backend'e FormData ile dosya gönderiyor

## Kullanım

### Backend'i Başlatma
```bash
cd backend
npm run dev
```

### Frontend'i Başlatma
```bash
cd frontend
npm run dev
```

### S3 CORS Ayarlarını Yapılandırma (İsteğe Bağlı)
Eğer hala CORS sorunu yaşıyorsanız, admin panelinden veya API ile S3 CORS ayarlarını güncelleyebilirsiniz:

```bash
# API endpoint'i ile (admin token gerekli)
POST /api/upload/setup-cors
```

## Test Etme

1. Frontend'i açın (`http://localhost:5173`)
2. Admin olarak giriş yapın
3. Yeni makale oluşturun veya mevcut makaleyi düzenleyin
4. Kapak fotoğrafı seçin
5. Kaydet butonuna tıklayın

Artık CORS hatası almadan kapak fotoğrafı yükleyebilmelisiniz.

## Teknik Detaylar

### Eski Yöntem (Presigned URL)
```
Frontend → AWS S3 (CORS Hatası)
```

### Yeni Yöntem (Backend Upload)
```
Frontend → Backend → AWS S3 (Başarılı)
```

Bu yaklaşım daha güvenli ve CORS sorunlarını ortadan kaldırıyor.

## Sorun Giderme

Eğer hala sorun yaşıyorsanız:

1. Backend'in çalıştığından emin olun
2. AWS credentials'ların doğru olduğunu kontrol edin
3. S3 bucket'ının mevcut olduğunu kontrol edin
4. Browser console'da hata mesajlarını kontrol edin

## Güvenlik Notları

- Sadece admin kullanıcılar kapak fotoğrafı yükleyebilir
- Dosya boyutu 5MB ile sınırlandırılmıştır
- Sadece resim dosyaları kabul edilir
- Dosyalar public-read ACL ile yüklenir (S3'te görünür olur) 