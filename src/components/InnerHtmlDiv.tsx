import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../store/storeContext';
import { useCookiebotConsent } from '../utils/hooks/useCookiebotConsent';

const noConsentContainerStyle = `
  min-height: 100px;
  display: flex;
  flex-direction: column;
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

const InnerHtmlDiv: React.FC<Props> = observer(({ html }) => {
  const {
    settings: { isCookiebotActivated },
  } = useStore();

  const cookieConsent = useCookiebotConsent(isCookiebotActivated);

  let __html = html;

  if (!cookieConsent?.marketing) {
    // Matches an <iframe ... src="xyz"></iframe> element and captures its src-value as a group $1.
    const embedContentRegex = /<iframe[^>]*src="([^"]*)"[^<]*<\/iframe>/gi;

    // Placeholder element to be shown instead of the embedded iframe element.
    const placeholderElement = `
      <div style="${noConsentContainerStyle}">
        <div>Markkinointievästeet tulee olla hyväksyttynä, jotta tämä sisältö voidaan näyttää.</div>
        <a href="$1" target="_blank">$1</a>
      </div>`;

    // Marketing cookies are not accepted. Show placeholder div instead of iframe elements (youtube embeds etc)
    __html = __html.replaceAll(embedContentRegex, placeholderElement);
  }

  return <div dangerouslySetInnerHTML={{ __html }}></div>;
});

export default InnerHtmlDiv;
