import { createGlobalStyle } from 'styled-components';
import { COLORS, fontSize } from './theme';

export const GlobalStyle = createGlobalStyle`
  html {
    font-size: 16px;
  }
  body {
    font-family: 'Open Sans', sans-serif;
    background-color: ${COLORS.grey3};
    color: ${COLORS.text};
    ${fontSize(1, 1.25)};
    letter-spacing: -0.01em;
    line-height: 160%;

    @media print {
      background-color: ${COLORS.background};
    }
  }

  .dimmer {
    background-color: rgba(206, 229, 216, .85) !important;
  }

  .loader {
    :after {
      border-color: ${p =>
        p.theme.color.secondary} transparent transparent !important;
      }
  }

  *:focus {
    outline-color: ${p => p.theme.color.secondary};
    :-moz-focusring {
      outline: solid ${p => p.theme.color.secondary}
    }
  } 

  button:focus,
  a:focus {
    outline-color: ${p => p.theme.color.accent};
    :-moz-focusring {
      outline: solid ${p => p.theme.color.accent}
    }
  }

  input:focus {
    border-color: ${p => p.theme.color.secondary} !important;
  }

  input[type="checkbox"]:focus + label::before {
    outline: ${p => p.theme.color.accent} auto 1px;
  }
  
  hr {
    border: 1px solid rgba(0, 0, 0, 0.1);
    margin-top: 20px;
    margin-bottom: 20px;
  }
  
  a {
    color: ${p => p.theme.color.accent};
    text-decoration: underline;

    :hover {
      color: ${p => p.theme.color.accent};
      text-decoration: none;
    }
  }

  ul, ol {
    padding-left: 28px;
  }

  blockquote {
    margin-left: 28px;
    padding-left: 5px;
    border-left: 4px solid ${COLORS.grey3};
    font-style: oblique;
  }

  figure, iframe {
    margin-top: 40px;
    margin-bottom: 40px;
  }

  p, h1, h2, h3, h4, h5, h6 {
    margin-top: 16px;
    margin-bottom: 16px;
  }
  
  h1, h2, h3, h4, h5, h6 {
    color: ${COLORS.heading};
    font-family: 'Urbanist', sans-serif;
    font-weight: bold;
    line-height: 120%;
  }

  h1 {
    ${fontSize(1.93, 4, 120)}
    word-wrap: break-word;
  }

  h2 {
    ${fontSize(1.75, 2.25, 120)}
  }

  h3 {
    ${fontSize(1.5, 1.75, 120)}
  }

  h4 {
    ${fontSize(1.25, 1.375, 120)}
  }

  figure {
    &.image-style-align-left {
      float: left;
      margin-top: 10px;
      margin-right: 20px;
    }

    &.image-style-align-right {
      float: right;
      margin-top: 10px;
      margin-left: 20px;
    }
  }

  img, figure {
    max-width: 100%;
    object-fit: contain;
    display: block;
    margin-left: auto;
    margin-right: auto;
    border-radius: ${p => p.theme.borderRadius.lg};
  }

  figcaption {
    text-align: center;
    font-style: italic;
    ${p => p.theme.font.size.sm};
  }

  iframe {
    max-width: 100%;
    object-fit: contain;
    display: block;
    margin-left: auto;
    margin-right: auto;
    border-radius: ${p => p.theme.borderRadius.md};
  }

  button {
    background-color: transparent;
    border: none;
  }

  label {
    user-select: none;
    ${p => p.theme.font.size.sm};
  }

  #CybotCookiebotDialogPoweredbyCybot,
  #CybotCookiebotDialogPoweredByText {
    display: none !important;
  }
`;
