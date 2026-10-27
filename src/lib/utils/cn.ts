import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

// Teach tailwind-merge the token scales from `tokens/theme.tokens.cjs`, otherwise e.g. `text-15`
// is treated as a text color and `font-regular` as a font family.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: ['12', '13', '15', '18', '24', '28', '38', '46'] }],
      'font-weight': [{ font: ['regular'] }],
      rounded: [{ rounded: ['round'] }],
    },
  },
});

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
