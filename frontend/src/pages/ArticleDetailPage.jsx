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
      // Yalnızca body scroll'u için (tüm sayfa)
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      let percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      percent = Math.min(100, Math.max(0, percent));
      setScrollPercent(percent);
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
        text: `📰 ${article.title}\n\n${article.description ? article.description.substring(0, 100) + '...\n\n' : ''}👤 ${author}\n⏱️ ${readingTime}\n\n#OpenWall #${category} #makale\n\n${baseUrl}`
      },
      {
        name: 'Kısa ve Öz',
        text: `📰 ${article.title}\n\n${article.description ? article.description.substring(0, 80) + '...\n\n' : ''}#OpenWall #${category}\n\n${baseUrl}`
      },
      {
        name: 'Soru ile',
        text: `🤔 ${article.title} hakkında ne düşünüyorsunuz?\n\n${article.description ? article.description.substring(0, 90) + '...\n\n' : ''}👤 ${author}\n\n#OpenWall #${category} #tartışma\n\n${baseUrl}`
      },
      {
        name: 'Öneri',
        text: `💡 Bu makaleyi mutlaka okumalısınız!\n\n📰 ${article.title}\n\n${article.description ? article.description.substring(0, 80) + '...\n\n' : ''}👤 ${author}\n\n#OpenWall #${category} #öneri\n\n${baseUrl}`
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
                "name": author || "OpenWall"
              },
              "publisher": {
                "@type": "Organization",
                "name": "OpenWall",
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

      <div className="relative flex flex-row justify-center w-full pt-8">
        {/* Sol reklam (sadece masaüstü) */}
        <div className="hidden lg:block sticky top-24 self-start mr-6 z-20" style={{ width: 160, height: 600 }}>
        </div>
        {/* Makale ana gövdesi */}
        <div className="max-w-2xl w-full mx-auto">
          
          {/* Breadcrumb Navigation */}
          <Breadcrumb 
            items={[
              { name: 'Ana Sayfa', url: '/' },
              { name: 'Makaleler', url: '/articles' },
              { name: article.title, url: `/articles/${article.slug}` }
            ]}
          />

        <Helmet>
            <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5253715298133137" crossOrigin="anonymous"></script>
            
            {/* Ek SEO meta tag'leri */}
            <meta name="article:content_tier" content="premium" />
            <meta name="article:content_rating" content="general" />
            <meta name="article:content_language" content="tr-TR" />
            <meta name="article:content_region" content="TR" />
            <meta name="article:content_category" content="entellektuel-icerik" />
            <meta name="article:content_type" content="makale" />
            <meta name="article:content_format" content="html" />
            <meta name="article:content_length" content={`${article.content?.replace(/<[^>]+>/g, '').split(/\s+/).length || 0} kelime`} />
            <meta name="article:reading_time" content={readingTime} />
            <meta name="article:difficulty_level" content="orta" />
            <meta name="article:target_audience" content="entellektuel-kitle" />
            
            {/* Makale içeriği için ek meta bilgiler */}
            {article.tags && article.tags.map((tag, index) => (
              <meta key={index} name="article:tag" content={tag} />
            ))}
            {article.categories && article.categories.map((category, index) => (
              <meta key={index} name="article:category" content={category} />
            ))}
            {article.references && article.references.length > 0 && (
              <meta name="article:references" content={article.references.join(', ')} />
            )}
        </Helmet>
        {/* Kapak görseli */}
        <div className="w-full aspect-[16/9] bg-dark-secondary flex items-center justify-center">
          <img
            src={coverImage}
            alt="cover"
            className="w-full h-full object-cover object-center"
            style={{ display: 'block' }}
          />
        </div>
        {/* Image source sağ alt */}
        {imageSource && (
          <div className="text-xs text-[#7b7b7b] text-right mt-1 mb-2">Image Source: {imageSource}</div>
        )}
        {/* Yazar, tarih, okuma süresi */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-slate-700 dark:text-slate-300 mt-3 mb-2">
          {author && <span>Yazar: <span className="font-semibold">{author}</span></span>}
          {date && <span>Tarih: {date}</span>}
          {article.categories && article.categories.length > 0 && (
            <span>Kategoriler: {article.categories.join(', ')}</span>
          )}
          <span>Okuma Süresi: {readingTime}</span>
          <span className="flex items-center gap-1">
            <FaEye className="text-slate-500" />
            {article.viewCount || 0} görüntülenme
          </span>
        </div>
        {/* Başlık */}
        <h1
          className="font-bold text-slate-900 dark:text-slate-100 mt-4 mb-6 leading-tight break-words text-left"
          style={{ fontFamily: 'Inter, sans-serif', fontSize: '29px', fontWeight: 700, lineHeight: 1.15, textAlign: 'left' }}
        >
          {article.title}
        </h1>
        {/* İçerik */}
        <div
          className="prose prose-slate max-w-none mb-10 break-words text-left md:text-justify"
          style={{ fontFamily: 'Inter, sans-serif', fontSize: '17px', fontWeight: 400, lineHeight: 1.7, textAlign: window.innerWidth >= 768 ? 'justify' : 'left' }}
        >
          {/* Makale içeriği için ek SEO bilgileri */}
          <div itemScope itemType="https://schema.org/Article" style={{ display: 'none' }}>
            <meta itemProp="headline" content={article.title} />
            <meta itemProp="description" content={article.description || article.content?.substring(0, 160)} />
            <meta itemProp="image" content={pageImage} />
            <meta itemProp="author" content={author} />
            <meta itemProp="datePublished" content={article.createdAt} />
            <meta itemProp="dateModified" content={article.updatedAt} />
            <meta itemProp="articleSection" content={article.categories?.[0] || "General"} />
            <meta itemProp="keywords" content={article.tags?.join(', ')} />
            <meta itemProp="wordCount" content={article.content?.replace(/<[^>]+>/g, '').split(/\s+/).length} />
            <meta itemProp="timeRequired" content={readingTime} />
            <meta itemProp="inLanguage" content="tr-TR" />
            <meta itemProp="isAccessibleForFree" content="true" />
          </div>
          
          <div dangerouslySetInnerHTML={{ __html: contentWithSources }} />
        </div>
        {/* References */}
        {article.references && article.references.length > 0 && (
          <section className="mt-10 mb-12">
            <h2 className="flex items-center gap-2 text-lg font-bold mb-3 text-slate-900 dark:text-slate-100">
              <span className="text-yellow-400 text-xl">📑</span> References
            </h2>
            <ol className="list-decimal pl-6 space-y-1 text-[#7b7b7b] text-[15px]">
              {article.references.map((ref, i) => (
                <li key={i}>{ref}</li>
              ))}
            </ol>
          </section>
        )}
        
        {/* Ek SEO bilgileri */}
        <section className="mt-8 mb-6 text-sm text-slate-600 dark:text-slate-400">
          <div className="flex flex-wrap gap-4">
            {article.tags && article.tags.map((tag, index) => (
              <span key={index} className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-full text-xs">
                #{tag}
              </span>
            ))}
          </div>
          <div className="mt-4 text-xs">
            <p>Bu makale {article.content?.replace(/<[^>]+>/g, '').split(/\s+/).length || 0} kelime içermektedir ve yaklaşık {readingTime} okuma süresi vardır.</p>
            <p>Son güncelleme: {new Date(article.updatedAt).toLocaleDateString('tr-TR')}</p>
          </div>
        </section>
        </div>
        {/* Sağ reklam (sadece masaüstü) */}
        <div className="hidden lg:block sticky top-24 self-start ml-6 z-20" style={{ width: 160, height: 600 }}>
        </div>
      </div>

    </>
  );
};

export default ArticleDetailPage;