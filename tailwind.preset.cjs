/**
 * Tailwind preset compatible with the ui_components (`@taty1977/my-component-library`) preset:
 * tokens are emitted once as CSS custom properties on `:root`, and every utility references
 * `var(--...)`, so swapping the token values (or adding a theme class) re-skins the app.
 */
const tokens = require('./tokens/theme.tokens.cjs');

const isLeaf = (value) => typeof value === 'string';

// { text: { primary: '#000' } } -> { '--text-primary': '#000' }
const toCssVars = (tree, path = []) =>
  Object.entries(tree).reduce((vars, [key, value]) => {
    const next = [...path, key];
    return isLeaf(value) ? { ...vars, [`--${next.join('-')}`]: value } : { ...vars, ...toCssVars(value, next) };
  }, {});

// Same tree shape with var(--...) references.
const toVarRefs = (tree, path = []) =>
  Object.fromEntries(
    Object.entries(tree).map(([key, value]) => {
      const next = [...path, key];
      return [key, isLeaf(value) ? `var(--${next.join('-')})` : toVarRefs(value, next)];
    }),
  );

const scale = (name) => toVarRefs(tokens[name], [name]);

module.exports = {
  theme: {
    extend: {
      colors: toVarRefs(tokens.colors),
      spacing: scale('spacing'),
      borderRadius: scale('radius'),
      fontFamily: { sans: ['var(--font-family)'] },
      fontSize: scale('font-size'),
      fontWeight: scale('font-weight'),
      lineHeight: scale('line-height'),
      boxShadow: {
        card: '0 1px 2px rgba(15, 26, 44, 0.06), 0 1px 3px rgba(15, 26, 44, 0.08)',
        'card-hover': '0 10px 24px rgba(15, 26, 44, 0.12)',
      },
    },
  },
  plugins: [
    ({ addBase }) => {
      addBase({
        ':root': {
          '--font-family': tokens.fontFamily,
          ...toCssVars(tokens.colors),
          ...toCssVars({ spacing: tokens.spacing }),
          ...toCssVars({ radius: tokens.radius }),
          ...toCssVars({ 'font-size': tokens['font-size'] }),
          ...toCssVars({ 'font-weight': tokens['font-weight'] }),
          ...toCssVars({ 'line-height': tokens['line-height'] }),
        },
      });
    },
  ],
};
