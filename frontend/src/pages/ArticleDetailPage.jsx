// ECNN - Kopya/frontend/src/pages/ArticleDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import ArticleCard from '../components/article/ArticleCard';

function calculateReadingTime(html) {
  // HTML'den metni çıkar, kelime sayısını bul, 200 wpm ile hesapla
  const text = html.replace(/<[^>]+>/g, ' ');
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} Min`;
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
    };
    fetchData();
  }, [slug]);

  if (loading || !article) {
    return <div className="text-center py-20 text-slate-600">Loading...</div>;
  }

  // Kapak görseli ve image source
  const coverImage = article.coverImage || `https://placehold.co/1200x675/E2E8F0/A0AEC0?text=${encodeURIComponent(article.title.substring(0,25))}`;
  const imageSource = article.imageSource || '';
  // Yazar, tarih, okuma süresi
  const author = article.authorName || article.author?.name || '';
  const date = article.createdAt ? new Date(article.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '';
  const readingTime = calculateReadingTime(article.content || '');

  // İçerik görselleri için kaynaklar (örnek: article.contentImages = {src: source})
  const contentWithSources = injectImageSources(article.content || '', article.contentImages);

  return (
    <div className="min-h-screen bg-[#f5f9fb] pb-16">
      <div className="max-w-2xl w-full mx-auto pt-8">
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
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-[#181818] mt-3 mb-2">
          {author && <span>Author: <span className="font-semibold">{author}</span></span>}
          {date && <span>Date: {date}</span>}
          <span>Reading Time: {readingTime}</span>
        </div>
        {/* Başlık */}
        <h1
          className="font-bold text-[#181818] mt-4 mb-6 leading-tight break-words"
          style={{ fontFamily: 'Inter, sans-serif', fontSize: '40px', fontWeight: 700, lineHeight: 1.15 }}
        >
          {article.title}
        </h1>
        {/* İçerik */}
        <div
          className="prose prose-slate max-w-none mb-10 break-words"
          style={{ fontFamily: 'Inter, sans-serif', fontSize: '23px', fontWeight: 400, lineHeight: 1.7 }}
        >
          <div dangerouslySetInnerHTML={{ __html: contentWithSources }} />
        </div>
        {/* References */}
        {article.references && article.references.length > 0 && (
          <section className="mt-10 mb-12">
            <h2 className="flex items-center gap-2 text-lg font-bold mb-3 text-[#181818]">
              <span className="text-yellow-400 text-xl">📑</span> References
            </h2>
            <ol className="list-decimal pl-6 space-y-1 text-[#7b7b7b] text-[15px]">
              {article.references.map((ref, i) => (
                <li key={i}>{ref}</li>
              ))}
            </ol>
          </section>
        )}
      </div>
      {/* Other Articles */}
      {articles.length > 0 && (
        <section className="max-w-5xl mx-auto mt-16">
          <h3 className="text-lg font-bold mb-6 text-[#181818]">Other Articles</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {articles.slice(0, 3).map(a => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ArticleDetailPage;
