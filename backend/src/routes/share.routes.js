const express = require("express");
const router = express.Router();

const SITE = "https://www.openwall.com.tr";
const BACKEND = process.env.PUBLIC_BACKEND_URL || "https://ecnn-backend.vercel.app";

function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

router.get("/share/:slug", async (req, res) => {
  try {
    const slug = req.params.slug;
    const r = await fetch(`${BACKEND}/api/articles/${slug}`);
    if (!r.ok) return res.status(404).send("Not found");
    const article = await r.json();

    const title = article.title || "The Openwall";
    const desc = article.description || (article.content || "").replace(/<[^>]+>/g, " ").slice(0, 150);
    const url = `${SITE}/articles/${slug}`;
    const image = article.ogImage || `${SITE}/og-images/articles/${slug}.jpg`;

    const html = `<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8">
<title>${esc(title)} | The Openwall</title>
<meta name="description" content="${esc(desc)}">
<meta property="og:type" content="article">
<meta property="og:url" content="${esc(url)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${esc(image)}">
<meta property="og:site_name" content="The Openwall">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${esc(image)}">
<meta http-equiv="refresh" content="0;url=${esc(url)}">
</head>
<body>Yönlendiriliyor: <a href="${esc(url)}">${esc(url)}</a></body>
</html>`;

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=300, s-maxage=300");
    return res.status(200).send(html);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
