// frontend/src/services/translation.js
import { apiCache, getCacheKey } from './cache.js';

// Google Translate API veya başka bir çeviri servisi kullanabiliriz
// Şimdilik basit bir çeviri servisi oluşturalım

const TRANSLATION_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 saat cache

// Basit çeviri fonksiyonu - gerçek uygulamada Google Translate API veya başka bir servis kullanılmalı
const translateText = async (text, targetLanguage = 'tr') => {
  try {
    // Cache kontrolü
    const cacheKey = getCacheKey('translation', { text, targetLanguage });
    const cachedTranslation = apiCache.get(cacheKey);
    
    if (cachedTranslation) {
      return cachedTranslation;
    }

    // Google Translate API kullanımı için (ücretsiz sürüm)
    // Not: Gerçek uygulamada API key gerekli
    const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLanguage}&dt=t&q=${encodeURIComponent(text)}`);
    
    if (!response.ok) {
      throw new Error('Translation service unavailable');
    }
    
    const data = await response.json();
    
    if (data && data[0] && data[0][0] && data[0][0][0]) {
      const translatedText = data[0].map(item => item[0]).join('');
      
      // Cache'e kaydet
      apiCache.set(cacheKey, translatedText, TRANSLATION_CACHE_TTL);
      
      return translatedText;
    }
    
    throw new Error('Invalid translation response');
  } catch (error) {
    console.error('Translation error:', error);
    // Hata durumunda orijinal metni döndür
    return text;
  }
};

// APOD açıklaması için özel çeviri fonksiyonu
export const translateApodExplanation = async (explanation) => {
  if (!explanation) return '';
  
  try {
    // Uzun metinleri parçalara böl (Google Translate API limiti)
    const maxLength = 4000; // Güvenli limit
    const chunks = [];
    
    if (explanation.length <= maxLength) {
      return await translateText(explanation);
    }
    
    // Uzun metni parçalara böl
    let currentChunk = '';
    const sentences = explanation.split('. ');
    
    for (const sentence of sentences) {
      if ((currentChunk + sentence + '. ').length > maxLength && currentChunk) {
        chunks.push(currentChunk.trim());
        currentChunk = sentence + '. ';
      } else {
        currentChunk += sentence + '. ';
      }
    }
    
    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim());
    }
    
    // Her parçayı çevir
    const translatedChunks = await Promise.all(
      chunks.map(chunk => translateText(chunk))
    );
    
    return translatedChunks.join(' ');
  } catch (error) {
    console.error('APOD translation error:', error);
    return explanation; // Hata durumunda orijinal metni döndür
  }
};

export default {
  translateText,
  translateApodExplanation
};
