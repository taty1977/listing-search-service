/**
 * Tailwind preset compatible with the ui_components (`@taty1977/my-component-library`) preset:
 * tokens are emitted once as CSS custom properties on `:root`, and every utility references
 * `var(--...)`, so swapping the token values (or adding a theme class) re-skins the app.
 */
import type { Config } from 'tailwindcss';
import type { PluginAPI } from 'tailwindcss/types/config';
import tokens, { type TokenTree } from './tokens/theme.tokens';

type ScaleName = 'spacing' | 'radius' | 'shadow' | 'font-size' | 'font-weight' | 'line-height';

const isLeaf = (value: string | TokenTree): value is string => typeof value === 'string';

// { text: { primary: '#000' } } -> { '--text-primary': '#000' }
const toCssVars = (tree: TokenTree, path: string[] = []): Record<string, string> =>
  Object.entries(tree).reduce<Record<string, string>>((vars, [key, value]) => {
    const next = [...path, key];
    return isLeaf(value) ? { ...vars, [`--${next.join('-')}`]: value } : { ...vars, ...toCssVars(value, next) };
  }, {});

// Same tree shape with var(--...) references.
const toVarRefs = (tree: TokenTree, path: string[] = []): TokenTree =>
  Object.fromEntries(
    Object.entries(tree).map(([key, value]) => {
      const next = [...path, key];
      return [key, isLeaf(value) ? `var(--${next.join('-')})` : toVarRefs(value, next)];
    }),
  );

const scale = (name: ScaleName) => toVarRefs(tokens[name], [name]) as Record<string, string>;

const preset = {
  content: [],
  theme: {
    extend: {
      colors: toVarRefs(tokens.colors),
      spacing: scale('spacing'),
      borderRadius: scale('radius'),
      fontFamily: { sans: ['var(--font-family)'] },
      fontSize: scale('font-size'),
      fontWeight: scale('font-weight'),
      lineHeight: scale('line-height'),
      boxShadow: scale('shadow'),
    },
  },
  plugins: [
    ({ addBase }: PluginAPI) => {
      addBase({
        ':root': {
          '--font-family': tokens.fontFamily,
          ...toCssVars(tokens.colors),
          ...toCssVars({ spacing: tokens.spacing }),
          ...toCssVars({ radius: tokens.radius }),
          ...toCssVars({ shadow: tokens.shadow }),
          ...toCssVars({ 'font-size': tokens['font-size'] }),
          ...toCssVars({ 'font-weight': tokens['font-weight'] }),
          ...toCssVars({ 'line-height': tokens['line-height'] }),
        },
      });
    },
  ],
} satisfies Config;

export default preset;
