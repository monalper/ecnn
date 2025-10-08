// Drop Cap Extension for TipTap
import { Mark, mergeAttributes } from '@tiptap/core';

export const DropCap = Mark.create({
  name: 'dropCap',

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span.drop-cap',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, { class: 'drop-cap' }), 0];
  },

  addCommands() {
    return {
      setDropCap: () => ({ commands }) => {
        return commands.setMark(this.name);
      },
      toggleDropCap: () => ({ commands }) => {
        return commands.toggleMark(this.name);
      },
      unsetDropCap: () => ({ commands }) => {
        return commands.unsetMark(this.name);
      },
    };
  },
});

