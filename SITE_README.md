# Statik Site (Hızlı Başlangıç)

Bu klasörde basit bir statik web sitesi örneği vardır: `index.html`, `styles.css`, `script.js`.

## Yerelde Çalıştırma

- Tarayıcıdan direkt açabilirsiniz: `file:///workspace/index.html`
- Veya basit bir HTTP sunucusu başlatın (önerilir):

```bash
cd /workspace && python3 -m http.server 8080
```

Tarayıcıda şu adrese gidin: `http://localhost:8080/`

## Özelleştirme
- Başlık ve metinler: `index.html`
- Renkler ve düzen: `styles.css` içindeki `:root` değişkenleri
- Küçük etkileşimler: `script.js`

## Dağıtım
Herhangi bir statik barındırmaya uygundur (GitHub Pages, Netlify, Vercel). Kökte `index.html` yeterlidir.