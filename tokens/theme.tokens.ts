/**
 * Design tokens for the listing search app.
 *
 * Token *names* mirror the `@taty1977/my-component-library` (ui_components) Tailwind preset
 * so utilities are interchangeable (`bg-background-surface`, `text-text-primary`,
 * `border-border-subtle`, `bg-primary-500`, `rounded-lg`, `text-15`, `font-semibold`, ...).
 * Token *values* use a commercial real-estate palette inspired by crexi.com:
 * deep navy surfaces/text, a vivid blue call-to-action color and cool neutral grays.
 */
export type TokenTree = { [key: string]: string | TokenTree };

const tokens = {
  fontFamily: "'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  colors: {
    background: {
      canvas: '#f4f6f9',
      surface: '#ffffff',
      inverse: '#0f1a2c',
    },
    text: {
      primary: '#0f1a2c',
      secondary: '#3b4a60',
      muted: '#64748b',
      disabled: '#94a3b8',
      inverse: '#ffffff',
    },
    border: {
      subtle: '#e2e8f0',
      input: '#cbd5e1',
    },
    divider: '#e5e9f0',
    'chip-background': '#eef2f7',
    'filled-input-bg': '#f1f4f8',
    'backdrop-overlay': 'rgba(15, 26, 44, 0.5)',
    primary: {
      50: '#eef5ff',
      100: '#d9e8ff',
      200: '#bcd7ff',
      300: '#8ebeff',
      400: '#599aff',
      500: '#2f74ff',
      600: '#1a56f0',
      700: '#1442d6',
      800: '#1737ad',
      900: '#19348a',
    },
    secondary: {
      50: '#f3f6fa',
      100: '#e3e9f2',
      200: '#c6d2e3',
      300: '#9aafca',
      400: '#6884aa',
      500: '#47638c',
      600: '#364d70',
      700: '#2b3d5a',
      800: '#1d2a40',
      900: '#0f1a2c',
    },
    gray: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    info: { 100: '#d5f3fb', 500: '#0ba5d0', 700: '#07708e' },
    success: { 100: '#d3f5e4', 500: '#12a065', 700: '#0b6b43' },
    warning: { 100: '#fdefd3', 500: '#e48a0c', 700: '#9a5a05' },
    error: { 100: '#fde2e1', 500: '#e0362c', 700: '#a61d16' },
    action: {
      active: 'rgba(15, 26, 44, 0.6)',
      hover: 'rgba(15, 26, 44, 0.04)',
      selected: 'rgba(15, 26, 44, 0.08)',
      focus: 'rgba(47, 116, 255, 0.35)',
      disabled: 'rgba(15, 26, 44, 0.12)',
      'disabled-content': 'rgba(15, 26, 44, 0.38)',
    },
  },
  spacing: {
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    7: '28px',
    8: '32px',
    9: '36px',
    10: '40px',
    11: '44px',
    12: '48px',
    13: '52px',
    14: '56px',
    15: '60px',
    16: '64px',
    25: '100px',
  },
  radius: {
    xs: '2px',
    sm: '4px',
    md: '6px',
    lg: '8px',
    xl: '10px',
    round: '500px',
  },
  shadow: {
    card: '0 1px 2px rgba(15, 26, 44, 0.06), 0 1px 3px rgba(15, 26, 44, 0.08)',
    'card-hover': '0 10px 24px rgba(15, 26, 44, 0.12)',
  },
  'font-size': {
    12: '12px',
    13: '13px',
    15: '15px',
    18: '18px',
    24: '24px',
    28: '28px',
    38: '38px',
    46: '46px',
  },
  'font-weight': { regular: '400', medium: '500', semibold: '600', bold: '700' },
  'line-height': {
    14: '14px',
    18: '18px',
    20: '20px',
    22: '22px',
    28: '28px',
    38: '38px',
    42: '42px',
    56: '56px',
    68: '68px',
  },
};

/** New themes must preserve these token names while supplying their own string values. */
export type ThemeTokens = typeof tokens;

export default tokens;
