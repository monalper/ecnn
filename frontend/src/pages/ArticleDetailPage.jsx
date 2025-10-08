// ECNN - Kopya/frontend/src/pages/ArticleDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '../components/layout/Header';
import MetaTags from '../components/seo/MetaTags';
import SchemaMarkup from '../components/seo/SchemaMarkup';
import Breadcrumb from '../components/navigation/Breadcrumb';
import LoadingSpinner from '../components/LoadingSpinner';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { LuSun, LuMoon } from 'react-icons/lu';

// Google AdSense script will be injected via Helmet below
import api, { savedArticlesAPI } from '../services/api';
import ArticleCard from '../components/article/ArticleCard';
import { CommentsSection } from '../components/comments';

function calculateReadingTime(html) {
  // HTML'den metni çıkar, kelime sayısını bul, 200 wpm ile hesapla
  const text = html.replace(/<[^>]+>/g, ' ');
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} dakika`;
}

function injectImageSources(html, imageSources = {}) {
  // DOMParser ile img altına source ekle
  if (typeof window === 'undefined') return html;
  const parser = new window.DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const imgs = doc.querySelectorAll('img');
  imgs.forEach(img => {
    // data-source attribute'u varsa veya imageSources objesinde varsa
    const src = img.getAttribute('src');
    const source = img.getAttribute('data-source') || imageSources[src];
    if (source) {
      const small = doc.createElement('div');
      small.textContent = `Image Source: ${source}`;
      small.style.fontSize = '12px';
      small.style.color = '#7b7b7b';
      small.style.textAlign = 'center';
      small.style.marginTop = '4px';
      img.insertAdjacentElement('afterend', small);
    }
  });
  return doc.body.innerHTML;
}

const ArticleDetailPage = () => {
  // Tema hook'u
  const { theme, changeTheme } = useTheme();
  // Auth hook'u
  const { user } = useAuth();
  
  // Kısa link state'i
  const [shortUrl, setShortUrl] = useState('');
  // Scroll yüzde state'i
  const [scrollPercent, setScrollPercent] = useState(0);
  // Bottom bar görünürlük state'i
  const [bottomBarVisible, setBottomBarVisible] = useState(false);
  // Kaydet state'leri
  const [isSaved, setIsSaved] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Makale içeriği için scroll yüzdesini hesapla
      const articleContent = document.querySelector('.prose');
      if (articleContent) {
        const rect = articleContent.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Makale içeriğinin başlangıç ve bitiş pozisyonları
        const contentTop = rect.top;
        const contentBottom = rect.bottom;
        
        // Bottom bar görünürlük kontrolü:
        // Sayfa en üstündeyken gizle, kaydırıldıktan sonra göster
        const scrollTop = window.scrollY;
        const shouldShowBottomBar = scrollTop > 100 && contentTop < windowHeight && contentBottom > 0;
        setBottomBarVisible(shouldShowBottomBar);
        
        // Makale içeriği viewport'ta görünmeye başladığında
        if (rect.top <= windowHeight) {
          // Makale içeriğinin ne kadarının okunduğunu hesapla
          const contentHeight = articleContent.scrollHeight;
          const contentTopOffset = articleContent.offsetTop;
          const scrollTop = window.scrollY;
          
          // Makale içeriği başlangıcından itibaren scroll pozisyonu
          const contentScrollTop = Math.max(0, scrollTop - contentTopOffset);
          const contentVisibleHeight = Math.min(contentHeight, windowHeight);
          
          // Yüzde hesapla (makale içeriği viewport'ta görünmeye başladığında %0, bittiğinde %100)
          let percent = 0;
          if (contentScrollTop > 0) {
            percent = Math.min(100, (contentScrollTop / (contentHeight - contentVisibleHeight)) * 100);
          }
          
          setScrollPercent(Math.max(0, Math.min(100, percent)));
        } else {
          // Makale içeriği henüz görünmüyorsa %0
          setScrollPercent(0);
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // İlk yüklemede de hesapla
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  // Tema algıla
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [twitterShareModalOpen, setTwitterShareModalOpen] = useState(false);
  const [customTweetText, setCustomTweetText] = useState('');
  useEffect(() => {
    const checkDark = () => setIsDarkMode(document.documentElement.classList.contains('dark'));
    checkDark();
    // Listen for theme changes via MutationObserver
    const observer = new MutationObserver(() => checkDark());
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    // Also listen for storage events (if theme is synced via localStorage)
    window.addEventListener('storage', checkDark);
    return () => {
      observer.disconnect();
      window.removeEventListener('storage', checkDark);
    };
  }, []);
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [articleRes, articlesRes] = await Promise.all([
        api.get(`/articles/${slug}`),
        api.get('/articles')
      ]);
      setArticle(articleRes.data);
      setArticles(articlesRes.data.filter(a => a.slug !== slug));
      setLoading(false);
      
      // Görüntülenme sayısını artır
      try {
        await api.post(`/articles/${slug}/view`);
      } catch (error) {
        console.error('Görüntülenme sayısı artırılamadı:', error);
      }
    };
    fetchData();
  }, [slug]);

  // Kaydetme durumunu kontrol et
  useEffect(() => {
    const checkSaved = async () => {
      if (user && slug) {
        try {
          const result = await savedArticlesAPI.checkArticleSaved(slug);
          setIsSaved(result.isSaved);
        } catch (error) {
          console.error('Error checking saved status:', error);
        }
      }
    };
    checkSaved();
  }, [user, slug]);

  // Kaydet/Kaldır toggle fonksiyonu
  const handleToggleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      window.location.href = '/login';
      return;
    }

    setIsSaveLoading(true);
    try {
      const action = isSaved ? 'unsave' : 'save';
      await savedArticlesAPI.toggleSavedArticle(slug, action);
      setIsSaved(!isSaved);
    } catch (error) {
      console.error('Error toggling save:', error);
      alert(error.response?.data?.message || 'Bir hata oluştu.');
    } finally {
      setIsSaveLoading(false);
    }
  };

  // Kısa linki al
  useEffect(() => {
    if (!article) return;
    const getShortLink = async () => {
      try {
        // Production URL'ini kullan
        const fullUrl = process.env.NODE_ENV === 'production' 
          ? `https://openwall.com.tr/articles/${article.slug}`
          : `${window.location.origin}/articles/${article.slug}`;
        
        console.log('Kısa link oluşturuluyor:', fullUrl);
        
        const res = await api.post('/shortlink', { url: fullUrl });
        console.log('Kısa link oluşturuldu:', res.data.shortUrl);
        
        setShortUrl(res.data.shortUrl);
      } catch (e) {
        console.error('Kısa link oluşturma hatası:', e);
        setShortUrl('');
      }
    };
    getShortLink();
  }, [article]);

  // Twitter/X embedleri için script yükle ve widget'ları başlat
  useEffect(() => {
    if (!article) return;
    // Script zaten yoksa ekle
    if (!window.twttr) {
      const script = document.createElement('script');
      script.src = 'https://platform.twitter.com/widgets.js';
      script.async = true;
      script.id = 'twitter-wjs';
      document.body.appendChild(script);
      script.onload = () => {
        if (window.twttr && window.twttr.widgets) {
          window.twttr.widgets.load();
        }
      };
    } else if (window.twttr && window.twttr.widgets) {
      window.twttr.widgets.load();
    }
  }, [article]);

  if (loading || !article) {
    return (
      <div className="text-center py-20">
        <LoadingSpinner size="medium" text="Makale Yükleniyor..." />
      </div>
    );
  }

  // Kapak görseli ve image source
  const coverImage = article.coverImage || `https://placehold.co/1200x675/E2E8F0/A0AEC0?text=${encodeURIComponent(article.title.substring(0,25))}`;
  const imageSource = article.imageSource || '';
  // Yazar, tarih, okuma süresi
  const author = article.authorName || article.author?.name || '';
  const date = article.createdAt ? new Date(article.createdAt).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' }) : '';
  const readingTime = calculateReadingTime(article.content || '');

  // İçerik görselleri için kaynaklar (örnek: article.contentImages = {src: source})
  const contentWithSources = injectImageSources(article.content || '', article.contentImages);

  // Open Graph ve Twitter Card için meta veriler
  const pageTitle = article?.title || 'Makale';
  const pageDescription = article?.description || (article?.content ? article.content.substring(0, 120) : 'ECNN Makale');
  
  // OG Image yolu oluşturma fonksiyonu
  const getOgImage = () => {
    // Önce makale özel OG image'ı kontrol et
    if (article?.ogImage) {
      return article.ogImage;
    }
    // Sonra slug'a göre otomatik oluşturulan OG image'ı kontrol et
    if (article?.slug) {
      return `https://openwall.com.tr/og-images/articles/${article.slug}.jpg`;
    }
    // Varsayılan OG image'ı kullan
    return 'https://openwall.com.tr/og-images/default/og-default.jpg';
  };
  
  const pageImage = getOgImage();
  const pageUrl = typeof window !== 'undefined' 
    ? (process.env.NODE_ENV === 'production' 
        ? `https://openwall.com.tr/articles/${article.slug}`
        : window.location.href)
    : '';

  // Twitter paylaşım metni oluşturma fonksiyonları
  const generateTweetTemplates = () => {
    // Kısa link varsa onu kullan, yoksa production URL'ini kullan
    const baseUrl = shortUrl || (process.env.NODE_ENV === 'production' 
      ? `https://openwall.com.tr/articles/${article.slug}`
      : window.location.href);
    const category = article.categories?.[0]?.toLowerCase() || 'teknoloji';
    
    return [
      {
        name: 'Standart',
        text: `📰 ${article.title}\n\n${article.description ? article.description.substring(0, 100) + '...\n\n' : ''}👤 ${author}\n⏱️ ${readingTime}\n\n#openwall #${category} #makale\n\n${baseUrl}`
      },
      {
        name: 'Kısa ve Öz',
        text: `📰 ${article.title}\n\n${article.description ? article.description.substring(0, 80) + '...\n\n' : ''}#openwall #${category}\n\n${baseUrl}`
      },
      {
        name: 'Soru ile',
        text: `🤔 ${article.title} hakkında ne düşünüyorsunuz?\n\n${article.description ? article.description.substring(0, 90) + '...\n\n' : ''}👤 ${author}\n\n#openwall #${category} #tartışma\n\n${baseUrl}`
      },
      {
        name: 'Öneri',
        text: `💡 Bu makaleyi mutlaka okumalısınız!\n\n📰 ${article.title}\n\n${article.description ? article.description.substring(0, 80) + '...\n\n' : ''}👤 ${author}\n\n#openwall #${category} #öneri\n\n${baseUrl}`
      }
    ];
  };

  const handleTwitterShare = (templateText) => {
    const tweetText = templateText || customTweetText;
    const encodedText = encodeURIComponent(tweetText);
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedText}`;
    window.open(twitterUrl, '_blank', 'noopener,noreferrer');
    setTwitterShareModalOpen(false);
  };

  const handleCustomTweetChange = (e) => {
    const text = e.target.value;
    setCustomTweetText(text);
  };

  return (
    <>
      <MetaTags
        title={article.title}
        description={article.description || article.content?.substring(0, 160)}
        image={pageImage}
        url={pageUrl}
        type="article"
        author={author}
        publishedTime={article.createdAt}
        modifiedTime={article.updatedAt}
        tags={article.tags || []}
        readingTime={readingTime}
        wordCount={article.content?.replace(/<[^>]+>/g, '').split(/\s+/).length}
        isHighlight={article.isHighlight}
      />
      
      <SchemaMarkup
        type="Article"
        data={{
          title: article.title,
          description: article.description || article.content?.substring(0, 160),
          image: pageImage,
          url: pageUrl,
          author: author,
          publishedTime: article.createdAt,
          modifiedTime: article.updatedAt,
          section: article.category || "General",
          keywords: article.tags?.join(', '),
          wordCount: article.content?.replace(/<[^>]+>/g, '').split(/\s+/).length,
          readingTime: readingTime,
          content: article.content,
          tags: article.tags || [],
          references: article.references || []
        }}
        breadcrumbs={[
          { name: 'Ana Sayfa', url: 'https://openwall.com.tr' },
          { name: 'Makaleler', url: 'https://openwall.com.tr/articles' },
          { name: article.title, url: pageUrl }
        ]}
      />
      
      {/* Ek yapılandırılmış veri */}
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": article.title,
            "description": article.description || article.content?.substring(0, 160),
            "url": window.location.href,
            "mainEntity": {
              "@type": "Article",
              "headline": article.title,
              "description": article.description || article.content?.substring(0, 160),
              "image": pageImage,
              "author": {
                "@type": "Person",
                "name": author || "openwall"
              },
              "publisher": {
                "@type": "Organization",
                "name": "openwall",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://openwall.com.tr/logo.png"
                }
              },
              "datePublished": article.createdAt,
              "dateModified": article.updatedAt,
              "articleSection": article.categories?.[0] || "General",
              "keywords": article.tags?.join(', '),
              "wordCount": article.content?.replace(/<[^>]+>/g, '').split(/\s+/).length,
              "timeRequired": readingTime,
              "inLanguage": "tr-TR",
              "isAccessibleForFree": true
            },
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Ana Sayfa",
                  "item": "https://openwall.com.tr"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Makaleler",
                  "item": "https://openwall.com.tr/articles"
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": article.title,
                  "item": window.location.href
                }
              ]
            }
          })}
        </script>
      </Helmet>
      
      <Header scrollPercent={scrollPercent} />

      {/* Title and Cover Image Section */}
      <div className="px-4 sm:px-6 lg:px-8 pt-20 md:pt-24 pb-2 md:pb-3">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <div className="mb-6">
            <div className="text-[20px] text-orange-500 font-medium mb-2">
              {article.createdAt ? new Date(article.createdAt).toLocaleDateString('tr-TR', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              }) : ''}
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-inter text-gray-900 dark:text-white font-bold leading-tight max-w-4xl mb-4">
              {article.title}
            </h1>
            
            {/* Description */}
            {article.description && (
              <p className="text-lg md:text-xl text-gray-700/80 dark:text-gray-300/80 font-bold leading-relaxed max-w-4xl mb-4">
                {article.description}
              </p>
            )}
            
            {/* Liste Dışı Uyarısı */}
            {article.status === 'unlisted' && (
              <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <span className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                    Bu makale liste dışıdır - sadece direkt link ile erişilebilir
                  </span>
                </div>
              </div>
            )}
          </div>
          
          {/* Cover Image */}
          <div className="w-full h-[50vw] md:h-[400px] lg:h-[500px] rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-lg">
            <img
              src={coverImage}
              alt={article.title}
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>
      </div>
          
      {/* Main Content - Single Column Layout */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto pt-2 md:pt-3 pb-6 md:pb-8 lg:pb-12">

          {/* Main Article Content */}
          <div>
            {/* Article Content */}
            <div className="prose prose-sm md:prose-base lg:prose-lg max-w-none [&_p]:!leading-snug [&_li]:!leading-snug">
              <div 
                className="text-lg md:text-xl lg:text-[22px] !leading-snug text-gray-800 dark:text-gray-300"
                dangerouslySetInnerHTML={{ __html: contentWithSources }}
              />
              </div>

              {/* Comments Section - Positioned under article content */}
              <div className="mt-8 md:mt-12">
                <CommentsSection articleSlug={article.slug} />
              </div>

              {/* References */}
              {article.references && article.references.length > 0 && (
                <section className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-gray-200">
                  <h2 className="text-xl md:text-2xl font-serif font-semibold text-gray-900 mb-4 md:mb-6">Kaynaklar</h2>
                  <ol className="list-decimal pl-4 md:pl-6 space-y-2 text-gray-700 text-sm md:text-base">
                    {article.references.map((ref, i) => (
                      <li key={i} className="leading-relaxed">{ref}</li>
                    ))}
                  </ol>
                </section>
              )}
          </div>
        </div>
      </div>

      {/* Apple-style Sticky Bottom Bar */}
      <div 
        className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-black backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50 transition-transform duration-300"
        style={{
          transform: bottomBarVisible ? 'translateY(0)' : 'translateY(100%)'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop Layout */}
          <div className="hidden md:flex items-center justify-between py-3 gap-4">
            
            {/* Left Side - Article Info */}
            <div className="flex items-center gap-3 text-sm min-w-0 flex-1">
              {/* Article Title */}
              <h1 className="font-medium text-gray-900 dark:text-white truncate max-w-md">
                {article.title}
              </h1>
              <span className="text-gray-400 dark:text-gray-600">•</span>
              {/* Author */}
              {author && (
                <>
                  <div className="text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    {author}
                  </div>
                  <span className="text-gray-400 dark:text-gray-600">•</span>
                </>
              )}
              {/* Reading Time */}
              <div className="text-gray-600 dark:text-gray-400 whitespace-nowrap">
                {readingTime}
              </div>
              {/* Category */}
              {article.categories && article.categories.length > 0 && (
                <>
                  <span className="text-gray-400 dark:text-gray-600">•</span>
                  <div className="text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    {article.categories[0]}
                  </div>
                </>
              )}
            </div>

            {/* Right Side - Stats and Actions */}
            <div className="flex items-center gap-4 text-sm whitespace-nowrap">
              {/* View Count */}
              <div className="text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {article.viewCount || 0}
              </div>
              
              <span className="text-gray-400 dark:text-gray-600">|</span>

              {/* Save Button */}
              {user && (
                <button
                  onClick={handleToggleSave}
                  disabled={isSaveLoading}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title={isSaved ? 'Kayıtlardan kaldır' : 'Daha sonra oku için kaydet'}
                >
                  {isSaved ? (
                    <FaBookmark className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  ) : (
                    <FaRegBookmark className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  )}
                </button>
              )}

              {/* Share Button */}
              <button
                onClick={() => setShareModalOpen(true)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="Paylaş"
              >
                <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              </button>

              {/* Twitter Share */}
              <button
                onClick={() => setTwitterShareModalOpen(true)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="Twitter'da Paylaş"
              >
                <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </button>

              {/* Theme Toggle */}
              <button
                onClick={() => changeTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="Tema Değiştir"
              >
                {theme === 'dark' ? (
                  <LuSun className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                ) : (
                  <LuMoon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                )}
              </button>

            </div>
          </div>

          {/* Mobile Layout */}
          <div className="flex md:hidden flex-col py-2 gap-2">
            {/* Top Row - Title and Actions */}
            <div className="flex items-center justify-between gap-2">
              <h1 className="text-sm font-medium text-gray-900 dark:text-white truncate flex-1">
                {article.title}
              </h1>
              <div className="flex items-center gap-2">
                {/* Save Button */}
                {user && (
                  <button
                    onClick={handleToggleSave}
                    disabled={isSaveLoading}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title={isSaved ? 'Kayıtlardan kaldır' : 'Daha sonra oku için kaydet'}
                  >
                    {isSaved ? (
                      <FaBookmark className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    ) : (
                      <FaRegBookmark className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    )}
                  </button>
                )}
                
                {/* Share Button */}
                <button
                  onClick={() => setShareModalOpen(true)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  title="Paylaş"
                >
                  <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                </button>
                {/* Twitter Share */}
                <button
                  onClick={() => setTwitterShareModalOpen(true)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  title="Twitter'da Paylaş"
                >
                  <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </button>
                
              </div>
            </div>
            
            {/* Bottom Row - Meta Info */}
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 overflow-x-auto">
              {author && (
                <>
                  <span>{author}</span>
                  <span>•</span>
                </>
              )}
              <span>{readingTime}</span>
              {article.categories && article.categories.length > 0 && (
                <>
                  <span>•</span>
                  <span>{article.categories[0]}</span>
                </>
              )}
              <span>•</span>
              <div className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {article.viewCount || 0}
              </div>
            </div>
          </div>
        </div>
        
        {/* Full-width Progress Bar at the very bottom */}
        <div className="w-full h-1 bg-gray-200/50 dark:bg-gray-700/50">
          <div 
            className="h-full transition-all duration-300 ease-out"
            style={{ 
              width: `${scrollPercent}%`,
              backgroundColor: isDarkMode ? '#9CA3AF' : '#4B5563'
            }}
          ></div>
        </div>
      </div>

      {/* Other Articles Section */}
        {articles.length > 0 && (
        <section className="py-8 md:py-16 px-4 sm:px-6 lg:px-8 pb-20">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-xl md:text-2xl font-inter font-semibold text-gray-900 mb-6 md:mb-8">Diğer Makaleler</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {articles.slice(0, 4).map(a => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </div>
            </div>
          </section>
        )}

    </>
  );
};

export default ArticleDetailPage;
