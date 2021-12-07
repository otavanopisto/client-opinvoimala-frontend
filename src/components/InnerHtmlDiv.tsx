import React from 'react';
import { useCookiebotConsent } from '../utils/hooks';

const noConcentContainerStyle = `
  min-height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  margin: 16px 0;

  background: #eee;
  border: 1px solid #ddd;
  border-radius: 8px;

  color: #666;
  font-size: 14px;
  font-style: italic;
`;

interface Props {
  html: string;
}

const InnerHtmlDiv: React.FC<Props> = ({ html }) => {
  const cookieConsent = useCookiebotConsent();

  let __html = html;

  if (!cookieConsent?.marketing) {
    // Marketing cookies not accepted. Show placeholder div instead of iframe elements (youtube embeds etc)
    __html = __html.replaceAll(
      /<iframe[^<]*<\/iframe>/gi,
      `<div style="${noConcentContainerStyle}">Markkinointievästeet tulee olla hyväksyttynä, jotta tämä sisältö voidaan näyttää.</div>`
    );
  }

  return <div dangerouslySetInnerHTML={{ __html }}></div>;
};

export default InnerHtmlDiv;
