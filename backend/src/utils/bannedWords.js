// backend/src/utils/bannedWords.js

// Yasaklı kelimeler listesi ve varyasyonları
const bannedWords = [
  // Kürt kelimesi ve varyasyonları
  'kürt', 'kurt', 'krt', 'k*rt', 'kürd', 'kurd',
  'kürtçe', 'kurtce', 'kürtçe', 'kurdce',
  'kürtler', 'kurtler', 'kürdler', 'kurdler',
  'kürtlük', 'kurtluk', 'kürdlük', 'kurdluk',
  
  // Kürdistan kelimesi ve varyasyonları
  'kürdistan', 'kurdistan', 'kurdıstan', 'kurdistan',
  'kürdıstan', 'kurdıstan', 'kurdistan',
  'kürdistanlı', 'kurdistanli', 'kürdistanlı',
  'kürdistanlık', 'kurdistanlik', 'kürdistanlık',
  
  // Biji kelimesi ve varyasyonları
  'biji', 'bıjı', 'bıji', 'biji',
  'biji kurdistan', 'bıjı kurdistan', 'biji kurdistan',
  'biji kürdistan', 'bıjı kürdistan', 'biji kürdistan',
  
  // Apo kelimesi ve varyasyonları
  'apo', 'apö', 'apoo', 'apooo',
  'apo apo', 'apö apö', 'apo apö',
  'apoist', 'apöist', 'apoist',
  'apoistler', 'apöistler', 'apoistler'
];

// Kelime normalleştirme fonksiyonu
const normalizeWord = (word) => {
  return word
    .toLowerCase()
    .replace(/[çc]/g, 'c')
    .replace(/[ğg]/g, 'g')
    .replace(/[ıi]/g, 'i')
    .replace(/[öo]/g, 'o')
    .replace(/[şs]/g, 's')
    .replace(/[üu]/g, 'u')
    .replace(/[^a-z0-9]/g, '') // Özel karakterleri kaldır
    .trim();
};

// Yasaklı kelime kontrolü
const containsBannedWords = (text) => {
  if (!text || typeof text !== 'string') {
    return { hasBannedWords: false, bannedWords: [] };
  }

  const normalizedText = normalizeWord(text);
  const foundBannedWords = [];

  // Her yasaklı kelimeyi kontrol et
  for (const bannedWord of bannedWords) {
    const normalizedBannedWord = normalizeWord(bannedWord);
    
    // Tam kelime eşleşmesi kontrolü
    const wordRegex = new RegExp(`\\b${normalizedBannedWord}\\b`, 'i');
    if (wordRegex.test(normalizedText)) {
      foundBannedWords.push(bannedWord);
    }
    
    // Alt string kontrolü (daha kapsamlı)
    if (normalizedText.includes(normalizedBannedWord)) {
      if (!foundBannedWords.includes(bannedWord)) {
        foundBannedWords.push(bannedWord);
      }
    }
  }

  return {
    hasBannedWords: foundBannedWords.length > 0,
    bannedWords: foundBannedWords
  };
};

// Yorum içeriğini kontrol et (yazar adı, e-posta ve içerik)
const checkCommentForBannedWords = (authorName, authorEmail, content) => {
  const checks = [
    { field: 'authorName', value: authorName },
    { field: 'authorEmail', value: authorEmail },
    { field: 'content', value: content }
  ];

  const allBannedWords = [];
  let hasAnyBannedWords = false;

  for (const check of checks) {
    const result = containsBannedWords(check.value);
    if (result.hasBannedWords) {
      hasAnyBannedWords = true;
      allBannedWords.push(...result.bannedWords);
    }
  }

  return {
    hasBannedWords: hasAnyBannedWords,
    bannedWords: [...new Set(allBannedWords)] // Duplicate'ları kaldır
  };
};

module.exports = {
  bannedWords,
  containsBannedWords,
  checkCommentForBannedWords,
  normalizeWord
};
