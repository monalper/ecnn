// routes/share.routes.js
const express = require('express');
const router = express.Router();

const SITE = 'https://www.openwall.com.tr';
// Backend API kökü — değişkenlerden ya da default:
const BACKEND =
  process.env.PUBLIC_BACKEND_URL ||
  process.env.VITE_BACKEND_URL ||
  'https://ecnn-backend.vercel.app';

/** HTML içi güvenli metin */
function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Relatif URL'yi absolute'a çevirir */
function toAbsolute(url) {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url; // zaten absolute
  return `${SITE.replace(/\/$/, '')}/${String(url).replace(/^\//, '')}`;
}

/** URL bir resim mi? (HEAD + Content-Type=image/*) */
async function isImageUrl(url) {
  try {
    const r = await fetch(url, { method: 'HEAD' });
    if (!r.ok) return false;
    const ct = (r.headers.get('content-type') || '').toLowerCase();
    return ct.startsWith('image/');
  } catch {
    return false;
  }
}

/** OG görsel seçim stratejisi */
async function pickImage(slug, article) {
  const candidates = [];

  // 1) Kartta görülen görsel (kapak) — öncelik
  if (article?.coverImage) candidates.push(toAbsolute(article.coverImage));

  // 2) Makaleye özel ogImage alanı (varsa)
  if (article?.ogImage) candidates.push(toAbsolute(article.ogImage));

  // 3) Slug'a özel statik dosyalar (yayında olan varsa)
  const base = `${SITE}/og-images/articles/${encodeURIComponent(slug)}`;
  candidates.push(`${base}.jpg`, `${base}.webp`, `${base}.png`);

  // Adayların ilk gerçekten resim olanını kullan
  for (const u of candidates) {
    if (await isImageUrl(u)) return u;
  }

  // 4) Fallback
  return `${SITE}/og-images/default/og-default.jpg`;
}

router.get('/share/:slug', async (req, res) => {
  try {
    const slug = req.params.slug;
    if (!slug) return res.status(400).send('Missing slug');

    const apiUrl = `${BACKEND}/api/articles/${encodeURIComponent(slug)}`;
    const r = await fetch(apiUrl);
    if (!r.ok) return res.status(404).send('Not found');

    const article = await r.json();

    const title = article.title || 'The Openwall';
    const rawDesc =
      article.description ||
      (article.content ? String(article.content).replace(/<[^>]+>/g, ' ').trim() : '');
    const desc = rawDesc.slice(0, 160);

    const url = `${SITE}/articles/${encodeURIComponent(slug)}`;
    const image = await pickImage(slug, article);

    const published = article.createdAt || article.publishedAt || '';
    const modified = article.updatedAt || '';
    const section =
      (Array.isArray(article.categories) && article.categories[0]) ||
      article.category ||
      '';
    const author =
      article.authorName ||
      (article.author && (article.author.username || article.author.name)) ||
      'Openwall';
    const noindex = article.status === 'unlisted';

    const html = `<!doctype html><html lang="tr"><head>
<meta charset="utf-8">
<title>${esc(title)} | The Openwall</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${esc(url)}">
${noindex ? '<meta name="robots" content="noindex,nofollow">' : '<meta name="robots" content="index,follow">'}

<meta property="og:type" content="article">
<meta property="og:url" content="${esc(url)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${esc(image)}">
<meta property="og:image:secure_url" content="${esc(image)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(title)}">
<meta property="og:site_name" content="The Openwall">
<meta property="og:locale" content="tr_TR">

${published ? `<meta property="article:published_time" content="${esc(published)}">` : ''}
${modified ? `<meta property="article:modified_time" content="${esc(modified)}">` : ''}
${section ? `<meta property="article:section" content="${esc(section)}">` : ''}
${author ? `<meta property="article:author" content="${esc(author)}">` : ''}

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@openwall">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${esc(image)}">

<meta http-equiv="refresh" content="0;url=${esc(url)}">
</head>
<body><p>Yönlendiriliyor: <a href="${esc(url)}">${esc(url)}</a></p></body></html>`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    // 5 dk browser, 10 dk edge cache, SWR ile 20 dk
    res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=600, stale-while-revalidate=1200');
    return res.status(200).send(html);
  } catch (err) {
    console.error('share route error:', err);
    return res.status(500).send('Internal error');
  }
});

module.exports = router;
