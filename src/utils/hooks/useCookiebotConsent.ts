import { useState, useEffect } from 'react';
import { useStore } from '../../store/storeContext';

interface CookiebotConsent {
  necessary?: boolean;
  marketing?: boolean;
  preferences?: boolean;
  statistics?: boolean;
}

export const useCookiebotConsent = () => {
  const {
    settings: { state, settings },
  } = useStore();

  const [cookiebotActivated, setCookiebotActivated] = useState<boolean>();

  const [consent, setConsent] = useState<CookiebotConsent>({
    necessary: true,
    marketing: undefined,
    preferences: undefined,
    statistics: undefined,
  });

  useEffect(() => {
    if (state === 'FETCHED' && settings) {
      setCookiebotActivated(!!settings?.scripts?.cookiebotDomainGroupId);
    }
  }, [settings, state]);

  useEffect(() => {
    const observer = new MutationObserver(
      (mutationsList: MutationRecord[], _: MutationObserver) => {
        mutationsList.forEach(mutation => {
          // @ts-ignore
          const cookiebotConsent = window?.Cookiebot?.consent;
          const isCookiebotReady = cookiebotActivated && !!cookiebotConsent;

          if (mutation.type === 'childList' && isCookiebotReady) {
            // A child node has been added or removed to/from <head>.

            setConsent({
              necessary: cookiebotConsent.necessary,
              marketing: cookiebotConsent.marketing,
              preferences: cookiebotConsent.preferences,
              statistics: cookiebotConsent.statistics,
            });
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
  }, [cookiebotActivated]);

  return consent;
};
