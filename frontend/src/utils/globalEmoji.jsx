// Global emoji dönüştürme utility fonksiyonları
import twemoji from 'twemoji';

// Emojileri Twitter emojilerine çevir
export const convertToTwemoji = (text) => {
  if (!text || typeof text !== 'string') {
    return text;
  }
  
  try {
    return twemoji.parse(text, {
      folder: 'svg',
      ext: '.svg',
      className: 'twemoji twemoji-global'
    });
  } catch (error) {
    console.warn('Global emoji conversion failed:', error);
    return text;
  }
};

// HTML içeriğindeki emojileri dönüştür
export const convertHtmlEmojis = (htmlContent) => {
  if (!htmlContent || typeof htmlContent !== 'string') {
    return htmlContent;
  }
  
  try {
    return twemoji.parse(htmlContent, {
      folder: 'svg',
      ext: '.svg',
      className: 'twemoji twemoji-global'
    });
  } catch (error) {
    console.warn('HTML emoji conversion failed:', error);
    return htmlContent;
  }
};

// React component için emoji dönüştürme
export const EmojiText = ({ children, className = '' }) => {
  if (!children) return null;
  
  const text = typeof children === 'string' ? children : children.toString();
  
  return (
    <span 
      className={className}
      dangerouslySetInnerHTML={{ 
        __html: convertToTwemoji(text)
      }}
    />
  );
};

// DOM'da emojileri otomatik dönüştür
export const initGlobalEmoji = () => {
  if (typeof window === 'undefined') return;
  
  // Mevcut emojileri dönüştür
  const convertExistingEmojis = () => {
    const elements = document.querySelectorAll('.emoji-text, .comment-text, .article-content, .dictionary-content, .apod-content');
    
    elements.forEach(element => {
      if (element.dataset.emojiConverted) return;
      
      const originalText = element.textContent;
      if (originalText && originalText !== element.innerHTML) {
        element.innerHTML = convertToTwemoji(originalText);
        element.dataset.emojiConverted = 'true';
      }
    });
  };
  
  // Sayfa yüklendiğinde çalıştır
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', convertExistingEmojis);
  } else {
    convertExistingEmojis();
  }
  
  // MutationObserver ile yeni eklenen içerikleri takip et
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const elements = node.querySelectorAll ? 
              node.querySelectorAll('.emoji-text, .comment-text, .article-content, .dictionary-content, .apod-content') : 
              [];
            
            elements.forEach(element => {
              if (!element.dataset.emojiConverted) {
                const originalText = element.textContent;
                if (originalText && originalText !== element.innerHTML) {
                  element.innerHTML = convertToTwemoji(originalText);
                  element.dataset.emojiConverted = 'true';
                }
              }
            });
          }
        });
      }
    });
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  return () => observer.disconnect();
};
