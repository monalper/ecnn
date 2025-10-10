// routes/share.routes.js
const express = require('express');
const router = express.Router();

const SITE = 'https://www.openwall.com.tr';
const BACKEND = process.env.PUBLIC_BACKEND_URL || process.env.VITE_BACKEND_URL || 'https://ecnn-backend.vercel.app';

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function urlOk(url) {
  try {
    const r = await fetch(url, { method: 'HEAD' });
    return r.ok;
  } catch {
    return false;
  }
}

async function pickImage(slug, article) {
  // 1) Makaleye özel ogImage (tam URL olmalı)
  if (article?.ogImage && await urlOk(article.ogImage)) return article.ogImage;

  // 2) Slug’a özel statik görsel
  const bySlug = `${SITE}/og-images/articles/${encodeURIComponent(slug)}.jpg`;
  if (await urlOk(bySlug)) return bySlug;

  // 3) Fallback
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
    const rawDesc = article.description || (article.content ? String(article.content).replace(/<[^>]+>/g, ' ').trim() : '');
    const desc = rawDesc.slice(0, 160);

    const url = `${SITE}/articles/${encodeURIComponent(slug)}`;
    const image = await pickImage(slug, article);

    const published = article.createdAt || article.publishedAt || '';
    const modified  = article.updatedAt  || '';
    const section   = (article.categories && article.categories[0]) || article.category || '';
    const author    = article.authorName || (article.author && article.author.name) || 'Openwall';
    const noindex   = article.status === 'unlisted';

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

<meta property="article:published_time" content="${esc(published)}">
<meta property="article:modified_time" content="${esc(modified)}">
<meta property="article:section" content="${esc(section)}">
<meta property="article:author" content="${esc(author)}">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@openwall">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${esc(image)}">

<meta http-equiv="refresh" content="0;url=${esc(url)}">
</head>
<body><p>Yönlendiriliyor: <a href="${esc(url)}">${esc(url)}</a></p></body></html>`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=600, stale-while-revalidate=1200');
    return res.status(200).send(html);
  } catch (err) {
    console.error('share route error:', err);
    return res.status(500).send('Internal error');
  }
});

module.exports = router;
