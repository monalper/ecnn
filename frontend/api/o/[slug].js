// api/o/[slug].js
const BACKEND = process.env.VITE_BACKEND_URL || 'https://ecnn-backend.vercel.app';
const SITE = 'https://www.openwall.com.tr';

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

async function pickImage(slug, article) {
  const candidate =
    article?.ogImage ||
    `${SITE}/og-images/articles/${encodeURIComponent(slug)}.jpg`;
  const fallback = `${SITE}/og-images/default/og-default.jpg`;

  try {
    const r = await fetch(candidate, { method: 'HEAD' });
    if (r.ok) return candidate;
  } catch (_) {}
  return fallback;
}

module.exports = async (req, res) => {
  const slug = req.query.slug;
  if (!slug) return res.status(400).send('Missing slug');

  const r = await fetch(`${BACKEND}/api/articles/${encodeURIComponent(slug)}`);
  if (!r.ok) return res.status(404).send('Not found');
  const article = await r.json();

  const title = article.title || 'The Openwall';
  const raw = article.description || (article.content ? String(article.content).replace(/<[^>]+>/g, ' ').trim() : '');
  const desc = raw.slice(0, 160);
  const url = `${SITE}/articles/${encodeURIComponent(slug)}`;
  const image = await pickImage(slug, article);

  const noindex = article.status === 'unlisted'; // varsa “liste dışı” içerikler için

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
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@openwall">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${esc(image)}">
<meta http-equiv="refresh" content="0;url=${esc(url)}">
</head><body><p>Yönlendiriliyor: <a href="${esc(url)}">${esc(url)}</a></p></body></html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300, stale-while-revalidate=600');
  return res.status(200).send(html);
};
