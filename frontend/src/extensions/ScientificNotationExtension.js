import { Node, mergeAttributes } from '@tiptap/core'

export const ScientificNotation = Node.create({
  name: 'scientificNotation',

  group: 'inline',

  atom: true,

  addAttributes() {
    return {
      coefficient: {
        default: '',
      },
      exponent: {
        default: '',
      },
      unit: {
        default: '',
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'span.scientific-notation',
        getAttrs: element => ({
          coefficient: element.getAttribute('data-coefficient') || '',
          exponent: element.getAttribute('data-exponent') || '',
          unit: element.getAttribute('data-unit') || '',
        }),
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const { coefficient, exponent, unit } = HTMLAttributes

    return [
      'span',
      mergeAttributes(HTMLAttributes, {
        class: 'scientific-notation',
        'data-coefficient': coefficient,
        'data-exponent': exponent,
        'data-unit': unit,
      }),
      [
        'span',
        { class: 'coefficient' },
        coefficient
      ],
      [
        'span',
        { class: 'times' },
        ' × '
      ],
      [
        'span',
        { class: 'base' },
        '10'
      ],
      [
        'sup',
        { class: 'exponent' },
        exponent
      ],
      unit && [
        'span',
        { class: 'unit' },
        ' ',
        unit
      ]
    ]
  },

  addCommands() {
    return {
      setScientificNotation: (attributes) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: attributes,
        })
      },
    }
  },

  addKeyboardShortcuts() {
    return {
      'Mod-s': () => this.editor.commands.setScientificNotation({ coefficient: '', exponent: '', unit: '' }),
    }
  },
}) 