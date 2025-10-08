import { Mark, mergeAttributes } from '@tiptap/core'

export const InlineCode = Mark.create({
  name: 'inlineCodeMark',

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  parseHTML() {
    return [
      {
        tag: 'span.inline-code',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(HTMLAttributes, { class: 'inline-code' }), 0]
  },

  addCommands() {
    return {
      setInlineCode: () => ({ commands }) => {
        return commands.setMark(this.name)
      },
      unsetInlineCode: () => ({ commands }) => {
        return commands.unsetMark(this.name)
      },
      toggleInlineCode: () => ({ commands }) => {
        return commands.toggleMark(this.name)
      },
    }
  },

  addKeyboardShortcuts() {
    return {
      'Mod-`': () => this.editor.commands.toggleInlineCode(),
    }
  },
}) 