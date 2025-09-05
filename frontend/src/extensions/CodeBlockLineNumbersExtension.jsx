import { Extension } from '@tiptap/core'

export const CodeBlockLineNumbers = Extension.create({
  name: 'codeBlockLineNumbers',

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  addGlobalAttributes() {
    return [
      {
        types: ['codeBlock'],
        attributes: {
          showLineNumbers: {
            default: true,
            parseHTML: element => element.getAttribute('data-show-line-numbers') !== 'false',
            renderHTML: attributes => {
              if (!attributes.showLineNumbers) {
                return {}
              }
              return { 'data-show-line-numbers': 'true' }
            },
          },
        },
      },
    ]
  },
}) 