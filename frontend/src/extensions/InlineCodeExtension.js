import { Mark } from '@tiptap/core'

export const InlineCode = Mark.create({
  name: 'inlineCode',

  addOptions() {
    return {
      HTMLAttributes: {
        class: 'inline-code',
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'code',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['code', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
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

function mergeAttributes(...objects) {
  return objects.reduce((items, item) => {
    const attributes = { ...items }

    Object.keys(item).forEach(key => {
      const exists = attributes[key]
      const value = item[key]

      if (exists && exists !== value) {
        if (!Array.isArray(exists)) {
          attributes[key] = [exists]
        }

        if (Array.isArray(value)) {
          attributes[key] = [...attributes[key], ...value]
        } else {
          attributes[key] = [...attributes[key], value]
        }
      } else {
        attributes[key] = value
      }
    })

    return attributes
  }, {})
} 