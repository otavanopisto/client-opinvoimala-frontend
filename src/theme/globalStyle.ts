import { createGlobalStyle } from 'styled-components';
import { COLORS, fontSize } from './theme';

export const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Open Sans', sans-serif;
    background-color: ${COLORS.grey3};
    color: ${COLORS.text};
    ${fontSize(16, 20)};
    letter-spacing: -0.01em;
    line-height: 160%;
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
    margin-top: 20px;
    margin-bottom: 20px;
  }
  
  h1, h2, h3, h4, h5, h6 {
    color: ${COLORS.heading};
    font-family: 'Urbanist', sans-serif;
    font-weight: bold;
    line-height: 120%;
  }

  h1 {
    ${fontSize(36, 64, 120)}
    word-wrap: break-word;
  }

  h2 {
    ${fontSize(28, 36, 120)}
  }

  h3 {
    ${fontSize(24, 28, 120)}
  }

  h4 {
    ${fontSize(20, 22, 120)}
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

  input {
    &:focus {
      border-color: ${p => p.theme.color.accent} !important;
    }
  }
  input[type="checkbox"]:focus + label::before {
    outline: ${p => p.theme.color.accent} auto 1px;
  }

  #CybotCookiebotDialogPoweredbyCybot,
  #CybotCookiebotDialogPoweredByText {
    display: none !important;
  }
`;
