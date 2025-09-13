import { Node, mergeAttributes } from '@tiptap/core'
import React from 'react'
import 'katex/dist/katex.min.css'

export const Math = Node.create({
  name: 'math',

  group: 'block',

  atom: true,

  addAttributes() {
    return {
      content: {
        default: '',
      },
      display: {
        default: 'block', // 'block' or 'inline'
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div.math-block',
        getAttrs: element => ({
          content: element.textContent || '',
          display: 'block',
        }),
      },
      {
        tag: 'span.math-inline',
        getAttrs: element => ({
          content: element.textContent || '',
          display: 'inline',
        }),
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const { content, display } = HTMLAttributes
    const tag = display === 'block' ? 'div' : 'span'
    const className = display === 'block' ? 'math-block' : 'math-inline'

    try {
      // KaTeX ile render et - browser-safe version
      if (typeof window !== 'undefined' && window.katex) {
        const rendered = window.katex.renderToString(content, {
          displayMode: display === 'block',
          throwOnError: false,
        })
        return [tag, mergeAttributes(HTMLAttributes, { class: className }), rendered]
      } else {
        // KaTeX yüklenmemişse raw LaTeX göster
        return [tag, mergeAttributes(HTMLAttributes, { class: className }), `$${content}$`]
      }
    } catch (error) {
      // Hata durumunda raw LaTeX göster
      return [tag, mergeAttributes(HTMLAttributes, { class: className }), `$${content}$`]
    }
  },

  addCommands() {
    return {
      setMath: (attributes) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: attributes,
        })
      },
    }
  },

  addKeyboardShortcuts() {
    return {
      'Mod-m': () => this.editor.commands.setMath({ content: '', display: 'block' }),
    }
  },
}) 