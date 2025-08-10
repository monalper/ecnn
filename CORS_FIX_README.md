# CORS Hatası Çözümü - Kapak Fotoğrafı Yükleme

## Sorun
`openwall.com.tr` üzerinden makale kapak fotoğrafı eklerken CORS (Cross-Origin Resource Sharing) hatası alıyordunuz. Bu hata, tarayıcının güvenlik politikası nedeniyle AWS S3'e doğrudan frontend'den dosya yüklemeye izin vermemesinden kaynaklanıyordu.

**Ek Sorun:** "The bucket does not allow ACLs" hatası - S3 bucket'ınız ACL'leri desteklemiyor.

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
   - ACL parametresi kaldırıldı (bucket ACL'leri desteklemiyor)

3. **Yeni Route Eklendi**
   - `backend/src/routes/upload.routes.js` dosyasına `/cover-direct` endpoint'i eklendi
   - Bu endpoint FormData ile gelen dosyaları işliyor

4. **S3 CORS Ayarları**
   - `backend/src/config/s3-cors-setup.js` dosyası oluşturuldu
   - S3 bucket'ının CORS ayarlarını otomatik olarak yapılandırıyor

5. **S3 Bucket Policy Ayarları**
   - `backend/src/config/s3-bucket-policy.js` dosyası oluşturuldu
   - ACL yerine bucket policy ile public erişim sağlıyor

6. **Bucket Kontrol Script'i**
   - `backend/src/config/s3-bucket-check.js` dosyası oluşturuldu
   - S3 bucket yapılandırmasını kontrol ediyor

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

### S3 Ayarlarını Yapılandırma (Gerekli)

1. **Bucket Policy Ayarlama**
   ```bash
   # API endpoint'i ile (admin token gerekli)
   POST /api/upload/setup-policy
   ```

2. **CORS Ayarlarını Yapılandırma**
   ```bash
   # API endpoint'i ile (admin token gerekli)
   POST /api/upload/setup-cors
   ```

3. **Bucket Yapılandırmasını Kontrol Etme**
   ```bash
   # API endpoint'i ile (admin token gerekli)
   GET /api/upload/check-bucket
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

### ACL Hatası Çözümü
Eğer "The bucket does not allow ACLs" hatası alıyorsanız:

1. **Bucket Policy Ayarlayın:**
   ```bash
   POST /api/upload/setup-policy
   ```

2. **AWS Console'da Manuel Ayarlama:**
   - AWS S3 Console'a gidin
   - Bucket'ınızı seçin
   - "Permissions" sekmesine gidin
   - "Bucket policy" bölümünde aşağıdaki policy'yi ekleyin:

   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicReadGetObject",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::BUCKET_NAME/*"
       }
     ]
   }
   ```

### Genel Sorun Giderme

Eğer hala sorun yaşıyorsanız:

1. Backend'in çalıştığından emin olun
2. AWS credentials'ların doğru olduğunu kontrol edin
3. S3 bucket'ının mevcut olduğunu kontrol edin
4. Browser console'da hata mesajlarını kontrol edin
5. Bucket yapılandırmasını kontrol edin: `GET /api/upload/check-bucket`

## Güvenlik Notları

- Sadece admin kullanıcılar kapak fotoğrafı yükleyebilir
- Dosya boyutu 5MB ile sınırlandırılmıştır
- Sadece resim dosyaları kabul edilir
- Dosyalar bucket policy ile public erişilebilir (ACL yerine)
- AWS IAM kullanıcınızın gerekli izinlere sahip olduğundan emin olun:
  - `s3:PutObject`
  - `s3:PutBucketPolicy`
  - `s3:PutBucketCors` 