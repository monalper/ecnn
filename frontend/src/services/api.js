// frontend/src/services/api.js
import axios from 'axios';
import { apiCache, getCacheKey } from './cache.js';

// Development ve production ortamları için API URL'i
const API_BASE_URL = import.meta.env.DEV 
  ? 'http://localhost:5000/api'  // Development ortamı
  : 'https://ecnn-backend.vercel.app/api';  // Production ortamı

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 saniye timeout
});

// API istekleri gönderilmeden önce token ekleme
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Yanıtları yakalamak için interceptor
api.interceptors.response.use(
  response => {
    // GET isteklerini cache'e kaydet
    if (response.config.method === 'get' && response.status === 200) {
      const cacheKey = getCacheKey(response.config.url, response.config.params);
      apiCache.set(cacheKey, response.data);
    }
    return response;
  },
  error => {
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized access - 401. Logging out.");
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Cache'li GET isteği fonksiyonu
export const getCached = async (url, params = {}, ttl = 5 * 60 * 1000) => {
  const cacheKey = getCacheKey(url, params);
  const cachedData = apiCache.get(cacheKey);
  
  if (cachedData) {
    return { data: cachedData };
  }
  
  const response = await api.get(url, { params });
  apiCache.set(cacheKey, response.data, ttl);
  return response;
};

// Cache temizleme fonksiyonları
export const clearCache = () => apiCache.clear();
export const clearCachePattern = (pattern) => apiCache.clearPattern(pattern);

// Kaydedilen Makaleler API
export const savedArticlesAPI = {
  // Kullanıcının kaydedilen makalelerini getir
  getSavedArticles: async () => {
    const response = await api.get('/users/saved-articles');
    return response.data;
  },

  // Makaleyi kaydet/kaldır
  toggleSavedArticle: async (slug, action) => {
    const response = await api.post(`/users/saved-articles/${slug}`, { action });
    // Cache'i temizle
    apiCache.clearPattern('/users/saved-articles');
    return response.data;
  },

  // Makalenin kaydedilip kaydedilmediğini kontrol et
  checkArticleSaved: async (slug) => {
    const response = await api.get(`/users/saved-articles/${slug}/check`);
    return response.data;
  }
};

export default api;
