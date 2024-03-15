import React, { useEffect } from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react-lite';
import { useStore } from '../store/storeContext';
import { useCookiebotConsent } from '../utils/hooks/useCookiebotConsent';
import { useWindowDimensions } from '../utils/hooks';
const Container = styled.div`
  position: relative;
  .youtube-iframe-container {
    position: relative;
    height: 0;
    iframe {
      position: absolute;
      top: -40px; // without this, the iframe is not positioned correctly beacuse iframe style has margin-top: 40px
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
  p {
    line-height: 160% !important;
  }
`;

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
  font-size: 0.875rem;
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
  const { isMobile } = useWindowDimensions();
  /**
   * Detect embedded Pym.js content and initialize Pym if found any
   */
  useEffect(() => {
    // @ts-ignore
    if (window.pym && html.includes('data-pym-src')) {
      // @ts-ignore
      window.pym.autoInit();
    }
  }, [html]);

  let __html = html;

  /**
   * Replace all embedded iframes with placeholder text if cookies are not accepted
   */

  const embedContentRegex = /<iframe[^>]*src="([^"]*)"[^<]*<\/iframe>/gi;
  const hasYoutubeContent =
    embedContentRegex.test(__html) && __html.includes('youtube');

  if (!cookieConsent?.marketing) {
    // Matches an <iframe ... src="xyz"></iframe> element and captures its src-value as a group $1.
    // Placeholder element to be shown instead of the embedded iframe element.
    const placeholderElement = `
      <div style="${noConsentContainerStyle}">
        <div>Markkinointievästeet tulee olla hyväksyttynä, jotta tämä sisältö voidaan näyttää.</div>
        <a href="$1" target="_blank">$1</a>
      </div>`;

    // Marketing cookies are not accepted. Show placeholder div instead of iframe elements (youtube embeds etc)
    __html = __html.replaceAll(embedContentRegex, placeholderElement);
  }
  // This is for the mobile view, so that the content image inline styles are removed
  if (isMobile) {
    const figureImgStyleRegex = /<(figure|img)\s[^>]*style="[^"]*"[^>]*>/gi;

    __html = __html.replace(figureImgStyleRegex, match => {
      return match.replace(/style="[^"]*"/i, '');
    });
  }

  if (isMobile && hasYoutubeContent) {
    const widthRegex = /width="(\d+)"/i;
    const heightRegex = /height="(\d+)"/i;

    // we get the width and height of the iframe from the html
    const widthMatch = __html.match(widthRegex);
    const heightMatch = __html.match(heightRegex);

    const width = widthMatch ? parseInt(widthMatch[1], 10) : null;
    const height = heightMatch ? parseInt(heightMatch[1], 10) : null;

    // we calculate the aspect ratio of the iframe and apply it to the container
    const aspectRatio = width && height ? (height / width) * 100 : 56.25; // assume 16:9 if nothing else is given

    __html = __html.replace(embedContentRegex, match => {
      return `
        <div class="youtube-iframe-container" style="padding-bottom: ${aspectRatio}%"}>
          ${match}
        </div>
      `;
    });
  }

  return <Container dangerouslySetInnerHTML={{ __html }}></Container>;
});

export default InnerHtmlDiv;
