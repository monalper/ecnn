# OG Images (Open Graph Images)

Bu klasör, sosyal medya paylaşımları için Open Graph görsellerini içerir.

## 📁 Klasör Yapısı

```
og-images/
├── default/           # Varsayılan OG image'lar
│   ├── og-default.jpg
│   └── og-default-dark.jpg
├── articles/          # Makale özel OG image'ları
│   ├── article-slug-1.jpg
│   └── article-slug-2.jpg
├── categories/        # Kategori OG image'ları
│   ├── technology.jpg
│   ├── science.jpg
│   └── philosophy.jpg
├── authors/           # Yazar OG image'ları
│   ├── author-name-1.jpg
│   └── author-name-2.jpg
└── templates/         # OG image şablonları
    ├── article-template.jpg
    └── category-template.jpg
```

## 🎨 Görsel Standartları

### **Boyutlar:**
- **Ana boyut:** 1200x630px (Open Graph standart)
- **Twitter:** 1200x600px (önerilen)
- **LinkedIn:** 1200x627px (önerilen)

### **Format:**
- **Ana format:** JPG (daha küçük dosya boyutu)
- **Alternatif:** PNG (şeffaflık gerektiğinde)

### **Dosya Boyutu:**
- **Maksimum:** 1MB
- **Önerilen:** 200-500KB

## 📝 Naming Convention

### **Makaleler:**
```
articles/{article-slug}.jpg
Örnek: articles/artificial-intelligence-future.jpg
```

### **Kategoriler:**
```
categories/{category-name}.jpg
Örnek: categories/technology.jpg
```

### **Yazarlar:**
```
authors/{author-name}.jpg
Örnek: authors/john-doe.jpg
```

### **Varsayılan:**
```
default/og-default.jpg
default/og-default-dark.jpg
```

## 🔧 Kullanım

### **MetaTags.jsx'te:**
```javascript
const defaultImage = 'https://openwall.com.tr/og-images/default/og-default.jpg';
```

### **ArticleDetailPage.jsx'te:**
```javascript
const ogImage = article.ogImage || 
  `https://openwall.com.tr/og-images/articles/${article.slug}.jpg` || 
  'https://openwall.com.tr/og-images/default/og-default.jpg';
```

## 🎯 SEO İpuçları

1. **Her makale için özel OG image** oluşturun
2. **Görselde makale başlığı** bulunsun
3. **Marka renklerini** kullanın
4. **Okunabilir font** seçin
5. **Yüksek kontrast** sağlayın
6. **Mobil uyumlu** tasarım yapın

## 🛠️ Otomatik OG Image Oluşturma

Gelecekte otomatik OG image oluşturma için:
- Canvas API kullanarak dinamik görseller
- Server-side rendering ile otomatik oluşturma
- Template-based sistem

## 📊 Performans

- **CDN kullanımı** önerilir
- **WebP formatı** desteği eklenebilir
- **Lazy loading** uygulanabilir 