const fs = require('fs');
const path = require('path');
const SHORTLINKS_PATH = path.join(__dirname, 'shortlinks.json');

function generateId(length = 4) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = '';
  for (let i = 0; i < length; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

function readShortlinks() {
  if (!fs.existsSync(SHORTLINKS_PATH)) return {};
  return JSON.parse(fs.readFileSync(SHORTLINKS_PATH, 'utf8'));
}

function writeShortlinks(data) {
  fs.writeFileSync(SHORTLINKS_PATH, JSON.stringify(data, null, 2));
}

exports.createShortlink = (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ message: 'URL gerekli.' });
  let shortlinks = readShortlinks();
  // Aynı URL için daha önce oluşturulmuşsa onu döndür
  for (const [id, longUrl] of Object.entries(shortlinks)) {
    if (longUrl === url) {
      return res.json({ shortId: id, shortUrl: `${process.env.SHORTLINK_BASE_URL || 'https://openwall.vercel.app/s/'}${id}` });
    }
  }
  let id;
  do {
    id = generateId();
  } while (shortlinks[id]);
  shortlinks[id] = url;
  writeShortlinks(shortlinks);
  res.json({ shortId: id, shortUrl: `${process.env.SHORTLINK_BASE_URL || 'https://openwall.vercel.app/s/'}${id}` });
};

exports.redirectShortlink = (req, res) => {
  const { shortId } = req.params;
  const shortlinks = readShortlinks();
  const url = shortlinks[shortId];
  if (url) {
    res.redirect(url);
  } else {
    res.status(404).send('Kısa link bulunamadı.');
  }
};
