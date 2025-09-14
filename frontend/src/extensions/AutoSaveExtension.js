import { Extension } from '@tiptap/core'

export const AutoSave = Extension.create({
  name: 'autoSave',

  addOptions() {
    return {
      delay: 3000, // 3 saniye
      saveFunction: null, // Dışarıdan verilecek kaydetme fonksiyonu
      enabled: true,
    }
  },

  onCreate() {
    this.autoSaveTimer = null
    this.lastContent = null
    
    if (this.options.enabled && this.options.saveFunction) {
      this.startAutoSave()
    }
  },

  onDestroy() {
    this.stopAutoSave()
  },

  addCommands() {
    return {
      startAutoSave: () => ({ commands }) => {
        this.startAutoSave()
        return true
      },
      stopAutoSave: () => ({ commands }) => {
        this.stopAutoSave()
        return true
      },
      saveNow: () => ({ commands }) => {
        this.saveNow()
        return true
      },
    }
  },

  addKeyboardShortcuts() {
    return {
      'Mod-s': () => this.editor.commands.saveNow(),
    }
  },

  startAutoSave() {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer)
    }

    this.autoSaveTimer = setInterval(() => {
      this.checkAndSave()
    }, this.options.delay)
  },

  stopAutoSave() {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer)
      this.autoSaveTimer = null
    }
  },

  checkAndSave() {
    if (!this.options.saveFunction) return

    const currentContent = this.editor.getHTML()
    
    if (currentContent !== this.lastContent) {
      this.lastContent = currentContent
      this.saveNow()
    }
  },

  saveNow() {
    if (!this.options.saveFunction) return

    try {
      const content = this.editor.getHTML()
      this.options.saveFunction(content)
      
      // Başarılı kaydetme göstergesi
      this.showSaveIndicator(true)
    } catch (error) {
      console.error('Auto save failed:', error)
      this.showSaveIndicator(false)
    }
  },

  showSaveIndicator(success) {
    // Kaydetme durumu göstergesi
    const indicator = document.createElement('div')
    indicator.className = `save-indicator ${success ? 'success' : 'error'}`
    indicator.textContent = success ? 'Kaydedildi' : 'Kaydetme hatası'
    indicator.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 10px 20px;
      border-radius: 5px;
      color: white;
      font-weight: bold;
      z-index: 1000;
      transition: opacity 0.3s;
      ${success ? 'background-color: #10b981;' : 'background-color: #ef4444;'}
    `

    document.body.appendChild(indicator)

    setTimeout(() => {
      indicator.style.opacity = '0'
      setTimeout(() => {
        if (indicator.parentNode) {
          indicator.parentNode.removeChild(indicator)
        }
      }, 300)
    }, 2000)
  },
}) 