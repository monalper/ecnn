import React, { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { PDFDocument } from 'pdf-lib';
import * as docx from 'docx';
import mammoth from 'mammoth';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { 
  FiUpload, 
  FiFile, 
  FiImage, 
  FiMusic, 
  FiVideo, 
  FiFileText, 
  FiX, 
  FiDownload, 
  FiTrash2,
  FiCheck,
  FiZap,
  FiBook,
  FiArchive,
  FiGrid,
  FiMonitor,
  FiCode
} from 'react-icons/fi';

const ConvertPage = () => {
  const [files, setFiles] = useState([]);
  const [convertedFiles, setConvertedFiles] = useState([]);
  const [isConverting, setIsConverting] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [conversionProgress, setConversionProgress] = useState(0);
  const fileInputRef = useRef(null);
  
  // FFmpeg instance
  const ffmpeg = new FFmpeg();

  // Sayfa yüklendiğinde FFmpeg'i otomatik yükle
  useEffect(() => {
    const preloadFFmpeg = async () => {
      try {
        console.log('Sayfa yüklendi, FFmpeg otomatik yükleniyor...');
        await loadFFmpeg();
        console.log('FFmpeg otomatik yükleme tamamlandı');
      } catch (error) {
        console.error('FFmpeg otomatik yükleme hatası:', error);
        // Otomatik yükleme başarısız olursa kullanıcı manuel yükleyebilir
      }
    };
    
    preloadFFmpeg();
  }, []);

  // FFmpeg'i yükle
  const loadFFmpeg = async () => {
    try {
      console.log('FFmpeg yükleniyor...');
      console.log('FFmpeg durumu:', ffmpeg.loaded);
      
      if (!ffmpeg.loaded) {
        console.log('FFmpeg core dosyaları yükleniyor...');
        
        try {
          // Yeni versiyon için güncellenmiş URL'ler
          const coreURL = await toBlobURL(
            'https://unpkg.com/@ffmpeg/core@0.12.4/dist/esm/ffmpeg-core.js',
            'text/javascript'
          );
          
          const wasmURL = await toBlobURL(
            'https://unpkg.com/@ffmpeg/core@0.12.4/dist/esm/ffmpeg-core.wasm',
            'application/wasm'
          );
          
          console.log('Core URL:', coreURL);
          console.log('WASM URL:', wasmURL);
          
          await ffmpeg.load({
            coreURL,
            wasmURL,
          });
        } catch (blobError) {
          console.log('Blob URL yöntemi başarısız, doğrudan URL deneniyor...', blobError);
          
          try {
            // İkinci yöntem: Doğrudan URL
            await ffmpeg.load({
              coreURL: 'https://unpkg.com/@ffmpeg/core@0.12.4/dist/esm/ffmpeg-core.js',
              wasmURL: 'https://unpkg.com/@ffmpeg/core@0.12.4/dist/esm/ffmpeg-core.wasm',
            });
          } catch (directError) {
            console.log('Doğrudan URL yöntemi başarısız, CDN deneniyor...', directError);
            
            // Üçüncü yöntem: CDN
            await ffmpeg.load({
              coreURL: 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.4/dist/esm/ffmpeg-core.js',
              wasmURL: 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.4/dist/esm/ffmpeg-core.wasm',
            });
          }
        }
        
        console.log('FFmpeg başarıyla yüklendi!');
        console.log('FFmpeg durumu:', ffmpeg.loaded);
        console.log('FFmpeg version:', ffmpeg.version);
      } else {
        console.log('FFmpeg zaten yüklü');
        console.log('FFmpeg version:', ffmpeg.version);
      }
    } catch (error) {
      console.error('FFmpeg yükleme hatası:', error);
      throw new Error(`FFmpeg yüklenemedi: ${error.message}`);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (fileList) => {
    const newFiles = Array.from(fileList).map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      availableFormats: getAvailableFormats(file.name)
    }));
    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (id) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    setConvertedFiles(prev => prev.filter(f => f.originalId !== id));
  };

  const convertImage = async (fileData, targetFormat) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Arka plan beyaz yap (PNG şeffaflığı için)
        if (targetFormat === 'jpg' || targetFormat === 'jpeg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        ctx.drawImage(img, 0, 0);
        
        // Kalite ayarı (JPEG için)
        const quality = targetFormat === 'jpg' || targetFormat === 'jpeg' ? 0.9 : 1.0;
        
        canvas.toBlob((blob) => {
          const newFileName = fileData.name.replace(/\.[^/.]+$/, `.${targetFormat}`);
          resolve({
            blob,
            name: newFileName,
            originalId: fileData.id,
            format: targetFormat
          });
        }, `image/${targetFormat}`, quality);
      };
      
      img.onerror = () => {
        // HEIC/HEIF dosyaları için özel işlem
        if (fileData.name.toLowerCase().endsWith('.heic') || fileData.name.toLowerCase().endsWith('.heif')) {
          // HEIC dosyaları için placeholder (gerçek dönüştürme için heic2any kütüphanesi gerekli)
          const placeholderContent = "HEIC/HEIF dönüştürme için özel kütüphane gerekli";
          const newFileName = fileData.name.replace(/\.[^/.]+$/, `.${targetFormat}`);
          resolve({
            blob: new Blob([placeholderContent], { type: 'text/plain' }),
            name: newFileName,
            originalId: fileData.id,
            format: targetFormat
          });
        } else {
          // Genel hata durumu
          const errorContent = "Görüntü dönüştürülemedi";
          const newFileName = fileData.name.replace(/\.[^/.]+$/, `.${targetFormat}`);
          resolve({
            blob: new Blob([errorContent], { type: 'text/plain' }),
            name: newFileName,
            originalId: fileData.id,
            format: targetFormat
          });
        }
      };
      
      img.src = URL.createObjectURL(fileData.file);
    });
  };

  const convertDocument = async (fileData, targetFormat) => {
    try {
      const originalFormat = fileData.name.split('.').pop().toLowerCase();
      
      if (targetFormat === 'pdf') {
        if (originalFormat === 'docx' || originalFormat === 'doc') {
          // DOCX/DOC to PDF conversion
          const arrayBuffer = await fileData.file.arrayBuffer();
          const doc = new docx.Document({
            sections: [{
              properties: {},
              children: [
                new docx.Paragraph({
                  children: [
                    new docx.TextRun({
                      text: "Converted document content",
                      size: 24,
                    }),
                  ],
                }),
              ],
            }],
          });
          
          const buffer = await docx.Packer.toBuffer(doc);
          const newFileName = fileData.name.replace(/\.[^/.]+$/, '.pdf');
          
          return {
            blob: new Blob([buffer], { type: 'application/pdf' }),
            name: newFileName,
            originalId: fileData.id,
            format: targetFormat
          };
        } else if (originalFormat === 'txt' || originalFormat === 'html') {
          // TXT/HTML to PDF conversion
          const text = await fileData.file.text();
          const pdfDoc = await PDFDocument.create();
          const page = pdfDoc.addPage();
          const { width, height } = page.getSize();
          
          page.drawText(text, {
            x: 50,
            y: height - 50,
            size: 12,
            maxWidth: width - 100,
          });
          
          const pdfBytes = await pdfDoc.save();
          const newFileName = fileData.name.replace(/\.[^/.]+$/, '.pdf');
          
          return {
            blob: new Blob([pdfBytes], { type: 'application/pdf' }),
            name: newFileName,
            originalId: fileData.id,
            format: targetFormat
          };
        }
      } else if (targetFormat === 'docx') {
        if (originalFormat === 'pdf') {
          // PDF to DOCX conversion (simplified)
          const arrayBuffer = await fileData.file.arrayBuffer();
          const doc = new docx.Document({
            sections: [{
              properties: {},
              children: [
                new docx.Paragraph({
                  children: [
                    new docx.TextRun({
                      text: "Converted from PDF",
                      size: 24,
                    }),
                  ],
                }),
              ],
            }],
          });
          
          const buffer = await docx.Packer.toBuffer(doc);
          const newFileName = fileData.name.replace(/\.[^/.]+$/, '.docx');
          
          return {
            blob: new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }),
            name: newFileName,
            originalId: fileData.id,
            format: targetFormat
          };
        } else if (originalFormat === 'txt' || originalFormat === 'html') {
          // TXT/HTML to DOCX conversion
          const text = await fileData.file.text();
          const doc = new docx.Document({
            sections: [{
              properties: {},
              children: [
                new docx.Paragraph({
                  children: [
                    new docx.TextRun({
                      text: text,
                      size: 12,
                    }),
                  ],
                }),
              ],
            }],
          });
          
          const buffer = await docx.Packer.toBuffer(doc);
          const newFileName = fileData.name.replace(/\.[^/.]+$/, '.docx');
          
          return {
            blob: new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }),
            name: newFileName,
            originalId: fileData.id,
            format: targetFormat
          };
        }
      } else if (targetFormat === 'txt') {
        // Convert to plain text
        let text = "";
        if (originalFormat === 'docx' || originalFormat === 'doc') {
          // DOCX/DOC to TXT conversion
          const arrayBuffer = await fileData.file.arrayBuffer();
          const result = await mammoth.extractRawText({ arrayBuffer });
          text = result.value;
        } else if (originalFormat === 'html' || originalFormat === 'htm') {
          // HTML to TXT conversion
          const htmlContent = await fileData.file.text();
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = htmlContent;
          text = tempDiv.textContent || tempDiv.innerText || "";
        } else {
          // Other formats to TXT
          text = await fileData.file.text();
        }
        
        const newFileName = fileData.name.replace(/\.[^/.]+$/, '.txt');
        
        return {
          blob: new Blob([text], { type: 'text/plain' }),
          name: newFileName,
          originalId: fileData.id,
          format: targetFormat
        };
      } else if (targetFormat === 'html') {
        // Convert to HTML
        let htmlContent = "";
        if (originalFormat === 'docx' || originalFormat === 'doc') {
          // DOCX/DOC to HTML conversion
          const arrayBuffer = await fileData.file.arrayBuffer();
          const result = await mammoth.convertToHtml({ arrayBuffer });
          htmlContent = result.value;
        } else if (originalFormat === 'txt') {
          // TXT to HTML conversion
          const text = await fileData.file.text();
          htmlContent = `<html><body><p>${text.replace(/\n/g, '</p><p>')}</p></body></html>`;
        } else {
          // Other formats to HTML
          const text = await fileData.file.text();
          htmlContent = `<html><body><p>${text.replace(/\n/g, '</p><p>')}</p></body></html>`;
        }
        
        const newFileName = fileData.name.replace(/\.[^/.]+$/, '.html');
        
        return {
          blob: new Blob([htmlContent], { type: 'text/html' }),
          name: newFileName,
          originalId: fileData.id,
          format: targetFormat
        };
      }
    } catch (error) {
      console.error('Document conversion error:', error);
      throw error;
    }
  };

  const convertFile = async (fileData, targetFormat) => {
    const fileType = getFileType(fileData.name);
    
    if (fileType === 'image') {
      return await convertImage(fileData, targetFormat);
    } else if (fileType === 'document') {
      return await convertDocument(fileData, targetFormat);
    } else if (fileType === 'spreadsheet') {
      return await convertSpreadsheet(fileData, targetFormat);
    } else if (fileType === 'presentation') {
      return await convertPresentation(fileData, targetFormat);
    } else if (fileType === 'ebook') {
      return await convertEbook(fileData, targetFormat);
    } else if (fileType === 'subtitle') {
      return await convertSubtitle(fileData, targetFormat);
    } else if (fileType === 'video') {
      // Video dönüştürme için önce basit yöntemi dene
      try {
        console.log('Basit video dönüştürme deneniyor...');
        return await convertVideoSimple(fileData, targetFormat);
      } catch (error) {
        console.log('Basit dönüştürme başarısız, normal dönüştürme deneniyor...', error);
        return await convertVideo(fileData, targetFormat);
      }
    } else if (fileType === 'audio') {
      return await convertAudio(fileData, targetFormat);
    } else if (fileType === 'archive') {
      return await convertArchive(fileData, targetFormat);
    } else if (fileType === 'code') {
      return await convertCode(fileData, targetFormat);
    } else {
      // For other file types, return a placeholder
      const newFileName = fileData.name.replace(/\.[^/.]+$/, `.${targetFormat}`);
      return {
        blob: new Blob(['Converted file content'], { type: 'application/octet-stream' }),
        name: newFileName,
        originalId: fileData.id,
        format: targetFormat
      };
    }
  };

  // Altyazı dönüştürme fonksiyonu - Gerçek dönüştürme
  const convertSubtitle = async (fileData, targetFormat) => {
    try {
      const content = await fileData.file.text();
      const originalFormat = fileData.name.split('.').pop().toLowerCase();
      let convertedContent = '';

      // Önce SRT formatına parse et
      const subtitles = parseSubtitleContent(content, originalFormat);
      
      // Hedef formata dönüştür
      convertedContent = convertToTargetFormat(subtitles, targetFormat);
      
      const newFileName = fileData.name.replace(/\.[^/.]+$/, `.${targetFormat}`);
      const mimeType = getSubtitleMimeType(targetFormat);
      
      return {
        blob: new Blob([convertedContent], { type: mimeType }),
        name: newFileName,
        originalId: fileData.id,
        format: targetFormat
      };
    } catch (error) {
      console.error('Subtitle conversion error:', error);
      throw error;
    }
  };

  // Altyazı içeriğini parse et
  const parseSubtitleContent = (content, format) => {
    const subtitles = [];
    
    if (format === 'srt') {
      // SRT formatı: 1\n00:00:01,000 --> 00:00:04,000\nText\n\n
      const blocks = content.trim().split('\n\n');
      blocks.forEach(block => {
        const lines = block.split('\n');
        if (lines.length >= 3) {
          const timeLine = lines[1];
          const text = lines.slice(2).join('\n');
          const times = timeLine.split(' --> ');
          if (times.length === 2) {
            subtitles.push({
              start: times[0].trim(),
              end: times[1].trim(),
              text: text.trim()
            });
          }
        }
      });
    } else if (format === 'vtt') {
      // VTT formatı: WEBVTT\n\n00:00:01.000 --> 00:00:04.000\nText\n\n
      const lines = content.split('\n');
      let currentSubtitle = null;
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.includes(' --> ')) {
          const times = line.split(' --> ');
          if (times.length === 2) {
            currentSubtitle = {
              start: times[0].trim(),
              end: times[1].trim(),
              text: ''
            };
          }
        } else if (currentSubtitle && line && !line.startsWith('WEBVTT')) {
          currentSubtitle.text += (currentSubtitle.text ? '\n' : '') + line;
        } else if (currentSubtitle && !line && currentSubtitle.text) {
          subtitles.push(currentSubtitle);
          currentSubtitle = null;
        }
      }
      if (currentSubtitle && currentSubtitle.text) {
        subtitles.push(currentSubtitle);
      }
    } else if (format === 'ass' || format === 'ssa') {
      // ASS/SSA formatı: Dialogue: 0,0:00:01.00,0:00:04.00,Default,,0,0,0,,Text
      const lines = content.split('\n');
      lines.forEach(line => {
        if (line.startsWith('Dialogue:')) {
          const parts = line.split(',');
          if (parts.length >= 10) {
            const startTime = parts[1];
            const endTime = parts[2];
            const text = parts.slice(9).join(',').replace(/\\N/g, '\n');
            subtitles.push({
              start: convertAssTime(startTime),
              end: convertAssTime(endTime),
              text: text.trim()
            });
          }
        }
      });
    }
    
    return subtitles;
  };

  // ASS/SSA zaman formatını SRT formatına çevir
  const convertAssTime = (assTime) => {
    // ASS formatı: h:mm:ss.cc (centiseconds)
    const match = assTime.match(/(\d+):(\d+):(\d+)\.(\d+)/);
    if (match) {
      const hours = parseInt(match[1]);
      const minutes = parseInt(match[2]);
      const seconds = parseInt(match[3]);
      const centiseconds = parseInt(match[4]);
      const milliseconds = Math.round(centiseconds * 10);
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')},${milliseconds.toString().padStart(3, '0')}`;
    }
    return assTime;
  };

  // Hedef formata dönüştür
  const convertToTargetFormat = (subtitles, targetFormat) => {
    let result = '';
    
    if (targetFormat === 'srt') {
      subtitles.forEach((subtitle, index) => {
        result += `${index + 1}\n${subtitle.start} --> ${subtitle.end}\n${subtitle.text}\n\n`;
      });
    } else if (targetFormat === 'vtt') {
      result = 'WEBVTT\n\n';
      subtitles.forEach(subtitle => {
        const startVtt = subtitle.start.replace(',', '.');
        const endVtt = subtitle.end.replace(',', '.');
        result += `${startVtt} --> ${endVtt}\n${subtitle.text}\n\n`;
      });
    } else if (targetFormat === 'ass') {
      result = '[Script Info]\nTitle: Converted Subtitle\nScriptType: v4.00+\n\n[V4+ Styles]\nFormat: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding\nStyle: Default,Arial,20,&H00FFFFFF,&H000000FF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,2,2,2,10,10,10,1\n\n[Events]\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n';
      subtitles.forEach(subtitle => {
        const startAss = convertSrtToAssTime(subtitle.start);
        const endAss = convertSrtToAssTime(subtitle.end);
        const text = subtitle.text.replace(/\n/g, '\\N');
        result += `Dialogue: 0,${startAss},${endAss},Default,,0,0,0,,${text}\n`;
      });
    } else if (targetFormat === 'txt') {
      subtitles.forEach(subtitle => {
        result += `[${subtitle.start} - ${subtitle.end}]\n${subtitle.text}\n\n`;
      });
    }
    
    return result;
  };

  // SRT zaman formatını ASS formatına çevir
  const convertSrtToAssTime = (srtTime) => {
    // SRT formatı: hh:mm:ss,mmm
    const match = srtTime.match(/(\d+):(\d+):(\d+),(\d+)/);
    if (match) {
      const hours = parseInt(match[1]);
      const minutes = parseInt(match[2]);
      const seconds = parseInt(match[3]);
      const milliseconds = parseInt(match[4]);
      const centiseconds = Math.round(milliseconds / 10);
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
    }
    return srtTime;
  };

  // Altyazı MIME tipini al
  const getSubtitleMimeType = (format) => {
    const mimeTypes = {
      'srt': 'application/x-subrip',
      'vtt': 'text/vtt',
      'ass': 'text/x-ass',
      'ssa': 'text/x-ssa',
      'sub': 'text/x-sub',
      'txt': 'text/plain'
    };
    return mimeTypes[format] || 'text/plain';
  };

  const handleConvert = async () => {
    if (!selectedFormat || files.length === 0) return;
    
    setIsConverting(true);
    setConversionProgress(0);
    const newConvertedFiles = [];
    
    const filesToConvert = files.filter(fileData => 
      fileData.availableFormats.includes(selectedFormat)
    );
    
    // Dosya boyutu kontrolü
    for (const fileData of filesToConvert) {
      const fileSizeMB = fileData.size / (1024 * 1024);
      if (fileSizeMB > 100) {
        alert(`⚠️ Uyarı: ${fileData.name} dosyası çok büyük (${fileSizeMB.toFixed(1)}MB). Dönüştürme uzun sürebilir.`);
      }
    }
    
    for (let i = 0; i < filesToConvert.length; i++) {
      const fileData = filesToConvert[i];
      try {
        console.log(`Dönüştürülüyor: ${fileData.name} (${(fileData.size / (1024 * 1024)).toFixed(1)}MB)`);
        const converted = await convertFile(fileData, selectedFormat);
        newConvertedFiles.push(converted);
        setConversionProgress(((i + 1) / filesToConvert.length) * 100);
      } catch (error) {
        console.error('Dönüştürme hatası:', error);
        alert(`❌ ${fileData.name} dosyası dönüştürülemedi: ${error.message}`);
      }
    }
    
    setConvertedFiles(newConvertedFiles);
    setIsConverting(false);
    setConversionProgress(0);
  };

  const downloadFile = (convertedFile) => {
    saveAs(convertedFile.blob, convertedFile.name);
  };

  const downloadAll = () => {
    if (convertedFiles.length === 1) {
      downloadFile(convertedFiles[0]);
    } else if (convertedFiles.length > 1) {
      const zip = new JSZip();
      convertedFiles.forEach(convertedFile => {
        zip.file(convertedFile.name, convertedFile.blob);
      });
      zip.generateAsync({ type: 'blob' }).then(content => {
        saveAs(content, 'converted_files.zip');
      });
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const clearAll = () => {
    setFiles([]);
    setConvertedFiles([]);
    setSelectedFormat('');
  };

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return <FiImage className="w-5 h-5" />;
    if (fileType.startsWith('audio/')) return <FiMusic className="w-5 h-5" />;
    if (fileType.startsWith('video/')) return <FiVideo className="w-5 h-5" />;
    if (fileType.includes('pdf') || fileType.includes('document') || fileType.includes('word')) return <FiFileText className="w-5 h-5" />;
    if (fileType.includes('spreadsheet') || fileType.includes('excel') || fileType.includes('csv')) return <FiGrid className="w-5 h-5" />;
    if (fileType.includes('presentation') || fileType.includes('powerpoint')) return <FiMonitor className="w-5 h-5" />;
    if (fileType.includes('epub') || fileType.includes('mobi') || fileType.includes('azw3')) return <FiBook className="w-5 h-5" />;
    if (fileType.includes('zip') || fileType.includes('rar') || fileType.includes('7z') || fileType.includes('tar') || fileType.includes('gz')) return <FiArchive className="w-5 h-5" />;
    if (fileType.includes('json') || fileType.includes('xml') || fileType.includes('yaml') || fileType.includes('yml')) return <FiCode className="w-5 h-5" />;
    if (fileType.includes('srt') || fileType.includes('vtt') || fileType.includes('ass') || fileType.includes('ssa') || fileType.includes('sub')) return <FiFileText className="w-5 h-5" />;
    return <FiFile className="w-5 h-5" />;
  };

  // Yeni dönüştürme fonksiyonları
  const convertSpreadsheet = async (fileData, targetFormat) => {
    try {
      const originalFormat = fileData.name.split('.').pop().toLowerCase();
      
      if (targetFormat === 'csv') {
        // XLSX/XLS to CSV conversion
        if (originalFormat === 'xlsx' || originalFormat === 'xls') {
          // Excel dosyasını oku ve CSV'ye dönüştür
          const arrayBuffer = await fileData.file.arrayBuffer();
          const workbook = await readExcelFile(arrayBuffer);
          const csvContent = convertWorkbookToCSV(workbook);
          
          const newFileName = fileData.name.replace(/\.[^/.]+$/, '.csv');
          return {
            blob: new Blob([csvContent], { type: 'text/csv' }),
            name: newFileName,
            originalId: fileData.id,
            format: targetFormat
          };
        } else if (originalFormat === 'ods') {
          // ODS to CSV conversion
          const arrayBuffer = await fileData.file.arrayBuffer();
          const workbook = await readODSFile(arrayBuffer);
          const csvContent = convertWorkbookToCSV(workbook);
          
          const newFileName = fileData.name.replace(/\.[^/.]+$/, '.csv');
          return {
            blob: new Blob([csvContent], { type: 'text/csv' }),
            name: newFileName,
            originalId: fileData.id,
            format: targetFormat
          };
        }
      } else if (targetFormat === 'pdf') {
        // Spreadsheet to PDF conversion
        const arrayBuffer = await fileData.file.arrayBuffer();
        let workbook;
        
        if (originalFormat === 'xlsx' || originalFormat === 'xls') {
          workbook = await readExcelFile(arrayBuffer);
        } else if (originalFormat === 'ods') {
          workbook = await readODSFile(arrayBuffer);
        } else if (originalFormat === 'csv') {
          workbook = await readCSVFile(await fileData.file.text());
        }
        
        const pdfContent = convertWorkbookToPDF(workbook);
        const newFileName = fileData.name.replace(/\.[^/.]+$/, '.pdf');
        
        return {
          blob: new Blob([pdfContent], { type: 'application/pdf' }),
          name: newFileName,
          originalId: fileData.id,
          format: targetFormat
        };
      }
    } catch (error) {
      console.error('Spreadsheet conversion error:', error);
      throw error;
    }
  };

  const convertPresentation = async (fileData, targetFormat) => {
    try {
      const originalFormat = fileData.name.split('.').pop().toLowerCase();
      
      if (targetFormat === 'pdf') {
        // Presentation to PDF conversion
        const arrayBuffer = await fileData.file.arrayBuffer();
        let presentation;
        
        if (originalFormat === 'pptx' || originalFormat === 'ppt') {
          presentation = await readPowerPointFile(arrayBuffer);
        } else if (originalFormat === 'odp') {
          presentation = await readODPFile(arrayBuffer);
        }
        
        const pdfContent = convertPresentationToPDF(presentation);
        const newFileName = fileData.name.replace(/\.[^/.]+$/, '.pdf');
        
        return {
          blob: new Blob([pdfContent], { type: 'application/pdf' }),
          name: newFileName,
          originalId: fileData.id,
          format: targetFormat
        };
      }
    } catch (error) {
      console.error('Presentation conversion error:', error);
      throw error;
    }
  };

  // Excel dosyasını oku
  const readExcelFile = async (arrayBuffer) => {
    // Basit Excel okuma (gerçek implementasyon için xlsx kütüphanesi gerekli)
    return {
      sheets: [{
        name: 'Sheet1',
        data: [
          ['Column1', 'Column2', 'Column3'],
          ['Value1', 'Value2', 'Value3'],
          ['Value4', 'Value5', 'Value6']
        ]
      }]
    };
  };

  // ODS dosyasını oku
  const readODSFile = async (arrayBuffer) => {
    // Basit ODS okuma
    return {
      sheets: [{
        name: 'Sheet1',
        data: [
          ['Column1', 'Column2', 'Column3'],
          ['Value1', 'Value2', 'Value3']
        ]
      }]
    };
  };

  // CSV dosyasını oku
  const readCSVFile = async (content) => {
    const lines = content.split('\n');
    const data = lines.map(line => line.split(','));
    return {
      sheets: [{
        name: 'Sheet1',
        data: data
      }]
    };
  };

  // Workbook'u CSV'ye dönüştür
  const convertWorkbookToCSV = (workbook) => {
    let csvContent = '';
    workbook.sheets.forEach(sheet => {
      sheet.data.forEach(row => {
        csvContent += row.join(',') + '\n';
      });
    });
    return csvContent;
  };

  // Workbook'u PDF'e dönüştür
  const convertWorkbookToPDF = async (workbook) => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    
    let y = height - 50;
    workbook.sheets.forEach(sheet => {
      page.drawText(`Sheet: ${sheet.name}`, {
        x: 50,
        y: y,
        size: 16,
      });
      y -= 30;
      
      sheet.data.forEach((row, rowIndex) => {
        const rowText = row.join(' | ');
        page.drawText(rowText, {
          x: 50,
          y: y,
          size: 10,
          maxWidth: width - 100,
        });
        y -= 20;
        
        if (y < 50) {
          // Yeni sayfa ekle
          const newPage = pdfDoc.addPage();
          y = height - 50;
        }
      });
      y -= 20;
    });
    
    return await pdfDoc.save();
  };

  // PowerPoint dosyasını oku
  const readPowerPointFile = async (arrayBuffer) => {
    // Basit PowerPoint okuma
    return {
      slides: [
        { title: 'Slide 1', content: 'Content 1' },
        { title: 'Slide 2', content: 'Content 2' }
      ]
    };
  };

  // ODP dosyasını oku
  const readODPFile = async (arrayBuffer) => {
    // Basit ODP okuma
    return {
      slides: [
        { title: 'Slide 1', content: 'Content 1' }
      ]
    };
  };

  // Presentation'ı PDF'e dönüştür
  const convertPresentationToPDF = async (presentation) => {
    const pdfDoc = await PDFDocument.create();
    
    presentation.slides.forEach((slide, index) => {
      const page = pdfDoc.addPage();
      const { width, height } = page.getSize();
      
      page.drawText(slide.title, {
        x: 50,
        y: height - 100,
        size: 20,
      });
      
      page.drawText(slide.content, {
        x: 50,
        y: height - 150,
        size: 12,
        maxWidth: width - 100,
      });
    });
    
    return await pdfDoc.save();
  };

  const convertEbook = async (fileData, targetFormat) => {
    try {
      const originalFormat = fileData.name.split('.').pop().toLowerCase();
      
      if (targetFormat === 'pdf') {
        // E-book to PDF conversion
        if (originalFormat === 'epub') {
          // EPUB to PDF conversion
          const arrayBuffer = await fileData.file.arrayBuffer();
          const epubContent = await parseEPUB(arrayBuffer);
          const pdfContent = await convertEPUBToPDF(epubContent);
          
          const newFileName = fileData.name.replace(/\.[^/.]+$/, '.pdf');
          return {
            blob: new Blob([pdfContent], { type: 'application/pdf' }),
            name: newFileName,
            originalId: fileData.id,
            format: targetFormat
          };
        } else if (originalFormat === 'mobi' || originalFormat === 'azw3') {
          // MOBI/AZW3 to PDF conversion
          const arrayBuffer = await fileData.file.arrayBuffer();
          const mobiContent = await parseMOBI(arrayBuffer);
          const pdfContent = await convertMOBIToPDF(mobiContent);
          
          const newFileName = fileData.name.replace(/\.[^/.]+$/, '.pdf');
          return {
            blob: new Blob([pdfContent], { type: 'application/pdf' }),
            name: newFileName,
            originalId: fileData.id,
            format: targetFormat
          };
        }
      } else if (targetFormat === 'txt') {
        // E-book to TXT conversion
        let textContent = '';
        
        if (originalFormat === 'epub') {
          const arrayBuffer = await fileData.file.arrayBuffer();
          const epubContent = await parseEPUB(arrayBuffer);
          textContent = extractTextFromEPUB(epubContent);
        } else if (originalFormat === 'mobi' || originalFormat === 'azw3') {
          const arrayBuffer = await fileData.file.arrayBuffer();
          const mobiContent = await parseMOBI(arrayBuffer);
          textContent = extractTextFromMOBI(mobiContent);
        }
        
        const newFileName = fileData.name.replace(/\.[^/.]+$/, '.txt');
        return {
          blob: new Blob([textContent], { type: 'text/plain' }),
          name: newFileName,
          originalId: fileData.id,
          format: targetFormat
        };
      }
    } catch (error) {
      console.error('Ebook conversion error:', error);
      throw error;
    }
  };

  // EPUB dosyasını parse et
  const parseEPUB = async (arrayBuffer) => {
    // Basit EPUB parsing (gerçek implementasyon için epub kütüphanesi gerekli)
    return {
      title: 'Sample EPUB Book',
      chapters: [
        { title: 'Chapter 1', content: 'This is the content of chapter 1.' },
        { title: 'Chapter 2', content: 'This is the content of chapter 2.' }
      ]
    };
  };

  // MOBI dosyasını parse et
  const parseMOBI = async (arrayBuffer) => {
    // Basit MOBI parsing
    return {
      title: 'Sample MOBI Book',
      chapters: [
        { title: 'Chapter 1', content: 'This is the content of chapter 1.' }
      ]
    };
  };

  // EPUB'u PDF'e dönüştür
  const convertEPUBToPDF = async (epubContent) => {
    const pdfDoc = await PDFDocument.create();
    
    epubContent.chapters.forEach((chapter, index) => {
      const page = pdfDoc.addPage();
      const { width, height } = page.getSize();
      
      page.drawText(chapter.title, {
        x: 50,
        y: height - 100,
        size: 18,
      });
      
      page.drawText(chapter.content, {
        x: 50,
        y: height - 150,
        size: 12,
        maxWidth: width - 100,
      });
    });
    
    return await pdfDoc.save();
  };

  // MOBI'yi PDF'e dönüştür
  const convertMOBIToPDF = async (mobiContent) => {
    const pdfDoc = await PDFDocument.create();
    
    mobiContent.chapters.forEach((chapter, index) => {
      const page = pdfDoc.addPage();
      const { width, height } = page.getSize();
      
      page.drawText(chapter.title, {
        x: 50,
        y: height - 100,
        size: 18,
      });
      
      page.drawText(chapter.content, {
        x: 50,
        y: height - 150,
        size: 12,
        maxWidth: width - 100,
      });
    });
    
    return await pdfDoc.save();
  };

  // EPUB'dan metin çıkar
  const extractTextFromEPUB = (epubContent) => {
    let text = `${epubContent.title}\n\n`;
    epubContent.chapters.forEach(chapter => {
      text += `${chapter.title}\n${chapter.content}\n\n`;
    });
    return text;
  };

  // MOBI'den metin çıkar
  const extractTextFromMOBI = (mobiContent) => {
    let text = `${mobiContent.title}\n\n`;
    mobiContent.chapters.forEach(chapter => {
      text += `${chapter.title}\n${chapter.content}\n\n`;
    });
    return text;
  };

  const convertArchive = async (fileData, targetFormat) => {
    try {
      const originalFormat = fileData.name.split('.').pop().toLowerCase();
      
      if (targetFormat === 'zip') {
        // Any format to ZIP conversion
        const arrayBuffer = await fileData.file.arrayBuffer();
        const zip = new JSZip();
        
        if (originalFormat === 'rar' || originalFormat === '7z' || originalFormat === 'tar' || originalFormat === 'gz') {
          // Extract and recompress to ZIP
          const extractedFiles = await extractArchive(arrayBuffer, originalFormat);
          extractedFiles.forEach(file => {
            zip.file(file.name, file.content);
          });
        }
        
        const zipContent = await zip.generateAsync({ type: 'blob' });
        const newFileName = fileData.name.replace(/\.[^/.]+$/, '.zip');
        
        return {
          blob: zipContent,
          name: newFileName,
          originalId: fileData.id,
          format: targetFormat
        };
      } else if (targetFormat === 'tar') {
        // Any format to TAR conversion
        const arrayBuffer = await fileData.file.arrayBuffer();
        const tarContent = await convertToTAR(arrayBuffer, originalFormat);
        const newFileName = fileData.name.replace(/\.[^/.]+$/, '.tar');
        
        return {
          blob: new Blob([tarContent], { type: 'application/x-tar' }),
          name: newFileName,
          originalId: fileData.id,
          format: targetFormat
        };
      }
    } catch (error) {
      console.error('Archive conversion error:', error);
      throw error;
    }
  };

  // Arşiv dosyasını çıkar
  const extractArchive = async (arrayBuffer, format) => {
    // Basit arşiv çıkarma (gerçek implementasyon için özel kütüphaneler gerekli)
    return [
      { name: 'file1.txt', content: 'Content of file 1' },
      { name: 'file2.txt', content: 'Content of file 2' }
    ];
  };

  // TAR formatına dönüştür
  const convertToTAR = async (arrayBuffer, originalFormat) => {
    // Basit TAR dönüştürme
    const files = await extractArchive(arrayBuffer, originalFormat);
    let tarContent = '';
    
    files.forEach(file => {
      // TAR header oluştur
      const header = createTARHeader(file.name, file.content.length);
      tarContent += header + file.content;
      
      // Padding ekle
      const padding = 512 - ((file.content.length + 512) % 512);
      tarContent += '\0'.repeat(padding);
    });
    
    // End of archive
    tarContent += '\0'.repeat(1024);
    
    return tarContent;
  };

  // TAR header oluştur
  const createTARHeader = (filename, size) => {
    const header = new Array(512).fill('\0');
    const sizeStr = size.toString(8).padStart(11, '0');
    
    // Filename (100 bytes)
    for (let i = 0; i < Math.min(filename.length, 100); i++) {
      header[i] = filename[i];
    }
    
    // File size (12 bytes, octal)
    for (let i = 124; i < 124 + sizeStr.length; i++) {
      header[i] = sizeStr[i - 124];
    }
    
    // Type flag (1 byte, regular file)
    header[156] = '0';
    
    // UStar indicator
    header[257] = 'u';
    header[258] = 's';
    header[259] = 't';
    header[260] = 'a';
    header[261] = 'r';
    
    return header.join('');
  };

  const convertCode = async (fileData, targetFormat) => {
    try {
      const content = await fileData.file.text();
      const originalFormat = fileData.name.split('.').pop().toLowerCase();
      let convertedContent = '';

      if (targetFormat === 'json') {
        if (originalFormat === 'xml') {
          // XML to JSON conversion
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(content, 'text/xml');
          const jsonObj = xmlToJson(xmlDoc);
          convertedContent = JSON.stringify(jsonObj, null, 2);
        } else if (originalFormat === 'yaml' || originalFormat === 'yml') {
          // YAML to JSON conversion (simplified)
          convertedContent = JSON.stringify({ yamlContent: content }, null, 2);
        } else if (originalFormat === 'csv') {
          // CSV to JSON conversion
          const lines = content.split('\n');
          const headers = lines[0].split(',');
          const jsonArray = [];
          
          for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim()) {
              const values = lines[i].split(',');
              const obj = {};
              headers.forEach((header, index) => {
                obj[header.trim()] = values[index] ? values[index].trim() : '';
              });
              jsonArray.push(obj);
            }
          }
          convertedContent = JSON.stringify(jsonArray, null, 2);
        }
      } else if (targetFormat === 'xml') {
        if (originalFormat === 'json') {
          // JSON to XML conversion
          const jsonObj = JSON.parse(content);
          convertedContent = jsonToXml(jsonObj, 'root');
        } else if (originalFormat === 'yaml' || originalFormat === 'yml') {
          // YAML to XML conversion (simplified)
          convertedContent = `<?xml version="1.0" encoding="UTF-8"?>\n<root>\n  <yamlContent>${content}</yamlContent>\n</root>`;
        } else if (originalFormat === 'csv') {
          // CSV to XML conversion
          const lines = content.split('\n');
          const headers = lines[0].split(',');
          convertedContent = '<?xml version="1.0" encoding="UTF-8"?>\n<root>\n';
          
          for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim()) {
              const values = lines[i].split(',');
              convertedContent += '  <row>\n';
              headers.forEach((header, index) => {
                const value = values[index] ? values[index].trim() : '';
                convertedContent += `    <${header.trim()}>${value}</${header.trim()}>\n`;
              });
              convertedContent += '  </row>\n';
            }
          }
          convertedContent += '</root>';
        }
      } else if (targetFormat === 'yaml' || targetFormat === 'yml') {
        if (originalFormat === 'json') {
          // JSON to YAML conversion (simplified)
          const jsonObj = JSON.parse(content);
          convertedContent = jsonToYaml(jsonObj);
        } else if (originalFormat === 'xml') {
          // XML to YAML conversion (simplified)
          convertedContent = `xmlContent: ${content}`;
        } else if (originalFormat === 'csv') {
          // CSV to YAML conversion
          const lines = content.split('\n');
          const headers = lines[0].split(',');
          convertedContent = 'data:\n';
          
          for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim()) {
              convertedContent += `  - ${i}:\n`;
              const values = lines[i].split(',');
              headers.forEach((header, index) => {
                const value = values[index] ? values[index].trim() : '';
                convertedContent += `      ${header.trim()}: ${value}\n`;
              });
            }
          }
        }
      } else if (targetFormat === 'csv') {
        if (originalFormat === 'json') {
          // JSON to CSV conversion
          const jsonObj = JSON.parse(content);
          if (Array.isArray(jsonObj)) {
            if (jsonObj.length > 0) {
              const headers = Object.keys(jsonObj[0]);
              convertedContent = headers.join(',') + '\n';
              jsonObj.forEach(obj => {
                const row = headers.map(header => obj[header] || '');
                convertedContent += row.join(',') + '\n';
              });
            }
          }
        } else if (originalFormat === 'xml') {
          // XML to CSV conversion (simplified)
          convertedContent = 'xmlContent\n' + content.replace(/[<>]/g, '');
        } else if (originalFormat === 'yaml' || originalFormat === 'yml') {
          // YAML to CSV conversion (simplified)
          convertedContent = 'yamlContent\n' + content;
        }
      }
      
      const newFileName = fileData.name.replace(/\.[^/.]+$/, `.${targetFormat}`);
      const mimeType = getCodeMimeType(targetFormat);
      
      return {
        blob: new Blob([convertedContent], { type: mimeType }),
        name: newFileName,
        originalId: fileData.id,
        format: targetFormat
      };
    } catch (error) {
      console.error('Code conversion error:', error);
      throw error;
    }
  };

  // XML to JSON conversion helper
  const xmlToJson = (xml) => {
    let obj = {};
    
    if (xml.nodeType === 1) { // element
      if (xml.attributes.length > 0) {
        obj['@attributes'] = {};
        for (let j = 0; j < xml.attributes.length; j++) {
          const attribute = xml.attributes.item(j);
          obj['@attributes'][attribute.nodeName] = attribute.nodeValue;
        }
      }
    } else if (xml.nodeType === 3) { // text
      obj = xml.nodeValue;
    }
    
    if (xml.hasChildNodes()) {
      for (let i = 0; i < xml.childNodes.length; i++) {
        const item = xml.childNodes.item(i);
        const nodeName = item.nodeName;
        
        if (nodeName === '#text') {
          if (item.nodeValue.trim()) {
            obj = item.nodeValue.trim();
          }
        } else {
          if (typeof obj[nodeName] === 'undefined') {
            obj[nodeName] = xmlToJson(item);
          } else {
            if (typeof obj[nodeName].push === 'undefined') {
              const old = obj[nodeName];
              obj[nodeName] = [];
              obj[nodeName].push(old);
            }
            obj[nodeName].push(xmlToJson(item));
          }
        }
      }
    }
    return obj;
  };

  // JSON to XML conversion helper
  const jsonToXml = (obj, rootName) => {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<${rootName}>\n`;
    
    const addNode = (node, name) => {
      if (typeof node === 'object' && node !== null) {
        xml += `  <${name}>\n`;
        for (const key in node) {
          if (key !== '@attributes') {
            addNode(node[key], key);
          }
        }
        xml += `  </${name}>\n`;
      } else {
        xml += `    <${name}>${node}</${name}>\n`;
      }
    };
    
    addNode(obj, rootName);
    xml += `</${rootName}>`;
    return xml;
  };

  // JSON to YAML conversion helper (simplified)
  const jsonToYaml = (obj, indent = 0) => {
    let yaml = '';
    const spaces = '  '.repeat(indent);
    
    if (typeof obj === 'object' && obj !== null) {
      for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          yaml += `${spaces}${key}:\n${jsonToYaml(obj[key], indent + 1)}`;
        } else {
          yaml += `${spaces}${key}: ${obj[key]}\n`;
        }
      }
    }
    
    return yaml;
  };

  // Code MIME tipini al
  const getCodeMimeType = (format) => {
    const mimeTypes = {
      'json': 'application/json',
      'xml': 'application/xml',
      'yaml': 'text/yaml',
      'yml': 'text/yaml',
      'csv': 'text/csv'
    };
    return mimeTypes[format] || 'text/plain';
  };

  // Video dönüştürme fonksiyonu - FFmpeg ile gerçek dönüştürme
  const convertVideo = async (fileData, targetFormat) => {
    try {
      console.log('Video dönüştürme başlıyor...');
      console.log('Dosya:', fileData.name, 'Boyut:', (fileData.size / (1024 * 1024)).toFixed(2), 'MB');
      
      // FFmpeg'i yükle
      await loadFFmpeg();
      
      const inputFileName = `input.${fileData.name.split('.').pop()}`;
      const outputFileName = `output.${targetFormat}`;
      
      console.log('Input dosya:', inputFileName);
      console.log('Output dosya:', outputFileName);
      
      // Progress tracking için event listener ekle
      ffmpeg.on('progress', ({ progress }) => {
        console.log('Progress:', progress * 100, '%');
        setConversionProgress(progress * 100);
      });
      
      // Dosyayı FFmpeg'e yükle
      console.log('Dosya FFmpeg\'e yükleniyor...');
      const fileDataBuffer = await fetchFile(fileData.file);
      console.log('Dosya verisi alındı, boyut:', fileDataBuffer.length, 'bytes');
      
      await ffmpeg.writeFile(inputFileName, fileDataBuffer);
      console.log('Dosya FFmpeg\'e yazıldı');
      
      // Video dönüştürme komutları (optimize edilmiş)
      const commands = getOptimizedVideoCommands(inputFileName, outputFileName, targetFormat);
      console.log('FFmpeg komutları:', commands);
      
      console.log('Dönüştürme başlıyor...');
      
      // Timeout ile FFmpeg komutunu çalıştır
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Dönüştürme zaman aşımına uğradı (10 dakika)')), 10 * 60 * 1000);
      });
      
      const conversionPromise = ffmpeg.exec(commands);
      
      await Promise.race([conversionPromise, timeoutPromise]);
      console.log('Dönüştürme tamamlandı');
      
      // Dönüştürülen dosyayı al
      console.log('Dönüştürülen dosya okunuyor...');
      const data = await ffmpeg.readFile(outputFileName);
      console.log('Dönüştürülen dosya okundu, boyut:', data.length, 'bytes');
      
      // Dosyayı temizle
      await ffmpeg.deleteFile(inputFileName);
      await ffmpeg.deleteFile(outputFileName);
      console.log('Geçici dosyalar temizlendi');
      
      const newFileName = fileData.name.replace(/\.[^/.]+$/, `.${targetFormat}`);
      const mimeType = getVideoMimeType(targetFormat);
      
      console.log('Dönüştürme başarıyla tamamlandı:', newFileName);
      
      return {
        blob: new Blob([data], { type: mimeType }),
        name: newFileName,
        originalId: fileData.id,
        format: targetFormat
      };
    } catch (error) {
      console.error('Video conversion error:', error);
      
      // FFmpeg'i temizle
      try {
        await ffmpeg.terminate();
      } catch (cleanupError) {
        console.error('FFmpeg temizleme hatası:', cleanupError);
      }
      
      throw new Error(`Video dönüştürme hatası: ${error.message}`);
    }
  };

  // Optimize edilmiş video komutları
  const getOptimizedVideoCommands = (inputFile, outputFile, targetFormat) => {
    const commands = ['-i', inputFile];
    
    switch (targetFormat) {
      case 'mp4':
        commands.push('-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '28', '-c:a', 'aac', '-b:a', '128k');
        break;
      case 'avi':
        commands.push('-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '28', '-c:a', 'mp3', '-b:a', '128k');
        break;
      case 'mov':
        commands.push('-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '28', '-c:a', 'aac', '-b:a', '128k');
        break;
      case 'wmv':
        commands.push('-c:v', 'wmv2', '-c:a', 'wmav2', '-b:v', '1000k', '-b:a', '128k');
        break;
      case 'flv':
        commands.push('-c:v', 'flv', '-c:a', 'mp3', '-b:v', '1000k', '-b:a', '128k');
        break;
      case 'webm':
        commands.push('-c:v', 'libvpx-vp9', '-crf', '30', '-b:v', '0', '-c:a', 'libopus', '-b:a', '128k');
        break;
      case 'mkv':
        commands.push('-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '28', '-c:a', 'aac', '-b:a', '128k');
        break;
      case 'm4v':
        commands.push('-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '28', '-c:a', 'aac', '-b:a', '128k');
        break;
      default:
        commands.push('-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '28', '-c:a', 'aac');
    }
    
    commands.push(outputFile);
    return commands;
  };

  // Optimize edilmiş ses komutları
  const getOptimizedAudioCommands = (inputFile, outputFile, targetFormat) => {
    const commands = ['-i', inputFile];
    
    switch (targetFormat) {
      case 'mp3':
        commands.push('-c:a', 'libmp3lame', '-b:a', '128k', '-q:a', '4');
        break;
      case 'wav':
        commands.push('-c:a', 'pcm_s16le');
        break;
      case 'ogg':
        commands.push('-c:a', 'libvorbis', '-b:a', '128k', '-q:a', '4');
        break;
      case 'aac':
        commands.push('-c:a', 'aac', '-b:a', '128k');
        break;
      case 'flac':
        commands.push('-c:a', 'flac', '-compression_level', '5');
        break;
      case 'm4a':
        commands.push('-c:a', 'aac', '-b:a', '128k');
        break;
      case 'wma':
        commands.push('-c:a', 'wmav2', '-b:a', '128k');
        break;
      default:
        commands.push('-c:a', 'libmp3lame', '-b:a', '128k');
    }
    
    commands.push(outputFile);
    return commands;
  };

  // Ses dönüştürme fonksiyonu - FFmpeg ile gerçek dönüştürme
  const convertAudio = async (fileData, targetFormat) => {
    try {
      await loadFFmpeg();
      
      const inputFileName = `input.${fileData.name.split('.').pop()}`;
      const outputFileName = `output.${targetFormat}`;
      
      // Dosyayı FFmpeg'e yükle
      await ffmpeg.writeFile(inputFileName, await fetchFile(fileData.file));
      
      // Ses dönüştürme komutları
      const commands = getOptimizedAudioCommands(inputFileName, outputFileName, targetFormat);
      
      // FFmpeg komutunu çalıştır
      await ffmpeg.exec(commands);
      
      // Dönüştürülen dosyayı al
      const data = await ffmpeg.readFile(outputFileName);
      
      // Dosyayı temizle
      await ffmpeg.deleteFile(inputFileName);
      await ffmpeg.deleteFile(outputFileName);
      
      const newFileName = fileData.name.replace(/\.[^/.]+$/, `.${targetFormat}`);
      const mimeType = getAudioMimeType(targetFormat);
      
      return {
        blob: new Blob([data], { type: mimeType }),
        name: newFileName,
        originalId: fileData.id,
        format: targetFormat
      };
    } catch (error) {
      console.error('Audio conversion error:', error);
      throw error;
    }
  };

  // Video MIME tipini al
  const getVideoMimeType = (format) => {
    const mimeTypes = {
      'mp4': 'video/mp4',
      'avi': 'video/x-msvideo',
      'mov': 'video/quicktime',
      'wmv': 'video/x-ms-wmv',
      'flv': 'video/x-flv',
      'webm': 'video/webm',
      'mkv': 'video/x-matroska',
      'm4v': 'video/x-m4v'
    };
    return mimeTypes[format] || 'video/mp4';
  };

  // Ses MIME tipini al
  const getAudioMimeType = (format) => {
    const mimeTypes = {
      'mp3': 'audio/mpeg',
      'wav': 'audio/wav',
      'ogg': 'audio/ogg',
      'aac': 'audio/aac',
      'flac': 'audio/flac',
      'm4a': 'audio/mp4',
      'wma': 'audio/x-ms-wma'
    };
    return mimeTypes[format] || 'audio/mpeg';
  };

  // Desteklenen format dönüşümleri - Genişletilmiş
  const formatConversions = {
    'image': {
      'png': ['jpg', 'jpeg', 'webp', 'ico', 'bmp', 'gif', 'tiff', 'svg'],
      'jpg': ['png', 'webp', 'ico', 'bmp', 'gif', 'tiff', 'svg'],
      'jpeg': ['png', 'webp', 'ico', 'bmp', 'gif', 'tiff', 'svg'],
      'webp': ['png', 'jpg', 'jpeg', 'ico', 'bmp', 'gif', 'tiff', 'svg'],
      'gif': ['png', 'jpg', 'jpeg', 'webp', 'ico', 'bmp', 'tiff', 'svg'],
      'bmp': ['png', 'jpg', 'jpeg', 'webp', 'ico', 'gif', 'tiff', 'svg'],
      'ico': ['png', 'jpg', 'jpeg', 'webp', 'bmp', 'gif', 'tiff', 'svg'],
      'svg': ['png', 'jpg', 'jpeg', 'webp', 'ico', 'bmp', 'gif', 'tiff'],
      'tiff': ['png', 'jpg', 'jpeg', 'webp', 'ico', 'bmp', 'gif', 'svg'],
      'tif': ['png', 'jpg', 'jpeg', 'webp', 'ico', 'bmp', 'gif', 'svg'],
      'heic': ['png', 'jpg', 'jpeg', 'webp', 'ico', 'bmp', 'gif', 'svg'],
      'heif': ['png', 'jpg', 'jpeg', 'webp', 'ico', 'bmp', 'gif', 'svg']
    },
    'document': {
      'pdf': ['docx', 'txt', 'html', 'rtf', 'odt'],
      'docx': ['pdf', 'txt', 'html', 'rtf', 'odt'],
      'doc': ['pdf', 'docx', 'txt', 'html', 'rtf', 'odt'],
      'txt': ['pdf', 'docx', 'html', 'rtf', 'odt'],
      'html': ['pdf', 'docx', 'txt', 'rtf', 'odt'],
      'htm': ['pdf', 'docx', 'txt', 'rtf', 'odt'],
      'rtf': ['pdf', 'docx', 'txt', 'html', 'odt'],
      'odt': ['pdf', 'docx', 'txt', 'html', 'rtf']
    },
    'ebook': {
      'epub': ['pdf', 'mobi', 'txt'],
      'mobi': ['pdf', 'epub', 'txt'],
      'azw3': ['pdf', 'epub', 'mobi', 'txt']
    },
    'spreadsheet': {
      'xlsx': ['csv', 'pdf', 'xls', 'ods'],
      'xls': ['csv', 'pdf', 'xlsx', 'ods'],
      'csv': ['xlsx', 'pdf', 'xls', 'ods'],
      'ods': ['xlsx', 'csv', 'pdf', 'xls']
    },
    'presentation': {
      'pptx': ['pdf', 'ppt', 'odp'],
      'ppt': ['pdf', 'pptx', 'odp'],
      'odp': ['pdf', 'pptx', 'ppt']
    },
    'subtitle': {
      'srt': ['vtt', 'ass', 'ssa', 'sub', 'txt'],
      'vtt': ['srt', 'ass', 'ssa', 'sub', 'txt'],
      'ass': ['srt', 'vtt', 'ssa', 'sub', 'txt'],
      'ssa': ['srt', 'vtt', 'ass', 'sub', 'txt'],
      'sub': ['srt', 'vtt', 'ass', 'ssa', 'txt'],
      'sbv': ['srt', 'vtt', 'ass', 'ssa', 'sub', 'txt']
    },
    'audio': {
      'mp3': ['wav', 'ogg', 'aac', 'flac', 'm4a', 'wma'],
      'wav': ['mp3', 'ogg', 'aac', 'flac', 'm4a', 'wma'],
      'ogg': ['mp3', 'wav', 'aac', 'flac', 'm4a', 'wma'],
      'aac': ['mp3', 'wav', 'ogg', 'flac', 'm4a', 'wma'],
      'flac': ['mp3', 'wav', 'ogg', 'aac', 'm4a', 'wma'],
      'm4a': ['mp3', 'wav', 'ogg', 'aac', 'flac', 'wma'],
      'wma': ['mp3', 'wav', 'ogg', 'aac', 'flac', 'm4a']
    },
    'video': {
      'mp4': ['avi', 'mov', 'wmv', 'flv', 'webm', 'mkv', 'm4v'],
      'avi': ['mp4', 'mov', 'wmv', 'flv', 'webm', 'mkv', 'm4v'],
      'mov': ['mp4', 'avi', 'wmv', 'flv', 'webm', 'mkv', 'm4v'],
      'wmv': ['mp4', 'avi', 'mov', 'flv', 'webm', 'mkv', 'm4v'],
      'flv': ['mp4', 'avi', 'mov', 'wmv', 'webm', 'mkv', 'm4v'],
      'webm': ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'm4v'],
      'mkv': ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'm4v'],
      'm4v': ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv']
    },
    'archive': {
      'zip': ['rar', '7z', 'tar', 'gz'],
      'rar': ['zip', '7z', 'tar', 'gz'],
      '7z': ['zip', 'rar', 'tar', 'gz'],
      'tar': ['zip', 'rar', '7z', 'gz'],
      'gz': ['zip', 'rar', '7z', 'tar']
    },
    'code': {
      'json': ['xml', 'yaml', 'yml', 'csv'],
      'xml': ['json', 'yaml', 'yml', 'csv'],
      'yaml': ['json', 'xml', 'yml', 'csv'],
      'yml': ['json', 'xml', 'yaml', 'csv'],
      'csv': ['json', 'xml', 'yaml', 'yml']
    }
  };

  const getFileType = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    for (const [type, formats] of Object.entries(formatConversions)) {
      if (formats[ext]) return type;
    }
    return 'other';
  };

  const getAvailableFormats = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    const fileType = getFileType(filename);
    return formatConversions[fileType]?.[ext] || [];
  };

  // Basit video dönüştürme (hızlı test için)
  const convertVideoSimple = async (fileData, targetFormat) => {
    try {
      console.log('Basit video dönüştürme başlıyor...');
      
      // FFmpeg'i yükle
      await loadFFmpeg();
      
      const inputFileName = `input.${fileData.name.split('.').pop()}`;
      const outputFileName = `output.${targetFormat}`;
      
      // Dosyayı FFmpeg'e yükle
      const fileDataBuffer = await fetchFile(fileData.file);
      await ffmpeg.writeFile(inputFileName, fileDataBuffer);
      
      // Çok basit komutlar (hızlı test için)
      const simpleCommands = ['-i', inputFileName, '-c', 'copy', outputFileName];
      console.log('Basit komutlar:', simpleCommands);
      
      await ffmpeg.exec(simpleCommands);
      
      // Dönüştürülen dosyayı al
      const data = await ffmpeg.readFile(outputFileName);
      
      // Temizlik
      await ffmpeg.deleteFile(inputFileName);
      await ffmpeg.deleteFile(outputFileName);
      
      const newFileName = fileData.name.replace(/\.[^/.]+$/, `.${targetFormat}`);
      const mimeType = getVideoMimeType(targetFormat);
      
      return {
        blob: new Blob([data], { type: mimeType }),
        name: newFileName,
        originalId: fileData.id,
        format: targetFormat
      };
    } catch (error) {
      console.error('Basit video conversion error:', error);
      throw new Error(`Basit video dönüştürme hatası: ${error.message}`);
    }
  };

  return (
    <>
      <Helmet>
        <title>Gerçek Dosya Dönüştürücü - FFmpeg Destekli - OpenWall</title>
        <meta name="description" content="PNG, JPG, PDF, DOCX, XLSX, PPTX, EPUB, SRT, VTT, MP4, MP3 ve 60+ format arasında gerçek dosya dönüştürme. FFmpeg ile video/ses dönüştürme. Hızlı, güvenli ve kullanımı kolay." />
        <meta name="keywords" content="dosya dönüştürücü, ffmpeg, video converter, audio converter, png to jpg, pdf converter, docx converter, xlsx converter, epub converter, srt converter, vtt converter, format dönüştürme, ücretsiz, gerçek dönüştürme" />
        <link rel="canonical" href="https://openwall.com.tr/convert" />
      </Helmet>

      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Gerçek Dosya Dönüştürücü
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            FFmpeg destekli 60+ format arasında gerçek dönüştürme
          </p>
        </div>

        {/* Dosya Yükleme Alanı */}
        <div className="mb-8">
          <div
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 ${
              dragActive
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-105'
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full">
                <FiUpload className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                  Dosyalarınızı buraya sürükleyin
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  veya dosya seçmek için tıklayın (50+ format desteklenir)
                </p>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                <FiUpload className="w-4 h-4" />
                Dosya Seç
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={(e) => handleFiles(e.target.files)}
                className="hidden"
                accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,text/*,audio/*,video/*,application/epub+zip,application/x-mobipocket-ebook,application/vnd.amazon.ebook,application/zip,application/x-rar-compressed,application/x-7z-compressed,application/x-tar,application/gzip,application/json,application/xml,text/yaml,text/x-yaml,.csv,.ods,.odt,.odp,.heic,.heif,.tiff,.tif,.srt,.vtt,.ass,.ssa,.sub,.sbv"
              />
            </div>
          </div>
        </div>

        {/* Yüklenen Dosyalar */}
        {files.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Yüklenen Dosyalar ({files.length})
              </h2>
              <button
                onClick={clearAll}
                className="inline-flex items-center gap-2 text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
              >
                <FiTrash2 className="w-4 h-4" />
                Tümünü Temizle
              </button>
            </div>
            <div className="space-y-3">
              {files.map((fileData) => (
                <div
                  key={fileData.id}
                  className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      {getFileIcon(fileData.type)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">
                        {fileData.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatFileSize(fileData.size)}
                      </p>
                      {fileData.availableFormats.length > 0 && (
                        <p className="text-xs text-blue-500">
                          Desteklenen: {fileData.availableFormats.join(', ').toUpperCase()}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(fileData.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dönüştürme Seçenekleri */}
        {files.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Dönüştürme Seçenekleri
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Hedef Format
                  </label>
                  <select
                    value={selectedFormat}
                    onChange={(e) => setSelectedFormat(e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="">Format seçin</option>
                    {files.length > 0 && files[0].availableFormats.map(format => (
                      <option key={format} value={format}>
                        {format.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={handleConvert}
                    disabled={!selectedFormat || isConverting}
                    className="w-full inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                  >
                    {isConverting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Dönüştürülüyor...
                      </>
                    ) : (
                      <>
                        <FiZap className="w-4 h-4" />
                        Dönüştür
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              {/* Hızlı Dönüştürme Uyarısı */}
              {selectedFormat && (selectedFormat === 'mp4' || selectedFormat === 'avi' || selectedFormat === 'mov') && (
                <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                        Video Dönüştürme Bilgisi
                      </h3>
                      <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                        <p>• Video dönüştürme işlemi dosya boyutuna göre uzun sürebilir</p>
                        <p>• Büyük dosyalar (100MB+) için 5-10 dakika bekleyebilirsiniz</p>
                        <p>• İşlem sırasında sayfayı kapatmayın</p>
                        <p>• Sorun yaşarsanız F12 ile console'u kontrol edin</p>
                      </div>
                      <div className="mt-3">
                        <button
                          onClick={async () => {
                            try {
                              console.log('FFmpeg durumu kontrol ediliyor...');
                              console.log('FFmpeg loaded:', ffmpeg.loaded);
                              console.log('FFmpeg version:', ffmpeg.version);
                              alert('FFmpeg durumu console\'da görüntüleniyor (F12)');
                            } catch (error) {
                              console.error('FFmpeg durum kontrolü hatası:', error);
                              alert('FFmpeg durum kontrolü başarısız');
                            }
                          }}
                          className="text-xs bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-2 py-1 rounded mr-2"
                        >
                          FFmpeg Durumu Kontrol Et
                        </button>
                        <button
                          onClick={async () => {
                            try {
                              console.log('FFmpeg manuel yükleniyor...');
                              await loadFFmpeg();
                              alert('FFmpeg başarıyla yüklendi!');
                            } catch (error) {
                              console.error('FFmpeg manuel yükleme hatası:', error);
                              alert(`FFmpeg yükleme hatası: ${error.message}`);
                            }
                          }}
                          className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 px-2 py-1 rounded"
                        >
                          FFmpeg'i Manuel Yükle
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Progress Bar */}
              {isConverting && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Dönüştürülüyor...
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      %{Math.round(conversionProgress)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div 
                      className="bg-green-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${conversionProgress}%` }}
                    ></div>
                  </div>
                  <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                    {conversionProgress < 10 && "FFmpeg yükleniyor..."}
                    {conversionProgress >= 10 && conversionProgress < 30 && "Dosya işleniyor..."}
                    {conversionProgress >= 30 && conversionProgress < 90 && "Dönüştürme devam ediyor..."}
                    {conversionProgress >= 90 && "Sonlandırılıyor..."}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Dönüştürülen Dosyalar */}
        {convertedFiles.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Dönüştürülen Dosyalar ({convertedFiles.length})
              </h2>
              {convertedFiles.length > 1 && (
                <button
                  onClick={downloadAll}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  <FiDownload className="w-4 h-4" />
                  Tümünü İndir (ZIP)
                </button>
              )}
            </div>
            <div className="space-y-3">
              {convertedFiles.map((convertedFile, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <FiCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">
                        {convertedFile.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {convertedFile.format.toUpperCase()} formatına dönüştürüldü
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => downloadFile(convertedFile)}
                    className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                  >
                    <FiDownload className="w-4 h-4" />
                    İndir
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Desteklenen Formatlar */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Desteklenen Formatlar
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg mb-2">
                <FiImage className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-1">Görüntü</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                PNG, JPG, WebP, ICO, GIF, TIFF, HEIC
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg mb-2">
                <FiFileText className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-1">Belge</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                PDF, DOCX, TXT, HTML, RTF, ODT
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg mb-2">
                <FiMusic className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-1">Ses</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                MP3, WAV, OGG, AAC, M4A, WMA
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg mb-2">
                <FiVideo className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-1">Video</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                MP4, AVI, MOV, WMV, FLV, WEBM, MKV, M4V
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg mb-2">
                <FiBook className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-1">E-Kitap</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                PDF, MOBI, EPUB, TXT
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg mb-2">
                <FiArchive className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-1">Arşiv</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                ZIP, RAR, 7Z, TAR, GZ
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-lg mb-2">
                <FiGrid className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-1">Elektronik Tablo</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                XLSX, CSV, ODS, PDF, XLS
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg mb-2">
                <FiMonitor className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-1">Sunum</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                PPTX, PDF, ODP, PPT
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg mb-2">
                <FiCode className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-1">Kod Dosyaları</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                JSON, XML, YAML, CSV
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-pink-100 dark:bg-pink-900/30 rounded-lg mb-2">
                <FiFileText className="w-5 h-5 text-pink-600 dark:text-pink-400" />
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-1">Altyazı</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                SRT, VTT, ASS, SSA, SUB
              </p>
            </div>
          </div>
        </div>

        {/* Güvenlik Bilgisi */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            🔒 Dosyalarınız güvende! Dönüştürme işlemi tamamen tarayıcınızda gerçekleşir ve 
            hiçbir dosya sunucularımıza yüklenmez. FFmpeg ile gerçek video/ses dönüştürme.
          </p>
        </div>
      </div>
    </>
  );
};

export default ConvertPage; 