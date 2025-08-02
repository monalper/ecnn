// ECNN - Kopya/frontend/src/pages/ArticleDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { FaFacebook, FaLinkedin, FaLink, FaWhatsapp, FaTelegram, FaReddit, FaEye } from 'react-icons/fa';
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
          readingTime: readingTime
        }}
      />
      
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
        </Helmet>
        {/* Kapak görseli */}
        <div className="w-full aspect-[16/9] bg-black flex items-center justify-center">
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
        {/* Paylaşım Önizleme Kartı - makalenin sonunda, genişliği içerik ile aynı */}
        <section className="flex flex-col items-center justify-center my-16">
          <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl shadow-xl p-8 max-w-4xl w-full border border-slate-200/50 dark:border-slate-700/50 mx-auto relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-100/30 to-transparent dark:from-blue-900/20 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-100/30 to-transparent dark:from-purple-900/20 rounded-full translate-y-12 -translate-x-12"></div>
            
            {/* Header */}
            <div className="text-center mb-6 relative z-10">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                </svg>
                Bu Makaleyi Paylaşın
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Bu Makaleyi Beğendiniz mi?</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Arkadaşlarınızla paylaşarak bize destek olun!</p>
            </div>

            {/* Preview Card */}
            <div id="share-preview-card" className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-8 border border-slate-200 dark:border-slate-700 relative z-10">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Image */}
                <div className="w-full md:w-48 h-32 md:h-32 bg-black rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={coverImage}
                    alt="cover preview"
                    className="w-full h-full object-cover object-center"
                    style={{ display: 'block' }}
                  />
                </div>
                {/* Content */}
                <div className="flex-1 flex flex-col justify-center">
                  <h2 className="text-lg font-bold mb-2 text-slate-900 dark:text-slate-100 line-clamp-2">{article.title}</h2>
                  <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-3">
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      {author}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      {readingTime}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                    {article.description || article.content?.substring(0, 120) + '...'}
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-3 relative z-10">
              {/* X (Twitter) */}
              <button
                onClick={() => {
                  setCustomTweetText(generateTweetTemplates()[0].text);
                  setTwitterShareModalOpen(true);
                }}
                aria-label="X'te paylaş"
                className="group flex flex-col items-center gap-2 p-4 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-sky-100 dark:hover:bg-sky-900/30 transition-all duration-200 hover:scale-105"
              >
                <div className="w-10 h-10 bg-sky-500 rounded-full flex items-center justify-center group-hover:bg-sky-600 transition-colors">
                  <SiX size={20} color="#fff" />
                </div>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">X</span>
              </button>
              
              {/* Facebook */}
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shortUrl || (process.env.NODE_ENV === 'production' ? `https://openwall.com.tr/articles/${article.slug}` : window.location.href))}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook'ta paylaş"
                className="group flex flex-col items-center gap-2 p-4 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-200 hover:scale-105"
              >
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center group-hover:bg-blue-700 transition-colors">
                  <FaFacebook size={20} color="#fff" />
                </div>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Facebook</span>
              </a>
              
              {/* LinkedIn */}
              <a
                href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shortUrl || (process.env.NODE_ENV === 'production' ? `https://openwall.com.tr/articles/${article.slug}` : window.location.href))}&title=${encodeURIComponent(article.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn'de paylaş"
                className="group flex flex-col items-center gap-2 p-4 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-200 hover:scale-105"
              >
                <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center group-hover:bg-blue-800 transition-colors">
                  <FaLinkedin size={20} color="#fff" />
                </div>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">LinkedIn</span>
              </a>
              
              {/* WhatsApp */}
              <a
                href={`https://wa.me/?text=${encodeURIComponent(article.title + ' ' + (shortUrl || (process.env.NODE_ENV === 'production' ? `https://openwall.com.tr/articles/${article.slug}` : window.location.href)))}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp'ta paylaş"
                className="group flex flex-col items-center gap-2 p-4 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-green-100 dark:hover:bg-green-900/30 transition-all duration-200 hover:scale-105"
              >
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center group-hover:bg-green-600 transition-colors">
                  <FaWhatsapp size={20} color="#fff" />
                </div>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">WhatsApp</span>
              </a>
              
              {/* Telegram */}
              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(shortUrl || (process.env.NODE_ENV === 'production' ? `https://openwall.com.tr/articles/${article.slug}` : window.location.href))}&text=${encodeURIComponent(article.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram'da paylaş"
                className="group flex flex-col items-center gap-2 p-4 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-200 hover:scale-105"
              >
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                  <FaTelegram size={20} color="#fff" />
                </div>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Telegram</span>
              </a>
              
              {/* Reddit */}
              <a
                href={`https://www.reddit.com/submit?url=${encodeURIComponent(shortUrl || (process.env.NODE_ENV === 'production' ? `https://openwall.com.tr/articles/${article.slug}` : window.location.href))}&title=${encodeURIComponent(article.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Reddit'te paylaş"
                className="group flex flex-col items-center gap-2 p-4 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-all duration-200 hover:scale-105"
              >
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center group-hover:bg-orange-600 transition-colors">
                  <FaReddit size={20} color="#fff" />
                </div>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Reddit</span>
              </a>
              
              {/* Copy Link */}
              <button
                onClick={() => {
                  const linkToCopy = shortUrl || (process.env.NODE_ENV === 'production' ? `https://openwall.com.tr/articles/${article.slug}` : window.location.href);
                  navigator.clipboard.writeText(linkToCopy);
                  // Show a better notification
                  const notification = document.createElement('div');
                  notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
                  notification.textContent = 'Bağlantı kopyalandı!';
                  document.body.appendChild(notification);
                  setTimeout(() => notification.remove(), 3000);
                }}
                aria-label="Bağlantıyı kopyala"
                className="group flex flex-col items-center gap-2 p-4 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-all duration-200 hover:scale-105"
              >
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center group-hover:bg-purple-600 transition-colors">
                  <FaLink size={20} color="#fff" />
                </div>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Kopyala</span>
              </button>
            </div>
            
            {/* Footer note */}
            <div className="mt-6 text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                💡 Instagram doğrudan paylaşımı desteklemiyor, bağlantıyı kopyalayıp paylaşabilirsiniz.
              </p>
            </div>
          </div>
        </section>
        {/* Other Articles */}
        {articles.length > 0 && (
          <section className="max-w-5xl mx-auto mt-16">
            <h3 className="text-lg font-bold mb-6 text-[#181818] dark:text-slate-100">Other Articles</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {articles.slice(0, 3).map(a => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </div>
          </section>
        )}
        </div>
        {/* Sağ reklam (sadece masaüstü) */}
        <div className="hidden lg:block sticky top-24 self-start ml-6 z-20" style={{ width: 160, height: 600 }}>
        </div>
      </div>

      {/* Twitter Paylaşım Modal */}
      {twitterShareModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-sky-500 rounded-full flex items-center justify-center">
                  <SiX size={20} color="#fff" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">X'te Paylaş</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Tweet'inizi özelleştirin</p>
                </div>
              </div>
              <button
                onClick={() => setTwitterShareModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Tweet Templates */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Tweet Şablonları</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {generateTweetTemplates().map((template, index) => (
                    <button
                      key={index}
                      onClick={() => setCustomTweetText(template.text)}
                      className="text-left p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-sky-300 dark:hover:border-sky-600 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-all"
                    >
                      <div className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-1">
                        {template.name}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                        {template.text.substring(0, 80)}...
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Tweet Editor */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Tweet Metni
                </label>
                <textarea
                  value={customTweetText}
                  onChange={handleCustomTweetChange}
                  className="w-full h-32 p-3 border border-slate-300 dark:border-slate-600 rounded-lg resize-none focus:ring-2 focus:ring-sky-500 focus:border-transparent dark:bg-slate-700 dark:text-slate-100"
                  placeholder="Tweet metninizi buraya yazın..."
                  maxLength={280}
                />
                <div className="flex justify-between items-center mt-2">
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {customTweetText.length}/280 karakter
                  </div>
                  <div className={`text-xs ${customTweetText.length > 260 ? 'text-red-500' : 'text-slate-500 dark:text-slate-400'}`}>
                    {280 - customTweetText.length} karakter kaldı
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Önizleme</h4>
                <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-sky-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <SiX size={16} color="#fff" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-slate-900 dark:text-slate-100">OpenWall</span>
                        <span className="text-slate-500 dark:text-slate-400">@openwall</span>
                        <span className="text-slate-500 dark:text-slate-400">· şimdi</span>
                      </div>
                      <div className="text-slate-900 dark:text-slate-100 whitespace-pre-wrap text-sm">
                        {customTweetText}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setTwitterShareModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={() => handleTwitterShare()}
                  disabled={!customTweetText.trim()}
                  className="flex-1 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Tweet'i Paylaş
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default ArticleDetailPage;
