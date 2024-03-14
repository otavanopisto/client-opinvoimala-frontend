import { DefaultTheme, ThemeProvider as Provider } from 'styled-components';

const primaryColor = '#315363';
const secondaryColor = '#0B1159';

export const COLORS = Object.freeze({
  primary: primaryColor,
  primaryLight: '#CEE5D8',
  primaryLightest: '#CEE5D833',
  secondary: secondaryColor,
  secondaryInverse: '#F4F5F7',
  accent: '#DC0058',
  accentLight: '#EDE2E7',
  accentDark: '#2A143F',
  progress: '#ffc850',
  grey: '#555555',
  grey2: '#4F4F4F',
  grey3: '#F4F5F7',
  grey4: '#e0e0e0',
  foreground: '#000000',
  background: '#ffffff',
  heading: secondaryColor,
  text: '#555555',
});

export const BREAKPOINTS = Object.freeze({
  mobile: 768,
  tablet: 992,
  laptop: 1100,
});

export const fontSize = (sm: number, md: number, lineHeight?: number) => {
  return `
  font-size: ${sm}rem;

    line-height: ${lineHeight ?? 160}%;
    @media (min-width: ${BREAKPOINTS.mobile}px) {
      font-size: ${md}rem;
    }
  `;
};

export const theme: DefaultTheme = {
  color: COLORS,

  borderRadius: {
    sm: '0.25rem',
    md: '0.625rem',
    lg: '1rem',
    xl: '1.5rem',
  },

  spacing: {
    sm: '0.375rem',
    md: '0.625rem',
    lg: '1.5rem',
    xl: '2.5rem',
  },

  breakpoint: {
    mobile: `(min-width: ${BREAKPOINTS.mobile}px)`,
    tablet: `(min-width: ${BREAKPOINTS.tablet}px)`,
    laptop: `(min-width: ${BREAKPOINTS.laptop}px)`,
  },

  shadows: [
    'box-shadow: 0px 4px 18px rgba(11, 17, 89, 0.25)',
    'box-shadow: 0px 4px 6px rgba(50, 50, 93, 0.11)',
    'box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.08)',
  ],

  font: {
    main: 'Open sans',
    secondary: 'Urbanist',
    size: {
      xs: fontSize(0.75, 0.875),
      sm: fontSize(0.875, 1),
      md: fontSize(1, 1.25),
      lg: fontSize(1.125, 1.375),
      xl: fontSize(1.375, 1.75),
    },
    h1: fontSize(1, 4),
    h2: fontSize(1.75, 2.25, 120),
    h3: fontSize(1.5, 1.75, 120),
    h4: fontSize(1.25, 1.375, 120),
    h5: fontSize(1.125, 1.25, 120),
    h6: fontSize(1, 1.125, 120),
  },
};

export const ThemeProvider = Provider;
