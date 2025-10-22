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
import { FaBold, FaItalic, FaHeading, FaListUl, FaListOl, FaImage, FaUndo, FaRedo, FaLink, FaUnlink, FaAlignLeft, FaAlignCenter, FaAlignRight, FaCode, FaHighlighter, FaTasks, FaQuoteLeft, FaTable, FaFont, FaPalette, FaUnderline, FaStrikethrough, FaMinus, FaChevronDown, FaYoutube, FaTextHeight, FaArrowsAltH, FaCalculator, FaClock, FaFlask, FaSuperscript, FaCopy, FaAlignJustify, FaFilm } from 'react-icons/fa';

// Custom Extensions
import { FontFamily } from '../../extensions/FontFamilyExtension';
import { FontSize } from '../../extensions/FontSizeExtension';
import { LineHeight } from '../../extensions/LineHeightExtension';
import { LetterSpacing } from '../../extensions/LetterSpacingExtension';
import { InlineCode } from '../../extensions/InlineCodeExtension';
import { Math } from '../../extensions/MathExtension';
import { Chemistry } from '../../extensions/ChemistryExtension';
import { ScientificNotation } from '../../extensions/ScientificNotationExtension';
import { CountdownTimer } from '../../extensions/CountdownTimerExtension';
import { AutoSave } from '../../extensions/AutoSaveExtension';
import { DropCap } from '../../extensions/DropCapExtension';

// Styles
import '../../extensions/editor-extensions.css';

// Basit bir WYSIWYG editÃ¶r veya Markdown editÃ¶rÃ¼ yerine ÅŸimdilik textarea kullanÄ±yoruz.
// Ã–nerilen kÃ¼tÃ¼phaneler: react-quill, Tiptap, Editor.js, react-markdown-editor-lite

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

// Custom Image extension to support data-source attribute (image credit)
const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      source: {
        default: '',
        parseHTML: element => element.getAttribute('data-source') || '',
        renderHTML: attributes => {
          if (!attributes.source) return {};
          return { 'data-source': attributes.source };
        },
      },
    };
  },
  renderHTML({ HTMLAttributes }) {
    // keep default <img /> rendering while preserving data-source
    return ['img', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
  },
});

// Custom Tiptap Video extension (HTML5 video)
const Video = Node.create({
  name: 'video',
  group: 'block',
  atom: true,
  selectable: true,
  draggable: true,
  addAttributes() {
    return {
      src: { default: null },
      controls: { default: true },
      width: { default: '100%' },
      height: { default: null },
      poster: { default: null },
    };
  },
  parseHTML() {
    return [
      { tag: 'video[src]' },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      'video',
      mergeAttributes(HTMLAttributes, { controls: true, style: 'max-width:100%; border-radius:12px; margin:16px 0;' }),
    ];
  },
});

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
    // x.com linklerini twitter.com'a Ã§evir
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
      // x.com linklerini twitter.com'a Ã§evir
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

  // Upload a content image to backend storage (used by picker and paste)
  const uploadContentImageFile = async (file) => {
    try {
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
      return accessUrl;
    } catch (err) {
      console.error('Resim yÃ¼klenirken hata:', err);
      const uploadErrorMessage = err.response?.data?.message || err.message || 'Resim yÃ¼klenemedi.';
      alert('Resim yÃ¼klenirken hata: ' + uploadErrorMessage);
      throw new Error(uploadErrorMessage);
    }
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      CustomImage.configure({ inline: false, allowBase64: false }),
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
        placeholder: 'Makale iÃ§eriÄŸinizi buraya yazÄ±n... Uzun makaleler yazabilir, baÅŸlÄ±klar ekleyebilir, resimler ve tablolar kullanabilirsiniz.',
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
      Highlight.configure({
        HTMLAttributes: {
          style: 'background-color: rgb(68, 0, 255); border-radius: 0px; padding: 0 2px;',
        },
      }),
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
      Video,
      // Yeni extension'lar
      FontFamily,
      FontSize,
      LineHeight,
      LetterSpacing,
      InlineCode,
      // Math, // Temporarily disabled
      // Chemistry, // Temporarily disabled
      // ScientificNotation, // Temporarily disabled
      // CountdownTimer, // Temporarily disabled
      AutoSave.configure({
        delay: 5000, // 5 saniye
        saveFunction: (content) => {
          // Otomatik kaydetme fonksiyonu
          console.log('Auto saving content...', content);
          // Burada API'ye kaydetme iÅŸlemi yapÄ±labilir
        },
        enabled: true,
      }),
      DropCap,
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'min-h-[600px] p-6 rounded-lg bg-white dark:bg-gray-800 focus:outline-none prose prose-gray dark:prose-invert max-w-none text-gray-900 dark:text-gray-100 w-full overflow-wrap-anywhere',
      },
      handlePaste: (view, event, slice) => {
        try {
          const dt = event.clipboardData || window.clipboardData;
          if (!dt) return false;
          const files = Array.from(dt.files || []);
          const imageFiles = files.filter(f => f.type && f.type.startsWith('image/'));
          if (imageFiles.length === 0) return false;

          event.preventDefault();
          (async () => {
            for (const file of imageFiles) {
              try {
                const url = await uploadContentImageFile(file);
                const altText = window.prompt('Resim iÃ§in alt metin girin (eriÅŸilebilirlik iÃ§in):', '') || '';
                const sourceText = window.prompt('GÃ¶rsel KaynaÄŸÄ± (Ã¶r. site/kiÅŸi adÄ± veya URL):', '') || '';
                editor.chain().focus().setImage({
                  src: url,
                  alt: altText,
                  title: altText,
                  source: sourceText,
                }).run();
              } catch (e) {
                console.error('Pasted image upload failed:', e);
              }
            }
          })();

          return true;
        } catch (e) {
          console.error('handlePaste error:', e);
          return false;
        }
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
        setFormError('Dosya boyutu 5MB\'dan bÃ¼yÃ¼k olamaz.');
        e.target.value = null;
        return;
      }
      if (!file.type.startsWith('image/')) {
        setFormError('LÃ¼tfen geÃ§erli bir resim dosyasÄ± seÃ§in.');
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
      // FormData kullanarak dosyayÄ± doÄŸrudan backend'e gÃ¶nder
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
      console.error('Kapak resmi yÃ¼klenirken hata:', err);
      const uploadErrorMessage = err.response?.data?.message || err.message || 'Kapak resmi yÃ¼klenemedi.';
      setFormError(`Resim YÃ¼kleme HatasÄ±: ${uploadErrorMessage}`);
      setIsUploading(false);
      throw new Error(uploadErrorMessage);
    }
  }, [coverImageFile, currentCoverImageUrl, setFormError]);

  const addImageWithSource = async () => {
    const url = await handleImageUpload();
    if (url && editor) {
      const altText = window.prompt('Resim için alt metin girin (erişilebilirlik için):', '') || '';
      const sourceText = window.prompt('Görsel Kaynağı (ör. site/kişi adı veya URL):', '') || '';
      editor.chain().focus().setImage({
        src: url,
        alt: altText,
        title: altText,
        source: sourceText,
      }).run();
    }
  };

  const editImageSource = () => {
    if (!editor) return;
    const current = editor.getAttributes('image')?.source || '';
    const next = window.prompt('Görsel Kaynağı (ör. site/kişi adı veya URL):', current);
    if (next === null) return; // cancelled
    editor.chain().focus().updateAttributes('image', { source: next }).run();
  };

  const handleImageUpload = async () => {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async () => {
        const file = input.files[0];
        if (file) {
          try {
            const accessUrl = await uploadContentImageFile(file);
            resolve(accessUrl);
          } catch (e) {
            resolve(null);
          }
        } else {
          resolve(null);
        }
      };
      input.click();
    });
  };

  const addImage = async () => {
    const url = await handleImageUpload();
    if (url && editor) {
      const altText = window.prompt('Resim için alt metin girin (erişilebilirlik için):', '') || '';
      const sourceText = window.prompt('Görsel Kaynağı (ör. site/kişi adı veya URL):', '') || '';
      editor.chain().focus().setImage({ 
        src: url, 
        alt: altText,
        title: altText,
        source: sourceText,
      }).run();
    }
  };

  const addVideo = async () => {
    const url = await handleVideoUpload();
    if (url && editor) {
      editor.chain().focus().insertContent({ type: 'video', attrs: { src: url, controls: true } }).run();
    }
  };

  const handleVideoUpload = async () => {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'video/*';
      input.onchange = async () => {
        const file = input.files[0];
        if (file) {
          try {
            // Backend: /api/videos/upload endpointi ile presigned url al
            const presignedResponse = await api.post('/videos/upload', {
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
          } catch (err) {
            alert('Video yÃ¼klenirken hata oluÅŸtu: ' + (err?.response?.data?.message || err.message));
            resolve(null);
          }
        }
      };
      input.click();
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !editor || editor.isEmpty) {
      setFormError('BaÅŸlÄ±k ve Ä°Ã§erik alanlarÄ± boÅŸ bÄ±rakÄ±lamaz.');
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
      console.error('Makale formu gÃ¶nderilirken hata:', err);
      if (!formError && !isUploading) {
        setFormError(err.message || 'Makale kaydedilemedi. LÃ¼tfen tÃ¼m alanlarÄ± kontrol edin.');
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
            placeholder="Etkileyici bir baÅŸlÄ±k girin"
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
            placeholder="Makalenizin kÄ±sa bir Ã¶zeti (isteÄŸe baÄŸlÄ±)"
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
            <option value="saÄŸlÄ±k">SaÄŸlÄ±k</option>
            <option value="eÄŸitim">EÄŸitim</option>
            <option value="Ã§evre">Ã‡evre</option>
            <option value="sosyoloji">Sosyoloji</option>
            <option value="psikoloji">Psikoloji</option>
            <option value="din">Din</option>
            <option value="mÃ¼zik">MÃ¼zik</option>
            <option value="sinema">Sinema</option>
            <option value="seyahat">Seyahat</option>
            <option value="yemek">Yemek</option>
          </select>
        </div>
      </div>
      <div>
        <label className={labelClass}>Ä°Ã§erik</label>
        <div className="flex gap-4 max-w-full">
          {/* Sticky Sidebar Toolbar */}
          <div className="sticky top-4 h-fit w-60 bg-gray-50 dark:bg-gray-700 rounded-lg p-2 flex flex-col gap-2 flex-shrink-0">
            <div className="grid grid-cols-3 gap-1">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${editor?.isActive('bold') ? 'bg-gray-200 dark:bg-gray-600 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}
              title="KalÄ±n"
            >
              <FaBold />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${editor?.isActive('italic') ? 'bg-gray-200 dark:bg-gray-600 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}
              title="Ä°talik"
            >
              <FaItalic />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleDropCap().run()}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${editor?.isActive('dropCap') ? 'bg-gray-200 dark:bg-gray-600 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}
              title="Drop Cap (BÃ¼yÃ¼k BaÅŸlangÄ±Ã§ Harfi)"
            >
              <span className="font-serif text-xl font-bold">A</span>
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${editor?.isActive('heading', { level: 1 }) ? 'bg-gray-200 dark:bg-gray-600 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}
              title="BaÅŸlÄ±k 1"
            >
              <FaHeading />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${editor?.isActive('heading', { level: 2 }) ? 'bg-gray-200 dark:bg-gray-600 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}
              title="BaÅŸlÄ±k 2"
            >
              <FaHeading />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${editor?.isActive('heading', { level: 3 }) ? 'bg-gray-200 dark:bg-gray-600 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}
              title="BaÅŸlÄ±k 3"
            >
              <FaHeading />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${editor?.isActive('underline') ? 'bg-gray-200 dark:bg-gray-600 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}
              title="AltÄ± Ã‡izili"
            >
              <FaUnderline />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${editor?.isActive('strike') ? 'bg-gray-200 dark:bg-gray-600 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}
              title="ÃœstÃ¼ Ã‡izili"
            >
              <FaStrikethrough />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${editor?.isActive('bulletList') ? 'bg-gray-200 dark:bg-gray-600 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}
              title="Madde Ä°ÅŸaretli Liste"
            >
              <FaListUl />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${editor?.isActive('orderedList') ? 'bg-gray-200 dark:bg-gray-600 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}
              title="NumaralÄ± Liste"
            >
              <FaListOl />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleTaskList().run()}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${editor?.isActive('taskList') ? 'bg-gray-200 dark:bg-gray-600 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}
              title="GÃ¶rev Listesi"
            >
              <FaTasks />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${editor?.isActive('blockquote') ? 'bg-gray-200 dark:bg-gray-600 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}
              title="AlÄ±ntÄ±"
            >
              <FaQuoteLeft />
            </button>
            <button
              type="button"
              onClick={() => {
                const color = window.prompt('Metin rengi (Ã¶rn: #ff0000):');
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
                const color = window.prompt('Arka plan rengi (Ã¶rn: #ff0000):');
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
                  const rows = window.prompt('SatÄ±r sayÄ±sÄ±:', '3');
                  const cols = window.prompt('SÃ¼tun sayÄ±sÄ±:', '3');
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
                      title="SÃ¼tun Ekle (Sol)"
                    >
                      â† SÃ¼tun Ekle
                    </button>
                    <button
                      type="button"
                      onClick={() => editor.chain().focus().addColumnAfter().run()}
                      disabled={!editor?.can().addColumnAfter()}
                      className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 text-sm"
                      title="SÃ¼tun Ekle (SaÄŸ)"
                    >
                      SÃ¼tun Ekle â†’
                    </button>
                    <button
                      type="button"
                      onClick={() => editor.chain().focus().addRowBefore().run()}
                      disabled={!editor?.can().addRowBefore()}
                      className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 text-sm"
                      title="SatÄ±r Ekle (Ãœst)"
                    >
                      â†‘ SatÄ±r Ekle
                    </button>
                    <button
                      type="button"
                      onClick={() => editor.chain().focus().addRowAfter().run()}
                      disabled={!editor?.can().addRowAfter()}
                      className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 text-sm"
                      title="SatÄ±r Ekle (Alt)"
                    >
                      SatÄ±r Ekle â†“
                    </button>
                    <button
                      type="button"
                      onClick={() => editor.chain().focus().deleteColumn().run()}
                      disabled={!editor?.can().deleteColumn()}
                      className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 text-sm"
                      title="SÃ¼tun Sil"
                    >
                      SÃ¼tun Sil
                    </button>
                    <button
                      type="button"
                      onClick={() => editor.chain().focus().deleteRow().run()}
                      disabled={!editor?.can().deleteRow()}
                      className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 text-sm"
                      title="SatÄ±r Sil"
                    >
                      SatÄ±r Sil
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
              title="Yatay Ã‡izgi"
            >
              <FaMinus />
            </button>
            <button
              type="button"
              onClick={addImageWithSource}
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
              title="Resim Ekle"
            >
              <FaImage />
            </button>
            <button
              type="button"
              onClick={editImageSource}
              className="px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm"
              title="Görsel Kaynağı Ekle/Düzenle"
            >
              Kaynak
            </button>
            <button
              type="button"
              onClick={addVideo}
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
              title="Video Ekle"
            >
              <FaFilm />
            </button>
            {/* Video Ekle Butonu */}
            <button
              type="button"
              onClick={() => {
                const url = window.prompt('YouTube video linkini girin:');
                if (!url) return;
                // Sadece YouTube linkleri iÃ§in Ã§alÄ±ÅŸsÄ±n
                const ytMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/);
                if (!ytMatch) {
                  alert('Sadece geÃ§erli bir YouTube video linki ekleyebilirsiniz!');
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
                // Sadece geÃ§erli Twitter veya X status URL'si iÃ§in Ã§alÄ±ÅŸsÄ±n
                const twMatch = url.match(/^https?:\/\/(www\.)?(twitter\.com|x\.com)\/[A-Za-z0-9_]+\/status\/\d+/);
                if (!twMatch) {
                  alert('Sadece geÃ§erli bir Tweet linki ekleyebilirsiniz!');
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
              title="BaÄŸlantÄ± Ekle"
            >
              <FaLink />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().unsetLink().run()}
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
              title="BaÄŸlantÄ±yÄ± KaldÄ±r"
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
              title="SaÄŸa Hizala"
            >
              <FaAlignRight />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${editor?.isActive('codeBlock') ? 'bg-gray-200 dark:bg-gray-600 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}
              title="Kod BloÄŸu"
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
              title="Ä°leri Al"
            >
              <FaRedo />
            </button>
            
            {/* Yeni Ã–zellik ButonlarÄ± */}
            
            {/* Font Ailesi SeÃ§imi */}
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

            {/* SatÄ±r YÃ¼ksekliÄŸi */}
            <div className="relative col-span-3">
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    editor.chain().focus().setLineHeight(e.target.value).run();
                  }
                }}
                className="w-full p-1 rounded bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs"
                title="SatÄ±r YÃ¼ksekliÄŸi"
              >
                <option value="">SatÄ±r</option>
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

            {/* Harf AralÄ±ÄŸÄ± */}
            <div className="relative col-span-3">
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    editor.chain().focus().setLetterSpacing(e.target.value).run();
                  }
                }}
                className="w-full p-1 rounded bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs"
                title="Harf AralÄ±ÄŸÄ±"
              >
                <option value="">AralÄ±k</option>
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

            {/* Matematik FormÃ¼lÃ¼ - Temporarily disabled
            <button
              type="button"
              onClick={() => {
                const formula = window.prompt('LaTeX matematik formÃ¼lÃ¼nÃ¼ girin (Ã¶rn: x^2 + y^2 = z^2):');
                if (formula) {
                  editor.chain().focus().setMath({ content: formula, display: 'block' }).run();
                }
              }}
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
              title="Matematik FormÃ¼lÃ¼"
            >
              <FaSuperscript />
            </button>
            */}

            {/* Kimyasal FormÃ¼l - Temporarily disabled
            <button
              type="button"
              onClick={() => {
                const formula = window.prompt('Kimyasal formÃ¼lÃ¼ girin (Ã¶rn: H2O):');
                const name = window.prompt('Kimyasal maddenin adÄ±nÄ± girin (Ã¶rn: Su):');
                if (formula) {
                  editor.chain().focus().setChemistry({ formula, name: name || '' }).run();
                }
              }}
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
              title="Kimyasal FormÃ¼l"
            >
              <FaFlask />
            </button>
            */}

            {/* Bilimsel GÃ¶sterim - Temporarily disabled
            <button
              type="button"
              onClick={() => {
                const coefficient = window.prompt('KatsayÄ±yÄ± girin (Ã¶rn: 1.5):');
                const exponent = window.prompt('ÃœssÃ¼ girin (Ã¶rn: 6):');
                const unit = window.prompt('Birimi girin (Ã¶rn: m):');
                if (coefficient && exponent) {
                  editor.chain().focus().setScientificNotation({ 
                    coefficient, 
                    exponent, 
                    unit: unit || '' 
                  }).run();
                }
              }}
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
              title="Bilimsel GÃ¶sterim"
            >
              <FaSuperscript />
            </button>
            */}

            {/* Countdown Timer - Temporarily disabled
            <button
              type="button"
              onClick={() => {
                const title = window.prompt('Timer baÅŸlÄ±ÄŸÄ±nÄ± girin (Ã¶rn: YÄ±lbaÅŸÄ±):');
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

            {/* Kod BloÄŸu Kopyalama */}
            <button
              type="button"
              onClick={() => {
                const codeBlocks = document.querySelectorAll('pre code');
                if (codeBlocks.length > 0) {
                  const lastCodeBlock = codeBlocks[codeBlocks.length - 1];
                  navigator.clipboard.writeText(lastCodeBlock.textContent || '');
                  // KopyalandÄ± gÃ¶stergesi
                  const button = event.target.closest('button');
                  const originalTitle = button.title;
                  button.title = 'KopyalandÄ±!';
                  button.classList.add('bg-green-200', 'text-green-800');
                  setTimeout(() => {
                    button.title = originalTitle;
                    button.classList.remove('bg-green-200', 'text-green-800');
                  }, 2000);
                }
              }}
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
              title="Kod BloÄŸunu Kopyala"
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
        <label htmlFor="coverImage" className={labelClass}>Kapak GÃ¶rseli</label>
        <input
          type="file"
          id="coverImage"
          accept="image/png, image/jpeg, image/webp, image/gif"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-blue-900/20 file:text-blue-700 dark:file:text-blue-400 hover:file:bg-blue-100 dark:hover:file:bg-blue-900/30 transition-colors cursor-pointer"
        />
        {(isUploading) && <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">Kapak resmi yÃ¼kleniyor, lÃ¼tfen bekleyin...</p>}
        {imagePreview && !isUploading && (
          <div className="mt-3 p-2 rounded-lg inline-block">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">GÃ¶rsel Ã–nizleme:</p>
            <img src={imagePreview} alt="Kapak GÃ¶rseli Ã–nizleme" className="max-h-48 rounded-md shadow-sm" />
          </div>
        )}
         {isEditing && currentCoverImageUrl && !coverImageFile && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Mevcut resim: <a href={currentCoverImageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 dark:text-blue-400 hover:underline">{currentCoverImageUrl.substring(currentCoverImageUrl.lastIndexOf('/') + 1)}</a></p>
        )}
      </div>
      <div>
        <label htmlFor="status" className={labelClass}>YayÄ±n Durumu</label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className={`${inputClass} appearance-none`}
        >
          <option value="draft">Taslak Olarak Kaydet</option>
          <option value="published">Åimdi YayÄ±nla</option>
          <option value="unlisted">Liste DÄ±ÅŸÄ± (YayÄ±nda ama kart olarak gÃ¶sterilmiyor)</option>
        </select>
      </div>
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isSubmitting || isUploading}
          className="flex items-center justify-center min-w-[120px] px-6 py-2.5 shadow-md text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
        >
          {(isSubmitting || isUploading) ? (
            <div className="loader" style={{ width: '1.25rem', height: '1.25rem', margin: '0 0.5rem 0 -0.25rem', border: '0.0625rem #fff solid' }}></div>
          ) : (isEditing ? 'Makaleyi GÃ¼ncelle' : 'Makaleyi OluÅŸtur')}
        </button>
      </div>
    </form>
  );
};

export default ArticleForm;

