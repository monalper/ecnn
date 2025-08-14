// ECNN - Kopya/frontend/src/pages/ArticleDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { FaFacebookF, FaLinkedinIn, FaLink, FaWhatsapp, FaTelegramPlane, FaRedditAlien, FaEye } from 'react-icons/fa';
import { SiX } from 'react-icons/si';
import * as htmlToImage from 'html-to-image';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '../components/layout/Header';
import MetaTags from '../components/seo/MetaTags';
import SchemaMarkup from '../components/seo/SchemaMarkup';
import Breadcrumb from '../components/navigation/Breadcrumb';

// Google AdSense script will be injected via Helmet below
import api from '../services/api';
import ArticleCard from '../components/article/ArticleCard';

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
  // Kısa link state'i
  const [shortUrl, setShortUrl] = useState('');
  // Scroll yüzde state'i
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Makale içeriği için scroll yüzdesini hesapla
      const articleContent = document.querySelector('.prose');
      if (articleContent) {
        const rect = articleContent.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Makale içeriği viewport'ta görünmeye başladığında
        if (rect.top <= windowHeight) {
          // Makale içeriğinin ne kadarının okunduğunu hesapla
          const contentHeight = articleContent.scrollHeight;
          const contentTop = articleContent.offsetTop;
          const scrollTop = window.scrollY;
          
          // Makale içeriği başlangıcından itibaren scroll pozisyonu
          const contentScrollTop = Math.max(0, scrollTop - contentTop);
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
    return <div className="text-center py-20 text-slate-600">Loading...</div>;
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
  const pageUrl = typeof window !== 'undefined' ? window.location.href : '';

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
        url={window.location.href}
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
          url: window.location.href,
          author: author,
          publishedTime: article.createdAt,
          modifiedTime: article.updatedAt,
          section: "Technology",
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
          { name: article.title, url: window.location.href }
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

      {/* Hero Section - Large Header Image */}
      <div className="relative w-full h-[90vw] md:aspect-[4/3] md:h-[90vh] lg:h-[100vh] md:min-h-[650px] lg:min-h-[750px] bg-black">
        <img
          src={coverImage}
          alt={article.title}
          className="w-full h-full object-cover object-center opacity-90"
        />
        {/* Overlay with title */}
        <div className="absolute inset-0 bg-black/30"></div>
        {/* Gradient overlay for better text readability - hidden on mobile */}
        <div className="hidden md:block absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-black via-black/90 via-black/80 via-black/70 via-black/60 via-black/50 via-black/40 via-black/30 via-black/20 via-black/10 via-black/5 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 lg:p-12">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
            <h1 className="hidden md:block text-[72px] font-['EB_Garamond'] text-white font-medium leading-none max-w-4xl mb-4">
              {article.title}
            </h1>
            {article.description && (
              <p className="hidden md:block text-base md:text-lg lg:text-xl text-white/90 font-inter leading-relaxed max-w-3xl">
                {article.description}
              </p>
            )}
          </div>
        </div>
      </div>
          
      {/* Main Content - Responsive Layout */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto py-6 md:py-8 lg:py-12">
          {/* Mobile: Single Column, Desktop: Two Column */}
          <div className="block lg:grid lg:grid-cols-4 lg:gap-12">
            
            {/* Mobile: Top, Desktop: Left - Metadata Sidebar */}
            <div className="order-1 lg:order-1 mb-8 lg:mb-0">
              <div className="lg:sticky lg:top-28 lg:self-start">
                {/* Mobile: Title and meta card */}
                <div className="block lg:hidden mb-6">
                  <h1 className="text-[42px] md:text-4xl lg:text-5xl xl:text-6xl font-['EB_Garamond'] text-gray-900 dark:text-white font-medium leading-none max-w-4xl mb-4">
                    {article.title}
                  </h1>
                  <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    {author && (
                      <div>Yazan, {author}.</div>
                    )}
                    {date && (
                      <div>{date}.</div>
                    )}
                  </div>
                </div>

                {/* Desktop: Full metadata sidebar */}
                <div className="hidden lg:block">
                  {/* Article Title - Only visible when hero title is not visible */}
                  {scrollPercent > 1 && (
                    <div className="pb-3 mb-4 lg:mb-0">
                      <h1 className="text-xl font-inter font-bold text-gray-900 dark:text-white leading-tight">
                        {article.title}
                      </h1>
                    </div>
                  )}
                  
                  {/* Author Information */}
                  {author && (
                    <div className="pb-3 mb-4 lg:mb-0">
                      <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                        Yazan, {author}.
                      </p>
                    </div>
                  )}

                  {/* Editor Information */}
                  <div className="pb-3 mb-4 lg:mb-0">
                    <p className="text-sm md:text-base text-gray-700">
                       <span className="text-blue-600 underline cursor-pointer"></span>
                    </p>
                  </div>

                  {/* Word Count */}
                  <div className="pb-3 mb-4 lg:mb-0">
                    <p className="text-sm md:text-base text-gray-700">
                      {article.content?.replace(/<[^>]+>/g, '').split(/\s+/).length || 0} kelime, {readingTime}
                    </p>
                    {date && (
                      <p className="text-sm md:text-base text-gray-700">
                        {date}
                      </p>
                    )}
                    <p className="text-sm md:text-base text-gray-700">
                      {article.viewCount || 0} görüntülenme
                    </p>
                  </div>

                  {/* Categories */}
                  {article.categories && article.categories.length > 0 && (
                    <div className="pb-3 mb-4 lg:mb-0">
                      <div className="text-sm md:text-base text-gray-700">
                        {article.categories.join(', ')}
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {article.tags && article.tags.length > 0 && (
                    <div className="mb-4 lg:mb-0">
                      <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3">Etiketler</h3>
                      <div className="flex flex-wrap gap-2">
                        {article.tags.map((tag, index) => (
                          <div key={index} className="text-blue-600 underline cursor-pointer text-sm md:text-base">
                            {tag}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Reading Progress */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Okuma İlerlemesi</span>
                      <span className="text-sm font-medium text-gray-900">{Math.round(scrollPercent)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${scrollPercent}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile: Bottom, Desktop: Right - Main Article Content */}
            <div className="order-2 lg:col-span-3">
              {/* Article Content with Initial Cap */}
              <div className="prose prose-sm md:prose-base lg:prose-lg max-w-none lg:-mt-8">
                {/* Initial Cap for first paragraph */}
                <div className="relative mb-6 md:mb-8">
                  <div className="float-left mr-2 md:mr-3 mb-0">
                    <span 
                      className="article-initial-cap text-4xl md:text-5xl lg:text-8xl xl:text-9xl leading-none"
                      style={{ 
                        lineHeight: '0.8',
                        verticalAlign: 'top',
                        display: 'block'
                      }}
                    >
                      {(article.content?.replace(/<[^>]+>/g, '').trim().charAt(0) || 'A').toUpperCase()}
                    </span>
                  </div>
                  <div 
                    className="text-lg md:text-xl lg:text-[22px] leading-tight text-gray-800"
                    dangerouslySetInnerHTML={{ __html: (() => {
                      if (!article.content) return '';
                      
                      // HTML içeriğini parse et
                      const parser = new DOMParser();
                      const doc = parser.parseFromString(article.content, 'text/html');
                      
                      // İlk text node'u bul ve ilk karakterini çıkar
                      const walker = document.createTreeWalker(
                        doc.body,
                        NodeFilter.SHOW_TEXT,
                        null,
                        false
                      );
                      
                      let firstTextNode = walker.nextNode();
                      if (firstTextNode && firstTextNode.textContent.trim()) {
                        firstTextNode.textContent = firstTextNode.textContent.replace(/^./, '');
                      }
                      
                      // Son olarak image sources ekle
                      return injectImageSources(doc.body.innerHTML, article.contentImages);
                    })() }}
                  />
                </div>
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
      </div>

      {/* Other Articles Section */}
        {articles.length > 0 && (
        <section className="py-8 md:py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h3 className="text-xl md:text-2xl font-inter font-semibold text-gray-900 mb-6 md:mb-8">Diğer Makaleler</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
              {articles.slice(0, 3).map(a => (
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
