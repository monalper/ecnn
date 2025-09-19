import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import MetaTags from '../../components/seo/MetaTags';

const DictWordPage = () => {
  const { word } = useParams();
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEntry = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get(`/dictionary/${word}`);
        setEntry(res.data);
      } catch (err) {
        setError('Kelime bulunamadı.');
      } finally {
        setLoading(false);
      }
    };
    fetchEntry();
  }, [word]);

  // Sayfa yüklendiğinde en üste scroll yap
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [word]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] dark:bg-dark-primary transition-colors">
        <div className="max-w-2xl mx-auto px-6 py-16">
          <div className="text-center py-20">
            <div className="inline-block w-6 h-6 border-2 border-gray-300 dark:border-[#f5f5f5] border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] dark:bg-dark-primary transition-colors">
        <div className="max-w-2xl mx-auto px-6 py-16">
          <div className="text-center py-20">
            <div className="text-red-500 dark:text-red-400 font-light text-lg mb-4">{error}</div>
            <Link 
              to="/dictionary" 
              className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Sözlüğe Dön
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!entry) return null;

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-dark-primary transition-colors">
      <MetaTags
        title={`${entry.word} - Sözlük`}
        description={`${entry.word} kelimesinin anlamı ve tanımı. The Openwall Türkçe Sözlüğü.`}
        keywords={`${entry.word}, sözlük, anlam, tanım, The Openwall`}
      />
      
      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Back Link */}
        <div className="mb-8">
          <Link 
            to="/dictionary" 
            className="inline-flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Geri
          </Link>
        </div>

        {/* Word */}
        <div className="mb-6">
          <h1 className="text-5xl font-light text-gray-900 dark:text-white tracking-tight mb-2">
            {entry.word}
          </h1>
          {entry.type && (
            <span className="text-sm text-gray-500 dark:text-gray-400 font-light uppercase tracking-wide">
              {entry.type}
            </span>
          )}
        </div>

        {/* Definitions */}
        <div className="space-y-4">
          {Array.isArray(entry.definition)
            ? entry.definition.map((def, i) => (
                <div key={i} className="flex items-start gap-4">
                  <span className="text-sm text-gray-400 dark:text-gray-500 font-medium min-w-[2rem] pt-1">
                    {i + 1}.
                  </span>
                  <div className="text-gray-700 dark:text-gray-300 leading-relaxed flex-1" dangerouslySetInnerHTML={{ __html: def }} />
                </div>
              ))
            : (
                <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  <div dangerouslySetInnerHTML={{ __html: entry.definition }} />
                </div>
              )
          }
        </div>

        {/* Date */}
        {entry.createdAt && (
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {new Date(entry.createdAt).toLocaleDateString('tr-TR')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DictWordPage;
