import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MetaTags from '../components/seo/MetaTags';
import api from '../services/api';

const DictionaryPage = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEntries, setFilteredEntries] = useState([]);

  useEffect(() => {
    const fetchEntries = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/dictionary');
        setEntries(res.data);
        setFilteredEntries(res.data);
      } catch (err) {
        setError('Kelimeler yüklenemedi.');
      } finally {
        setLoading(false);
      }
    };
    fetchEntries();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredEntries(entries);
    } else {
      const filtered = entries.filter(entry =>
        entry.word.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredEntries(filtered);
    }
  }, [searchQuery, entries]);

  return (
    <div className="min-h-screen bg-site-background dark:bg-dark-primary transition-colors">
      <MetaTags
        title="Türkçe Sözlük"
        description="OpenWall Türkçe Sözlüğü - Kelimeler ve anlamları."
        keywords="sözlük, dictionary, kelime, anlam, openwall, türkçe"
      />
      <div className="px-0 sm:px-12 lg:px-20 xl:px-32 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-light text-gray-900 dark:text-white mb-3 tracking-tight">
            Sözlük
          </h1>
          <p className="text-lg text-gray-500 dark:text-[#f5f5f5] font-light">
            Openwall Türkçe Sözlüğü
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-12">
          <input
            type="text"
            placeholder="Kelime ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-6 py-4 text-lg rounded-2xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-[#f5f5f5] focus:outline-none active:outline-none shadow-sm"
          />
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-6 h-6 border-2 border-gray-300 dark:border-[#f5f5f5] border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-500 dark:text-red-400 font-light">{error}</div>
        ) : (
          <div>
            {/* Results Header */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-light text-gray-900 dark:text-white">
                Kelimeler
              </h2>
              <span className="text-sm text-gray-400 dark:text-gray-500 font-light">
                {filteredEntries.length} kelime
              </span>
            </div>
            
            {filteredEntries.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-400 dark:text-gray-500 font-light text-lg">
                  {searchQuery ? 'Arama sonucu bulunamadı.' : 'Henüz kelime eklenmemiş.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {filteredEntries.map(entry => (
                  <Link
                    to={`/dict/${encodeURIComponent(entry.word)}`}
                    key={entry.word}
                    className="group block p-6 bg-white dark:bg-slate-800 rounded-2xl transition-all duration-300 ease-out hover:bg-gray-50/50 dark:hover:bg-slate-750 hover:shadow-sm"
                  >
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">
                          {entry.word}
                        </h3>
                        {entry.type && (
                          <p className="text-sm text-gray-400 dark:text-gray-500 font-light uppercase tracking-wide transition-colors duration-300 group-hover:text-gray-500 dark:group-hover:text-gray-400">
                            {entry.type}
                          </p>
                        )}
                      </div>
                      
                      {/* Açıklama - Hover'da görünür */}
                      <div className="overflow-hidden transition-all duration-300 ease-out">
                        <div className="transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out">
                          <div className="text-sm text-gray-600 dark:text-gray-300 font-light leading-relaxed line-clamp-3">
                            {Array.isArray(entry.definition)
                              ? entry.definition[0] && (
                                  <span dangerouslySetInnerHTML={{ __html: entry.definition[0] }} />
                                )
                              : <span dangerouslySetInnerHTML={{ __html: entry.definition }} />}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DictionaryPage; 