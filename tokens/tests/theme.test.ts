import postcss from 'postcss';
import tailwindcss from 'tailwindcss';
import { describe, expect, expectTypeOf, it } from 'vitest';
import preset from '../../tailwind.preset';
import tokens, { type ThemeTokens, type TokenTree } from '../theme.tokens';

const flatten = (tree: TokenTree, prefix = ''): Record<string, string> =>
  Object.fromEntries(
    Object.entries(tree).flatMap(([key, value]) => {
      const name = prefix ? `${prefix}-${key}` : key;
      return typeof value === 'string'
        ? [[`--${name}`, value]]
        : Object.entries(flatten(value, name));
    }),
  );

describe('theme contract', () => {
  it('allows new theme values but requires every default token', () => {
    const alternative: ThemeTokens = {
      ...tokens,
      colors: {
        ...tokens.colors,
        background: { ...tokens.colors.background, canvas: '#000000' },
      },
    };

    expect(alternative.colors.background.canvas).toBe('#000000');
    expectTypeOf<Omit<ThemeTokens, 'colors'>>().not.toExtend<ThemeTokens>();
    expectTypeOf<{ colors: { background: { canvas: string } } }>().not.toExtend<ThemeTokens>();
    expectTypeOf<Omit<ThemeTokens['colors']['text'], 'primary'>>().not.toExtend<ThemeTokens['colors']['text']>();
    expectTypeOf<Omit<ThemeTokens['colors']['background'], 'canvas'> & { canvas: number }>()
      .not.toExtend<ThemeTokens['colors']['background']>();
    expectTypeOf<ThemeTokens['shadow']['card']>().toEqualTypeOf<string>();
  });

  it('emits every token and maps utilities to CSS variables', async () => {
    const { colors, fontFamily, ...scales } = tokens;
    const expected = {
      '--font-family': fontFamily,
      ...flatten(colors),
      ...flatten(scales),
    };
    const result = await postcss([
      tailwindcss({
        presets: [preset],
        content: [{
          raw: 'bg-background-canvas text-text-primary p-4 rounded-lg font-sans text-15 font-semibold leading-22 shadow-card hover:shadow-card-hover',
        }],
      }),
    ]).process('@tailwind base; @tailwind utilities;', { from: undefined });
    const declarations: Record<string, string> = {};
    result.root.walkRules(':root', (rule) => {
      rule.walkDecls((declaration) => {
        declarations[declaration.prop] = declaration.value;
      });
    });

    expect(declarations).toEqual(expected);
    for (const [name, value] of Object.entries(expected)) {
      expect(value.trim(), name).not.toBe('');
    }

    const utilities = [
      ['.bg-background-canvas', 'background-color', '--background-canvas'],
      ['.text-text-primary', 'color', '--text-primary'],
      ['.p-4', 'padding', '--spacing-4'],
      ['.rounded-lg', 'border-radius', '--radius-lg'],
      ['.font-sans', 'font-family', '--font-family'],
      ['.text-15', 'font-size', '--font-size-15'],
      ['.font-semibold', 'font-weight', '--font-weight-semibold'],
      ['.leading-22', 'line-height', '--line-height-22'],
      ['.shadow-card', '--tw-shadow', '--shadow-card'],
      ['.hover\\:shadow-card-hover:hover', '--tw-shadow', '--shadow-card-hover'],
    ];
    for (const [selector, property, name] of utilities) {
      const values: string[] = [];
      result.root.walkRules(selector, (rule) => {
        rule.walkDecls(property, (declaration) => { values.push(declaration.value); });
      });
      expect(values, `${selector} ${property}`).toContain(`var(${name})`);
    }
  });
});
