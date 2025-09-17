// frontend/src/components/article/ArticleForm.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import api from '../../services/api'; // API servisimiz
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Highlight from '@tiptap/extension-highlight';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import { lowlight } from 'lowlight';
import { FaBold, FaItalic, FaHeading, FaListUl, FaListOl, FaImage, FaUndo, FaRedo, FaLink, FaUnlink, FaAlignLeft, FaAlignCenter, FaAlignRight, FaCode, FaHighlighter, FaTasks, FaQuoteLeft, FaTable, FaFont, FaPalette, FaUnderline, FaStrikethrough, FaMinus, FaChevronDown, FaYoutube, FaTextHeight, FaArrowsAltH, FaCalculator, FaClock, FaFlask, FaSuperscript, FaCopy } from 'react-icons/fa';

// Custom Extensions
import { FontFamily } from '../../extensions/FontFamilyExtension';
import { FontSize } from '../../extensions/FontSizeExtension';
import { LineHeight } from '../../extensions/LineHeightExtension';
import { LetterSpacing } from '../../extensions/LetterSpacingExtension';
import { InlineCode } from '../../extensions/InlineCodeExtension';
import { Math, MathInline, MathBlock } from '../../extensions/MathExtension';
import { Chemistry } from '../../extensions/ChemistryExtension';
import { ScientificNotation } from '../../extensions/ScientificNotationExtension';
import { CountdownTimer } from '../../extensions/CountdownTimerExtension';
import { AutoSave } from '../../extensions/AutoSaveExtension';

// Styles
import '../../extensions/editor-extensions.css';

// Basit bir WYSIWYG editör veya Markdown editörü yerine şimdilik textarea kullanıyoruz.
// Önerilen kütüphaneler: react-quill, Tiptap, Editor.js, react-markdown-editor-lite

// Add this style block at the top level, outside the component
if (typeof window !== 'undefined' && !document.getElementById('custom-table-style')) {
  const style = document.createElement('style');
  style.id = 'custom-table-style';
  style.innerHTML = `
    .custom-table {
      border-collapse: collapse;
      width: 100%;
    }
    .custom-table-cell {
      min-width: 40px;
      min-height: 30px;
      padding: 0;
    }
  `;
  document.head.appendChild(style);
}

// Custom Tiptap Iframe extension (YouTube embed)
import { Node, mergeAttributes } from '@tiptap/core';

// Twitter Embed Extension
const TwitterEmbed = Node.create({
  name: 'twitterEmbed',
  group: 'block',
  atom: true,
  addAttributes() {
    return {
      url: { default: null },
    };
  },
  parseHTML() {
    return [
      { tag: 'blockquote.twitter-tweet' },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    // Check for dark mode
    const isDark = typeof document !== 'undefined' && document.body.classList.contains('dark');
    // x.com linklerini twitter.com'a çevir
    let embedUrl = HTMLAttributes.url;
    if (embedUrl && embedUrl.includes('x.com/')) {
      embedUrl = embedUrl.replace('x.com/', 'twitter.com/');
    }
    return [
      'div',
      {
        class: 'twitter-embed-wrapper',
        style: 'margin:16px 0; width:100%; max-width:100%; border-radius:12px; background:transparent;'
      },
      [
        'blockquote',
        {
          class: 'twitter-tweet',
          'data-lang': 'en',
          ...(isDark ? { 'data-theme': 'dark' } : {})
        },
        [
          'a',
          { href: embedUrl },
          embedUrl
        ]
      ]
    ];
  },
  addNodeView() {
    return ({ HTMLAttributes }) => {
      if (typeof window !== 'undefined' && window.twttr && window.twttr.widgets) {
        setTimeout(() => {
          window.twttr.widgets.load();
        }, 0);
      }
      const container = document.createElement('div');
      // Check for dark mode
      const isDark = typeof document !== 'undefined' && document.body.classList.contains('dark');
      // x.com linklerini twitter.com'a çevir
      let embedUrl = HTMLAttributes.url;
      if (embedUrl && embedUrl.includes('x.com/')) {
        embedUrl = embedUrl.replace('x.com/', 'twitter.com/');
      }
      container.innerHTML = `<div class="twitter-embed-wrapper" style="margin:16px 0; width:100%; max-width:100%; border-radius:12px; background:transparent;">
        <blockquote class="twitter-tweet" data-lang="en"${isDark ? ' data-theme=\"dark\"' : ''}><a href="${embedUrl}">${embedUrl}</a></blockquote>
      </div>`;
      return { dom: container };
    };
  }
});

const Iframe = Node.create({
  name: 'iframe',
  group: 'block',
  atom: true,
  addAttributes() {
    return {
      src: { default: null },
      width: { default: '560' },
      height: { default: '315' },
      allowfullscreen: { default: true },
    };
  },
  parseHTML() {
    return [
      {
        tag: 'iframe[src*="youtube.com/embed/"]',
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      { class: 'yt-embed-wrapper' },
      ['iframe', mergeAttributes(HTMLAttributes, {
        frameborder: '0',
        allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
        title: 'YouTube video player',
      })],
    ];
  },
});

const ArticleForm = ({ articleData, onSubmit, isEditing = false, formError, setFormError }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [currentCoverImageUrl, setCurrentCoverImageUrl] = useState('');
  const [status, setStatus] = useState('draft');
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: false, allowBase64: false }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 hover:underline',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder: 'Makale içeriğinizi buraya yazın... Uzun makaleler yazabilir, başlıklar ekleyebilir, resimler ve tablolar kullanabilirsiniz.',
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
      Highlight,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Table.configure({
        resizable: false,
        HTMLAttributes: {
          class: 'custom-table',
          style: 'width: 100%;',
        },
      }),
      TableRow.configure({
        HTMLAttributes: {
          class: 'custom-table-row',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'custom-table-cell',
          style: 'min-width: 40px; min-height: 30px; padding: 0;',
        },
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class: 'p-2 bg-gray-100 dark:bg-gray-700 font-semibold text-gray-700 dark:text-gray-300',
        },
      }),
      Color,
      TextStyle,
      Underline,
      Iframe,
      TwitterEmbed,
      // Yeni extension'lar
      FontFamily,
      FontSize,
      LineHeight,
      LetterSpacing,
      InlineCode,
      Math,
      MathInline,
      MathBlock,
      // Chemistry, // Temporarily disabled
      // ScientificNotation, // Temporarily disabled
      // CountdownTimer, // Temporarily disabled
      AutoSave.configure({
        delay: 5000, // 5 saniye
        saveFunction: (content) => {
          // Otomatik kaydetme fonksiyonu
          console.log('Auto saving content...', content);
          // Burada API'ye kaydetme işlemi yapılabilir
        },
        enabled: true,
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'min-h-[600px] p-6 rounded-lg bg-white dark:bg-gray-800 focus:outline-none prose prose-gray dark:prose-invert max-w-none text-gray-900 dark:text-gray-100 w-full overflow-wrap-anywhere',
      },
    },
  });

  useEffect(() => {
    if (isEditing && articleData) {
      setTitle(articleData.title || '');
      setDescription(articleData.description || '');
      setCurrentCoverImageUrl(articleData.coverImage || '');
      setStatus(articleData.status || 'draft');
      setCategories(articleData.categories || []);
      setImagePreview(articleData.coverImage || '');
      if (editor && articleData.content) {
        editor.commands.setContent(articleData.content);
      }
    } else {
      setTitle('');
      setDescription('');
      setCoverImageFile(null);
      setCurrentCoverImageUrl('');
      setStatus('draft');
      setCategories([]);
      setImagePreview('');
      if (editor) {
        editor.commands.clearContent();
      }
    }
  }, [isEditing, articleData, editor]);

  // Load KaTeX only when needed for math rendering
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.katex) {
      // Check if KaTeX is actually needed by looking for math content
      const hasMathContent = editor?.getHTML().includes('math-block') || 
                           editor?.getHTML().includes('math-inline');
      
      if (hasMathContent || editor?.isActive('math')) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js';
        script.onload = () => {
          console.log('KaTeX loaded successfully');
        };
        script.onerror = () => {
          console.warn('Failed to load KaTeX from CDN');
        };
        document.head.appendChild(script);

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css';
        document.head.appendChild(link);
      }
    }
  }, [editor]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setFormError('Dosya boyutu 5MB\'dan büyük olamaz.');
        e.target.value = null;
        return;
      }
      if (!file.type.startsWith('image/')) {
        setFormError('Lütfen geçerli bir resim dosyası seçin.');
        e.target.value = null;
        return;
      }
      setCoverImageFile(file);
      setFormError('');
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setCoverImageFile(null);
      setImagePreview(currentCoverImageUrl || '');
    }
  };

  const handleUploadCoverImage = useCallback(async () => {
    if (!coverImageFile) {
      return currentCoverImageUrl || '';
    }
    setIsUploading(true);
    setFormError('');
    try {
      // FormData kullanarak dosyayı doğrudan backend'e gönder
      const formData = new FormData();
      formData.append('coverImage', coverImageFile);
      
      const response = await api.post('/upload/cover-direct', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const { accessUrl } = response.data;
      setCurrentCoverImageUrl(accessUrl);
      setIsUploading(false);
      return accessUrl;
    } catch (err) {
      console.error('Kapak resmi yüklenirken hata:', err);
      const uploadErrorMessage = err.response?.data?.message || err.message || 'Kapak resmi yüklenemedi.';
      setFormError(`Resim Yükleme Hatası: ${uploadErrorMessage}`);
      setIsUploading(false);
      throw new Error(uploadErrorMessage);
    }
  }, [coverImageFile, currentCoverImageUrl, setFormError]);

  const handleImageUpload = async () => {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async () => {
        const file = input.files[0];
        if (file) {
          const presignedResponse = await api.post('/upload/content-image', {
            fileName: file.name,
            contentType: file.type,
          });
          const { uploadUrl, accessUrl } = presignedResponse.data;
          await fetch(uploadUrl, {
            method: 'PUT',
            body: file,
            headers: { 'Content-Type': file.type },
          });
          resolve(accessUrl);
        }
      };
      input.click();
    });
  };

  const addImage = async () => {
    const url = await handleImageUpload();
    if (url && editor) {
      const altText = window.prompt('Resim için alt metin girin (erişilebilirlik için):');
      editor.chain().focus().setImage({ 
        src: url, 
        alt: altText || '',
        title: altText || ''
      }).run();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !editor || editor.isEmpty) {
      setFormError('Başlık ve İçerik alanları boş bırakılamaz.');
      return;
    }
    setIsSubmitting(true);
    setFormError('');
    try {
      let finalCoverImageUrl = currentCoverImageUrl;
      if (coverImageFile) {
        finalCoverImageUrl = await handleUploadCoverImage();
      }
      const payload = {
        title: title.trim(),
        description: description.trim(),
        content: editor.getHTML(),
        coverImage: finalCoverImageUrl,
        status,
        categories
      };
      await onSubmit(payload);
    } catch (err) {
      console.error('Makale formu gönderilirken hata:', err);
      if (!formError && !isUploading) {
        setFormError(err.message || 'Makale kaydedilemedi. Lütfen tüm alanları kontrol edin.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const inputClass = "block w-full px-4 py-2.5 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors sm:text-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {formError && (
        <div className="p-3 mb-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg text-sm">
          {formError}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
        <div className="flex flex-col">
          <textarea
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            rows="2"
            maxLength="100"
            className={`${inputClass} flex-1 resize-none`}
            placeholder="Etkileyici bir başlık girin"
          />
          <div className="text-right text-xs text-gray-500 dark:text-gray-400 mt-1">
            {title.length}/100
          </div>
        </div>
        <div className="flex flex-col">
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            maxLength="100"
            className={`${inputClass} flex-1`}
            placeholder="Makalenizin kısa bir özeti (isteğe bağlı)"
          />
          <div className="text-right text-xs text-gray-500 dark:text-gray-400 mt-1">
            {description.length}/100
          </div>
        </div>
        <div className="flex flex-col">
          <select
            id="categories"
            multiple
            value={categories}
            onChange={(e) => {
              const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
              setCategories(selectedOptions);
            }}
            className={`${inputClass} flex-1 min-h-[120px]`}
          >
            <option value="sanat">Sanat</option>
            <option value="felsefe">Felsefe</option>
            <option value="teknoloji">Teknoloji</option>
            <option value="bilim">Bilim</option>
            <option value="tarih">Tarih</option>
            <option value="edebiyat">Edebiyat</option>
            <option value="siyaset">Siyaset</option>
            <option value="ekonomi">Ekonomi</option>
            <option value="spor">Spor</option>
            <option value="sağlık">Sağlık</option>
            <option value="eğitim">Eğitim</option>
            <option value="çevre">Çevre</option>
            <option value="sosyoloji">Sosyoloji</option>
            <option value="psikoloji">Psikoloji</option>
            <option value="din">Din</option>
            <option value="müzik">Müzik</option>
            <option value="sinema">Sinema</option>
            <option value="seyahat">Seyahat</option>
            <option value="yemek">Yemek</option>
          </select>
        </div>
      </div>
      <div>
        <label className={labelClass}>İçerik</label>
        <div className="flex gap-4 max-w-full">
          {/* Sticky Sidebar Toolbar */}
          <div className="sticky top-4 h-fit w-60 bg-gray-50 dark:bg-gray-700 rounded-lg p-2 flex flex-col gap-2 flex-shrink-0">
            <div className="grid grid-cols-3 gap-1">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${editor?.isActive('bold') ? 'bg-gray-200 dark:bg-gray-600 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}
              title="Kalın"
            >
              <FaBold />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${editor?.isActive('italic') ? 'bg-gray-200 dark:bg-gray-600 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}
              title="İtalik"
            >
              <FaItalic />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${editor?.isActive('heading', { level: 1 }) ? 'bg-gray-200 dark:bg-gray-600 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}
              title="Başlık 1"
            >
              <FaHeading />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${editor?.isActive('heading', { level: 2 }) ? 'bg-gray-200 dark:bg-gray-600 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}
              title="Başlık 2"
            >
              <FaHeading />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${editor?.isActive('heading', { level: 3 }) ? 'bg-gray-200 dark:bg-gray-600 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}
              title="Başlık 3"
            >
              <FaHeading />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${editor?.isActive('underline') ? 'bg-gray-200 dark:bg-gray-600 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}
              title="Altı Çizili"
            >
              <FaUnderline />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${editor?.isActive('strike') ? 'bg-gray-200 dark:bg-gray-600 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}
              title="Üstü Çizili"
            >
              <FaStrikethrough />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${editor?.isActive('bulletList') ? 'bg-gray-200 dark:bg-gray-600 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}
              title="Madde İşaretli Liste"
            >
              <FaListUl />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${editor?.isActive('orderedList') ? 'bg-gray-200 dark:bg-gray-600 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}
              title="Numaralı Liste"
            >
              <FaListOl />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleTaskList().run()}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${editor?.isActive('taskList') ? 'bg-gray-200 dark:bg-gray-600 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}
              title="Görev Listesi"
            >
              <FaTasks />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${editor?.isActive('blockquote') ? 'bg-gray-200 dark:bg-gray-600 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}
              title="Alıntı"
            >
              <FaQuoteLeft />
            </button>
            <button
              type="button"
              onClick={() => {
                const color = window.prompt('Metin rengi (örn: #ff0000):');
                if (color) {
                  editor.chain().focus().setColor(color).run();
                }
              }}
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
              title="Metin Rengi"
            >
              <FaPalette />
            </button>
            <button
              type="button"
              onClick={() => {
                const color = window.prompt('Arka plan rengi (örn: #ff0000):');
                if (color) {
                  editor.chain().focus().setHighlight({ color }).run();
                }
              }}
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
              title="Arka Plan Rengi"
            >
              <FaFlask />
            </button>
            <div className="relative inline-block">
              <button
                type="button"
                onClick={() => {
                  const rows = window.prompt('Satır sayısı:', '3');
                  const cols = window.prompt('Sütun sayısı:', '3');
                  if (rows && cols) {
                    editor.chain().focus().insertTable({ 
                      rows: parseInt(rows), 
                      cols: parseInt(cols), 
                      withHeaderRow: true 
                    }).run();
                  }
                }}
                className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 flex items-center gap-1"
                title="Tablo Ekle"
              >
                <FaTable />
                <FaChevronDown className="text-xs" />
              </button>
              {editor?.isActive('table') && (
                <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 z-10">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => editor.chain().focus().addColumnBefore().run()}
                      disabled={!editor?.can().addColumnBefore()}
                      className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 text-sm"
                      title="Sütun Ekle (Sol)"
                    >
                      ← Sütun Ekle
                    </button>
                    <button
                      type="button"
                      onClick={() => editor.chain().focus().addColumnAfter().run()}
                      disabled={!editor?.can().addColumnAfter()}
                      className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 text-sm"
                      title="Sütun Ekle (Sağ)"
                    >
                      Sütun Ekle →
                    </button>
                    <button
                      type="button"
                      onClick={() => editor.chain().focus().addRowBefore().run()}
                      disabled={!editor?.can().addRowBefore()}
                      className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 text-sm"
                      title="Satır Ekle (Üst)"
                    >
                      ↑ Satır Ekle
                    </button>
                    <button
                      type="button"
                      onClick={() => editor.chain().focus().addRowAfter().run()}
                      disabled={!editor?.can().addRowAfter()}
                      className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 text-sm"
                      title="Satır Ekle (Alt)"
                    >
                      Satır Ekle ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => editor.chain().focus().deleteColumn().run()}
                      disabled={!editor?.can().deleteColumn()}
                      className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 text-sm"
                      title="Sütun Sil"
                    >
                      Sütun Sil
                    </button>
                    <button
                      type="button"
                      onClick={() => editor.chain().focus().deleteRow().run()}
                      disabled={!editor?.can().deleteRow()}
                      className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 text-sm"
                      title="Satır Sil"
                    >
                      Satır Sil
                    </button>
                    <button
                      type="button"
                      onClick={() => editor.chain().focus().deleteTable().run()}
                      disabled={!editor?.can().deleteTable()}
                      className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 text-sm col-span-2"
                      title="Tabloyu Sil"
                    >
                      Tabloyu Sil
                    </button>
                  </div>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
              title="Yatay Çizgi"
            >
              <FaMinus />
            </button>
            <button
              type="button"
              onClick={addImage}
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
              title="Resim Ekle"
            >
              <FaImage />
            </button>
            {/* Video Ekle Butonu */}
            <button
              type="button"
              onClick={() => {
                const url = window.prompt('YouTube video linkini girin:');
                if (!url) return;
                // Sadece YouTube linkleri için çalışsın
                const ytMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/);
                if (!ytMatch) {
                  alert('Sadece geçerli bir YouTube video linki ekleyebilirsiniz!');
                  return;
                }
                const videoId = ytMatch[1];
                if (editor) {
                  editor.commands.focus();
                  editor.commands.insertContent({
                    type: 'iframe',
                    attrs: {
                      src: `https://www.youtube.com/embed/${videoId}`,
                      width: '560',
                      height: '315',
                      allowfullscreen: 'true',
                    },
                  });
                }
              }}
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
              title="YouTube Videosu Ekle"
            >
              <FaYoutube />
            </button>
            {/* Twitter Embed Butonu */}
            <button
              type="button"
              onClick={() => {
                const url = window.prompt('Tweet linkini girin:');
                if (!url) return;
                // Sadece geçerli Twitter veya X status URL'si için çalışsın
                const twMatch = url.match(/^https?:\/\/(www\.)?(twitter\.com|x\.com)\/[A-Za-z0-9_]+\/status\/\d+/);
                if (!twMatch) {
                  alert('Sadece geçerli bir Tweet linki ekleyebilirsiniz!');
                  return;
                }
                if (editor) {
                  editor.commands.focus();
                  editor.commands.insertContent({
                    type: 'twitterEmbed',
                    attrs: { url },
                  });
                }
              }}
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
              title="Tweet Ekle"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em">
                <g>
                  <path d="M22.46 5.924c-.793.352-1.646.59-2.54.697a4.48 4.48 0 001.965-2.482 8.97 8.97 0 01-2.828 1.082 4.48 4.48 0 00-7.634 4.086A12.73 12.73 0 013.15 4.868a4.48 4.48 0 001.39 5.973 4.47 4.47 0 01-2.03-.56v.056a4.48 4.48 0 003.6 4.392 4.5 4.5 0 01-2.025.077 4.48 4.48 0 004.183 3.11A8.99 8.99 0 012 19.54a12.7 12.7 0 006.92 2.03c8.302 0 12.846-6.877 12.846-12.846 0-.195-.004-.39-.013-.583A9.23 9.23 0 0024 4.59a8.98 8.98 0 01-2.54.697z" />
                </g>
              </svg>
            </button>
            <button
              type="button"
              onClick={() => {
                const url = window.prompt('URL:');
                if (url) {
                  editor.chain().focus().setLink({ href: url }).run();
                }
              }}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${editor?.isActive('link') ? 'bg-gray-200 dark:bg-gray-600 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}
              title="Bağlantı Ekle"
            >
              <FaLink />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().unsetLink().run()}
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
              title="Bağlantıyı Kaldır"
            >
              <FaUnlink />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${editor?.isActive({ textAlign: 'left' }) ? 'bg-gray-200 dark:bg-gray-600 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}
              title="Sola Hizala"
            >
              <FaAlignLeft />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${editor?.isActive({ textAlign: 'center' }) ? 'bg-gray-200 dark:bg-gray-600 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}
              title="Ortala"
            >
              <FaAlignCenter />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${editor?.isActive({ textAlign: 'right' }) ? 'bg-gray-200 dark:bg-gray-600 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}
              title="Sağa Hizala"
            >
              <FaAlignRight />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${editor?.isActive('codeBlock') ? 'bg-gray-200 dark:bg-gray-600 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}
              title="Kod Bloğu"
            >
              <FaCode />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHighlight().run()}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${editor?.isActive('highlight') ? 'bg-gray-200 dark:bg-gray-600 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}
              title="Vurgula"
            >
              <FaHighlighter />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().undo().run()}
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
              title="Geri Al"
            >
              <FaUndo />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().redo().run()}
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
              title="İleri Al"
            >
              <FaRedo />
            </button>
            
            {/* Yeni Özellik Butonları */}
            
            {/* Font Ailesi Seçimi */}
            <div className="relative col-span-3">
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    editor.chain().focus().setFontFamily(e.target.value).run();
                  }
                }}
                className="w-full p-1 rounded bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs"
                title="Font Ailesi"
              >
                <option value="">Font</option>
                <option value="Arial, sans-serif">Arial</option>
                <option value="Times New Roman, serif">Times New Roman</option>
                <option value="Courier New, monospace">Courier New</option>
                <option value="Georgia, serif">Georgia</option>
                <option value="Verdana, sans-serif">Verdana</option>
                <option value="Trebuchet MS, sans-serif">Trebuchet MS</option>
                <option value="Impact, sans-serif">Impact</option>
                <option value="Comic Sans MS, cursive">Comic Sans MS</option>
              </select>
            </div>

            {/* Font Boyutu */}
            <div className="relative col-span-3">
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    editor.chain().focus().setFontSize(e.target.value).run();
                  }
                }}
                className="w-full p-1 rounded bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs"
                title="Font Boyutu"
              >
                <option value="">Boyut</option>
                <option value="8px">8px</option>
                <option value="10px">10px</option>
                <option value="12px">12px</option>
                <option value="14px">14px</option>
                <option value="16px">16px</option>
                <option value="18px">18px</option>
                <option value="20px">20px</option>
                <option value="24px">24px</option>
                <option value="28px">28px</option>
                <option value="32px">32px</option>
                <option value="36px">36px</option>
                <option value="48px">48px</option>
                <option value="64px">64px</option>
                <option value="72px">72px</option>
              </select>
            </div>

            {/* Satır Yüksekliği */}
            <div className="relative col-span-3">
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    editor.chain().focus().setLineHeight(e.target.value).run();
                  }
                }}
                className="w-full p-1 rounded bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs"
                title="Satır Yüksekliği"
              >
                <option value="">Satır</option>
                <option value="1">1.0</option>
                <option value="1.2">1.2</option>
                <option value="1.4">1.4</option>
                <option value="1.6">1.6</option>
                <option value="1.8">1.8</option>
                <option value="2">2.0</option>
                <option value="2.5">2.5</option>
                <option value="3">3.0</option>
              </select>
            </div>

            {/* Harf Aralığı */}
            <div className="relative col-span-3">
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    editor.chain().focus().setLetterSpacing(e.target.value).run();
                  }
                }}
                className="w-full p-1 rounded bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs"
                title="Harf Aralığı"
              >
                <option value="">Aralık</option>
                <option value="normal">Normal</option>
                <option value="0.5px">0.5px</option>
                <option value="1px">1px</option>
                <option value="1.5px">1.5px</option>
                <option value="2px">2px</option>
                <option value="3px">3px</option>
                <option value="4px">4px</option>
                <option value="5px">5px</option>
              </select>
            </div>

            {/* Inline Kod */}
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleInlineCode().run()}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${editor?.isActive('inlineCode') ? 'bg-gray-200 dark:bg-gray-600 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}
              title="Inline Kod"
            >
              <FaCode />
            </button>

            {/* Matematik Formülü */}
            <button
              type="button"
              onClick={() => {
                const isBlock = window.confirm('Tamam = Blok ($$...$$), İptal = Inline ($...$)');
                const formula = window.prompt('LaTeX formülü (örn: \\mathbb{N} = \\{0,1,2,3,\\dots\\})');
                if (formula) {
                  if (isBlock) {
                    editor.chain().focus().setMathBlock({ latex: formula }).run();
                  } else {
                    editor.chain().focus().setMathInline({ latex: formula }).run();
                  }
                }
              }}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${editor?.isActive('mathInline') || editor?.isActive('mathBlock') ? 'bg-gray-200 dark:bg-gray-600 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}
              title="Matematik (π)"
            >
              <span style={{ fontWeight: 700, fontFamily: 'serif' }}>π</span>
            </button>

            {/* Kimyasal Formül - Temporarily disabled
            <button
              type="button"
              onClick={() => {
                const formula = window.prompt('Kimyasal formülü girin (örn: H2O):');
                const name = window.prompt('Kimyasal maddenin adını girin (örn: Su):');
                if (formula) {
                  editor.chain().focus().setChemistry({ formula, name: name || '' }).run();
                }
              }}
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
              title="Kimyasal Formül"
            >
              <FaFlask />
            </button>
            */}

            {/* Bilimsel Gösterim - Temporarily disabled
            <button
              type="button"
              onClick={() => {
                const coefficient = window.prompt('Katsayıyı girin (örn: 1.5):');
                const exponent = window.prompt('Üssü girin (örn: 6):');
                const unit = window.prompt('Birimi girin (örn: m):');
                if (coefficient && exponent) {
                  editor.chain().focus().setScientificNotation({ 
                    coefficient, 
                    exponent, 
                    unit: unit || '' 
                  }).run();
                }
              }}
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
              title="Bilimsel Gösterim"
            >
              <FaSuperscript />
            </button>
            */}

            {/* Countdown Timer - Temporarily disabled
            <button
              type="button"
              onClick={() => {
                const title = window.prompt('Timer başlığını girin (örn: Yılbaşı):');
                const targetDate = window.prompt('Hedef tarihi girin (YYYY-MM-DD HH:MM):');
                if (title && targetDate) {
                  editor.chain().focus().setCountdownTimer({ 
                    targetDate, 
                    title,
                    showDays: true,
                    showHours: true,
                    showMinutes: true,
                    showSeconds: true
                  }).run();
                }
              }}
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
              title="Countdown Timer"
            >
              <FaClock />
            </button>
            */}

            {/* Kod Bloğu Kopyalama */}
            <button
              type="button"
              onClick={() => {
                const codeBlocks = document.querySelectorAll('pre code');
                if (codeBlocks.length > 0) {
                  const lastCodeBlock = codeBlocks[codeBlocks.length - 1];
                  navigator.clipboard.writeText(lastCodeBlock.textContent || '');
                  // Kopyalandı göstergesi
                  const button = event.target.closest('button');
                  const originalTitle = button.title;
                  button.title = 'Kopyalandı!';
                  button.classList.add('bg-green-200', 'text-green-800');
                  setTimeout(() => {
                    button.title = originalTitle;
                    button.classList.remove('bg-green-200', 'text-green-800');
                  }, 2000);
                }
              }}
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
              title="Kod Bloğunu Kopyala"
            >
              <FaCopy />
            </button>
            </div>
          </div>
          
          {/* Editor Content Area */}
          <div className="flex-1 rounded-lg bg-white dark:bg-gray-800 min-w-0 overflow-hidden">
            <EditorContent 
              editor={editor} 
              className="font-sans min-h-[600px] p-6 w-full max-w-full overflow-wrap-anywhere" 
              style={{ 
                fontFamily: 'Inter, sans-serif',
                '--tiptap-table-header-bg': '#f8fafc',
                '--tiptap-table-cell-padding': '0.5rem',
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                maxWidth: '100%'
              }} 
            />
          </div>
        </div>
      </div>
      <div>
        <label htmlFor="coverImage" className={labelClass}>Kapak Görseli</label>
        <input
          type="file"
          id="coverImage"
          accept="image/png, image/jpeg, image/webp, image/gif"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-blue-900/20 file:text-blue-700 dark:file:text-blue-400 hover:file:bg-blue-100 dark:hover:file:bg-blue-900/30 transition-colors cursor-pointer"
        />
        {(isUploading) && <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">Kapak resmi yükleniyor, lütfen bekleyin...</p>}
        {imagePreview && !isUploading && (
          <div className="mt-3 p-2 rounded-lg inline-block">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Görsel Önizleme:</p>
            <img src={imagePreview} alt="Kapak Görseli Önizleme" className="max-h-48 rounded-md shadow-sm" />
          </div>
        )}
         {isEditing && currentCoverImageUrl && !coverImageFile && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Mevcut resim: <a href={currentCoverImageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 dark:text-blue-400 hover:underline">{currentCoverImageUrl.substring(currentCoverImageUrl.lastIndexOf('/') + 1)}</a></p>
        )}
      </div>
      <div>
        <label htmlFor="status" className={labelClass}>Yayın Durumu</label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className={`${inputClass} appearance-none`}
        >
          <option value="draft">Taslak Olarak Kaydet</option>
          <option value="published">Şimdi Yayınla</option>
          <option value="unlisted">Liste Dışı (Yayında ama kart olarak gösterilmiyor)</option>
        </select>
      </div>
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isSubmitting || isUploading}
          className="flex items-center justify-center min-w-[120px] px-6 py-2.5 shadow-md text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
        >
          {(isSubmitting || isUploading) ? (
            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (isEditing ? 'Makaleyi Güncelle' : 'Makaleyi Oluştur')}
        </button>
      </div>
    </form>
  );
};

export default ArticleForm;
