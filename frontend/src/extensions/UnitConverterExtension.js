import { Node, mergeAttributes } from '@tiptap/core'

export const UnitConverter = Node.create({
  name: 'unitConverter',

  group: 'inline',

  atom: true,

  addAttributes() {
    return {
      value: {
        default: '',
      },
      fromUnit: {
        default: '',
      },
      toUnit: {
        default: '',
      },
      convertedValue: {
        default: '',
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'span.unit-converter',
        getAttrs: element => ({
          value: element.getAttribute('data-value') || '',
          fromUnit: element.getAttribute('data-from-unit') || '',
          toUnit: element.getAttribute('data-to-unit') || '',
          convertedValue: element.getAttribute('data-converted-value') || '',
        }),
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const { value, fromUnit, toUnit, convertedValue } = HTMLAttributes

    return [
      'span',
      mergeAttributes(HTMLAttributes, {
        class: 'unit-converter',
        'data-value': value,
        'data-from-unit': fromUnit,
        'data-to-unit': toUnit,
        'data-converted-value': convertedValue,
      }),
      [
        'span',
        { class: 'original-value' },
        value,
        ' ',
        fromUnit
      ],
      [
        'span',
        { class: 'conversion-arrow' },
        ' → '
      ],
      [
        'span',
        { class: 'converted-value' },
        convertedValue,
        ' ',
        toUnit
      ]
    ]
  },

  addCommands() {
    return {
      setUnitConverter: (attributes) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: attributes,
        })
      },
    }
  },

  addKeyboardShortcuts() {
    return {
      'Mod-u': () => this.editor.commands.setUnitConverter({ value: '', fromUnit: '', toUnit: '', convertedValue: '' }),
    }
  },
}) 