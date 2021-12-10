import React, { useCallback, useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { Route, useLocation } from 'react-router-dom';
import { useStore } from '../store/storeContext';
import { sendAnalyticsEvent } from '../utils/analytics';
import { useCookiebotConsent } from '../utils/hooks/useCookiebotConsent';

/**
 * Send analytics event every time route changes
 */
const AnalyticsRouteTracker: React.FC = observer(() => {
  const location = useLocation();
  const pathRef = useRef<string>();
  const searchRef = useRef<string>();

  const {
    settings: { isCookiebotActivated },
  } = useStore();

  const cookieConsent = useCookiebotConsent(isCookiebotActivated);

  const isAnalyticsReady = useCallback(
    () =>
      !!cookieConsent.statistics &&
      typeof window !== 'undefined' &&
      !!(window as any).gtag,
    [cookieConsent]
  );

  const logPageChange = useCallback((pathname: string, search = '') => {
    const { location } = window;
    const page_path = pathname + search;
    const page_location = `${location.origin}${page_path}`;

    sendAnalyticsEvent('page_view', { page_path, page_location });
  }, []);

  useEffect(() => {
    if (isAnalyticsReady()) {
      const { pathname, search } = location;
      const pathChanged = pathname !== pathRef.current;
      const searchChanged = search !== searchRef.current;

      if (pathChanged || searchChanged) {
        logPageChange(pathname, search);
        pathRef.current = pathname;
        searchRef.current = search;
      }
    }
  }, [isAnalyticsReady, location, logPageChange]);

  return null;
});

export const RouteTracker = () => <Route component={AnalyticsRouteTracker} />;

export default RouteTracker;
