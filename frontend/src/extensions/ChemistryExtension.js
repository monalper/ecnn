import { Node, mergeAttributes } from '@tiptap/core'

export const Chemistry = Node.create({
  name: 'chemistry',

  group: 'block',

  atom: true,

  addAttributes() {
    return {
      formula: {
        default: '',
      },
      name: {
        default: '',
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div.chemistry-formula',
        getAttrs: element => ({
          formula: element.getAttribute('data-formula') || '',
          name: element.getAttribute('data-name') || '',
        }),
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const { formula, name } = HTMLAttributes

    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        class: 'chemistry-formula',
        'data-formula': formula,
        'data-name': name,
      }),
      [
        'div',
        { class: 'formula-display' },
        formula
      ],
      name && [
        'div',
        { class: 'formula-name' },
        name
      ]
    ]
  },

  addCommands() {
    return {
      setChemistry: (attributes) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: attributes,
        })
      },
    }
  },

  addKeyboardShortcuts() {
    return {
      'Mod-c': () => this.editor.commands.setChemistry({ formula: '', name: '' }),
    }
  },
}) 