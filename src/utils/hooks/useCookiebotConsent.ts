import { useState, useEffect, useCallback } from 'react';

export interface CookiebotConsent {
  necessary?: boolean;
  marketing?: boolean;
  preferences?: boolean;
  statistics?: boolean;
}

export const useCookiebotConsent = (cookiebotActivated: boolean) => {
  const [consent, setConsent] = useState<CookiebotConsent>({
    necessary: true,
    marketing: undefined,
    preferences: undefined,
    statistics: undefined,
  });

  const updateConsent = useCallback(consent => {
    setConsent({
      necessary: consent.necessary,
      marketing: consent.marketing,
      preferences: consent.preferences,
      statistics: consent.statistics,
    });
  }, []);

  useEffect(() => {
    // @ts-ignore
    if (cookiebotActivated && window?.Cookiebot?.consent) {
      // @ts-ignore
      const cookiebotConsent = window?.Cookiebot?.consent;
      updateConsent(cookiebotConsent);
    }
  }, [cookiebotActivated, updateConsent]);

  useEffect(() => {
    const observer = new MutationObserver(
      (mutationsList: MutationRecord[], _: MutationObserver) => {
        mutationsList.forEach(mutation => {
          // @ts-ignore
          const cookiebotConsent = window?.Cookiebot?.consent;
          const isCookiebotReady = cookiebotActivated && !!cookiebotConsent;

          if (mutation.type === 'childList' && isCookiebotReady) {
            // A child node has been added or removed to/from <head>.

            updateConsent(cookiebotConsent);
          }
        });
      }
    );

    observer.observe(document.getElementsByTagName('head')[0], {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
    };
  }, [cookiebotActivated, updateConsent]);

  return consent;
};
