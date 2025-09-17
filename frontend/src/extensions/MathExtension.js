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

export const MathInline = Node.create({
  name: 'mathInline',

  group: 'inline',

  inline: true,

  atom: true,

  addAttributes() {
    return {
      latex: {
        default: '',
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'span.math-inline',
        getAttrs: element => ({
          latex: element.getAttribute('data-latex') || element.textContent || '',
        }),
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const { latex } = HTMLAttributes
    return [
      'span',
      mergeAttributes(HTMLAttributes, {
        class: 'math-inline',
        'data-latex': latex,
      }),
      `$${latex}$`,
    ]
  },

  addCommands() {
    return {
      setMathInline: (attributes) => ({ commands }) =>
        commands.insertContent({ type: this.name, attrs: attributes }),
    }
  },

  addNodeView() {
    return ({ node }) => {
      const dom = document.createElement('span')
      dom.className = 'math-inline'

      const render = (latex) => {
        try {
          katex.render(latex || '', dom, {
            displayMode: false,
            throwOnError: false,
          })
        } catch (e) {
          dom.textContent = `$${latex || ''}$`
        }
      }

      render(node.attrs.latex)

      return {
        dom,
        update: (updatedNode) => {
          if (updatedNode.type.name !== this.name) return false
          render(updatedNode.attrs.latex)
          return true
        },
        ignoreMutation: () => true,
      }
    }
  },
})

export const MathBlock = Node.create({
  name: 'mathBlock',

  group: 'block',

  atom: true,

  addAttributes() {
    return {
      latex: {
        default: '',
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div.math-block',
        getAttrs: element => ({
          latex: element.getAttribute('data-latex') || element.textContent || '',
        }),
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const { latex } = HTMLAttributes
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        class: 'math-block',
        'data-latex': latex,
      }),
      `$${latex}$`,
    ]
  },

  addCommands() {
    return {
      setMathBlock: (attributes) => ({ commands }) =>
        commands.insertContent({ type: this.name, attrs: attributes }),
    }
  },

  addNodeView() {
    return ({ node }) => {
      const dom = document.createElement('div')
      dom.className = 'math-block'

      const render = (latex) => {
        try {
          katex.render(latex || '', dom, {
            displayMode: true,
            throwOnError: false,
          })
        } catch (e) {
          dom.textContent = `$${latex || ''}$`
        }
      }

      render(node.attrs.latex)

      return {
        dom,
        update: (updatedNode) => {
          if (updatedNode.type.name !== this.name) return false
          render(updatedNode.attrs.latex)
          return true
        },
        ignoreMutation: () => true,
      }
    }
  },
})