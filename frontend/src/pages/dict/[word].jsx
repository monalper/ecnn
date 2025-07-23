import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';

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

  if (loading) return <div className="py-10 text-center">Yükleniyor...</div>;
  if (error) return <div className="py-10 text-center text-red-600">{error}</div>;
  if (!entry) return null;

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-2">{entry.word}</h1>
      {entry.type && (
        <div className="mb-4 text-sm text-slate-500 font-semibold italic">
          {entry.type.charAt(0).toUpperCase() + entry.type.slice(1)}
        </div>
      )}
      <div className="text-lg">
        {Array.isArray(entry.definition)
          ? entry.definition.map((def, i) => (
              <div key={i} className="mb-2 flex items-start gap-2">
                <span className="font-bold min-w-[2em]">{i + 1}.</span>
                <span style={{flex:1}} dangerouslySetInnerHTML={{ __html: def }} />
              </div>
            ))
          : <div className="mb-2 flex items-start gap-2"><span className="font-bold min-w-[2em]">1.</span><span style={{flex:1}} dangerouslySetInnerHTML={{ __html: entry.definition }} /></div>}
      </div>
      <div className="mt-4 text-slate-400 text-xs">Eklenme: {entry.createdAt ? new Date(entry.createdAt).toLocaleString() : '-'}</div>
    </div>
  );
};

export default DictWordPage;
