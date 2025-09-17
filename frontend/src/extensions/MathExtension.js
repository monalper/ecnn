import { Node, mergeAttributes, nodeInputRule } from '@tiptap/core'
import React from 'react'
import katex from 'katex'
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

    // Kaydedilen HTML içinde LaTeX metnini veri olarak tut. Görünümde NodeView ile KaTeX render edilir.
    return [
      tag,
      mergeAttributes(HTMLAttributes, {
        class: className,
        'data-latex': content,
        'data-display': display,
      }),
      `$${content}$`,
    ]
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

  addInputRules() {
    // $$...$$  -> block math
    const blockInput = nodeInputRule({
      find: /\$\$([\s\S]+?)\$\$$/, // greedy, supports newlines
      type: this.type,
      getAttributes: match => ({ content: (match[1] || '').trim(), display: 'block' }),
    })

    // $...$ -> inline math (single line)
    const inlineInput = nodeInputRule({
      find: /\$(.+?)\$/,
      type: this.type,
      getAttributes: match => ({ content: (match[1] || '').trim(), display: 'inline' }),
    })

    return [blockInput, inlineInput]
  },

  addNodeView() {
    return ({ node }) => {
      const display = node.attrs.display === 'inline' ? 'inline' : 'block'
      const dom = document.createElement(display === 'block' ? 'div' : 'span')
      dom.className = display === 'block' ? 'math-block' : 'math-inline'

      const render = (latex) => {
        try {
          katex.render(latex || '', dom, {
            displayMode: display === 'block',
            throwOnError: false,
          })
        } catch (e) {
          dom.textContent = `$${latex || ''}$`
        }
      }

      render(node.attrs.content)

      return {
        dom,
        update: (updatedNode) => {
          if (updatedNode.type.name !== this.name) return false
          const newDisplay = updatedNode.attrs.display === 'inline' ? 'inline' : 'block'
          if (newDisplay !== display) return false
          render(updatedNode.attrs.content)
          return true
        },
        ignoreMutation: () => true,
      }
    }
  },
}) 