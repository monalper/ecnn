import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const AdminDictionaryPage = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [word, setWord] = useState('');
  const [definitions, setDefinitions] = useState(['']); // HTML string array
  const [type, setType] = useState('isim');
  const [success, setSuccess] = useState('');

  // Fetch all dictionary entries
  const fetchEntries = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/dictionary');
      setEntries(res.data);
    } catch (err) {
      setError('Kelimeler yüklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  // Add new word
  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!word.trim() || definitions.some(def => !def.trim())) {
      setError('Kelime ve tüm açıklamalar zorunlu!');
      return;
    }
    try {
      await api.post('/dictionary', { word, definition: definitions, type });
      setSuccess('Kelime eklendi!');
      setWord('');
      setDefinitions(['']);
      fetchEntries();
    } catch (err) {
      setError(err.response?.data?.message || 'Kelime eklenemedi.');
    }
  };

  // Düzenleme modalı state'leri
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editWord, setEditWord] = useState('');
  const [editDefinitions, setEditDefinitions] = useState(['']);
  const [editType, setEditType] = useState('isim');
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');

  // Düzenleme modalını aç
  const openEditModal = (entry) => {
    setEditWord(entry.word);
    setEditDefinitions(Array.isArray(entry.definition) ? entry.definition : [entry.definition || '']);
    setEditType(entry.type || 'isim');
    setEditError('');
    setEditSuccess('');
    setEditModalOpen(true);
  };

  // Düzenleme modalını kapat
  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditWord('');
    setEditDefinitions(['']);
    setEditType('isim');
    setEditError('');
    setEditSuccess('');
  };

  // Düzenlemeyi kaydet
  const handleEditSave = async (e) => {
    e.preventDefault();
    setEditError('');
    setEditSuccess('');
    if (editDefinitions.some(def => !def.trim())) {
      setEditError('Tüm açıklamalar zorunlu!');
      return;
    }
    try {
      await api.put(`/dictionary/${editWord}`, {
        definition: editDefinitions,
        type: editType
      });
      setEditSuccess('Güncellendi!');
      fetchEntries();
      setTimeout(() => {
        closeEditModal();
      }, 700);
    } catch (err) {
      setEditError(err.response?.data?.message || 'Güncellenemedi.');
    }
  };

  // Delete word
  const handleDelete = async (wordToDelete) => {
    if (!window.confirm(`'${wordToDelete}' silinsin mi?`)) return;
    try {
      await api.delete(`/dictionary/${wordToDelete}`);
      fetchEntries();
    } catch (err) {
      setError('Silinemedi.');
    }
  };

  return (
    <div className="p-6 md:p-8 rounded-xl shadow-xl max-w-2xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6">Sözlük Yönetimi</h1>
      <form onSubmit={handleAdd} className="flex flex-col gap-4 mb-8">
        <input
          className="border p-2 rounded"
          placeholder="Kelime"
          value={word}
          onChange={e => setWord(e.target.value)}
        />
        <select
          className="border p-2 rounded"
          value={type}
          onChange={e => setType(e.target.value)}
        >
          <option value="isim">İsim</option>
          <option value="sıfat">Sıfat</option>
          <option value="fiil">Fiil</option>
          <option value="teknik">Teknik</option>
          <option value="diğer">Diğer</option>
        </select>
        <div className="flex flex-col gap-2">
          {definitions.map((def, idx) => (
            <div key={idx} className="flex gap-2">
              <div className="flex-1">
                <ReactQuill
                  theme="snow"
                  value={def}
                  onChange={content => {
                    const newDefs = [...definitions];
                    newDefs[idx] = content;
                    setDefinitions(newDefs);
                  }}
                  placeholder={`Açıklama #${idx + 1}`}
                  modules={{
                    toolbar: [
                      [{ 'header': [1, 2, false] }],
                      ['bold', 'italic', 'underline', 'link'],
                      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                      ['clean']
                    ]
                  }}
                />
              </div>
              {definitions.length > 1 && (
                <button
                  type="button"
                  className="px-2 text-red-600 font-bold"
                  onClick={() => setDefinitions(definitions.filter((_, i) => i !== idx))}
                  title="Bu açıklamayı kaldır"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className="w-fit mt-2 px-3 py-1 bg-amber-100 text-amber-800 rounded hover:bg-amber-200 text-sm"
            onClick={() => setDefinitions([...definitions, ''])}
          >Açıklama Ekle</button>
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Ekle</button>
        {success && <div className="text-green-600">{success}</div>}
        {error && <div className="text-red-600">{error}</div>}
      </form>
      {loading ? (
        <div>Yükleniyor...</div>
      ) : (
        <div>
          {entries.length === 0 ? (
            <div>Henüz kelime yok.</div>
          ) : (
            <table className="min-w-full border">
              <thead>
                <tr>
                  <th className="border px-2 py-1">Kelime</th>
                  <th className="border px-2 py-1">Tür</th>
                  <th className="border px-2 py-1">Açıklama</th>
                  <th className="border px-2 py-1">Sil</th>
                  <th className="border px-2 py-1">Düzenle</th>
<th className="border px-2 py-1">Link</th>
                </tr>
              </thead>
              <tbody>
                {entries.map(entry => (
                  <tr key={entry.word}>
                    <td className="border px-2 py-1 font-semibold">{entry.word}</td>
                    <td className="border px-2 py-1">{entry.type || '-'}</td>
                    <td className="border px-2 py-1">
                      {Array.isArray(entry.definition)
                        ? entry.definition.map((def, i) => (
                            <div key={i} dangerouslySetInnerHTML={{ __html: def }} />
                          ))
                        : <div dangerouslySetInnerHTML={{ __html: entry.definition }} />}
                    </td>
                    <td className="border px-2 py-1 text-center">
                      <button onClick={() => handleDelete(entry.word)} className="text-red-600 hover:underline">Sil</button>
                    </td>
                    <td className="border px-2 py-1 text-center">
                      <button onClick={() => openEditModal(entry)} className="text-blue-600 hover:underline">Düzenle</button>
                    </td>
                    <td className="border px-2 py-1 text-center">
                      <Link to={`/dict/${encodeURIComponent(entry.word)}`} className="text-amber-700 hover:underline" target="_blank" rel="noopener noreferrer">Detay</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
      {/* Düzenleme Modalı */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-primary bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
            <button className="absolute top-2 right-3 text-2xl text-gray-400 hover:text-gray-700" onClick={closeEditModal}>&times;</button>
            <h2 className="text-xl font-bold mb-4">Kelime Düzenle: {editWord}</h2>
            <form onSubmit={handleEditSave} className="flex flex-col gap-3">
              <label className="font-semibold">Tür:</label>
              <select
                className="border p-2 rounded"
                value={editType}
                onChange={e => setEditType(e.target.value)}
              >
                <option value="isim">İsim</option>
                <option value="sıfat">Sıfat</option>
                <option value="fiil">Fiil</option>
                <option value="teknik">Teknik</option>
                <option value="diğer">Diğer</option>
              </select>
              <label className="font-semibold">Açıklamalar:</label>
              <div className="flex flex-col gap-2">
                {editDefinitions.map((def, idx) => (
                  <div key={idx} className="flex gap-2">
                    <div className="flex-1">
                      <ReactQuill
                        theme="snow"
                        value={def}
                        onChange={content => {
                          const newDefs = [...editDefinitions];
                          newDefs[idx] = content;
                          setEditDefinitions(newDefs);
                        }}
                        placeholder={`Açıklama #${idx + 1}`}
                        modules={{
                          toolbar: [
                            [{ 'header': [1, 2, false] }],
                            ['bold', 'italic', 'underline', 'link'],
                            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                            ['clean']
                          ]
                        }}
                      />
                    </div>
                    {editDefinitions.length > 1 && (
                      <button
                        type="button"
                        className="px-2 text-red-600 font-bold"
                        onClick={() => setEditDefinitions(editDefinitions.filter((_, i) => i !== idx))}
                        title="Bu açıklamayı kaldır"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  className="w-fit mt-2 px-3 py-1 bg-amber-100 text-amber-800 rounded hover:bg-amber-200 text-sm"
                  onClick={() => setEditDefinitions([...editDefinitions, ''])}
                >Açıklama Ekle</button>
              </div>
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded mt-4 hover:bg-blue-700">Kaydet</button>
              {editError && <div className="text-red-600 mt-2">{editError}</div>}
              {editSuccess && <div className="text-green-600 mt-2">{editSuccess}</div>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDictionaryPage;
