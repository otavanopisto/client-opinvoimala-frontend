import React, { useState, useEffect } from 'react';
import { useStore } from '../store/storeContext';
import { BREAKPOINTS } from '../theme';

interface UseOutsideClickActionProps {
  ref: React.RefObject<HTMLDivElement>;
  action: Function;
  condition?: boolean;
}

/**
 * Triggers given action when detects mouse click outside of the given element defined by ref
 */
export const useOutsideClickAction = ({
  ref,
  action,
  condition = true,
}: UseOutsideClickActionProps) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (condition && !ref.current?.contains(event.target as Node)) {
        action();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [action, condition, ref]);
};

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  const isMobile = width < BREAKPOINTS.mobile;
  const isTablet = width < BREAKPOINTS.tablet;
  return { width, height, isMobile, isTablet };
}

/**
 * Hook to detect window dimensions (width, height)
 */
export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}

interface CookiebotConsent {
  necessary?: boolean;
  marketing?: boolean;
  preferences?: boolean;
  statistics?: boolean;
}

export const useCookiebotConsent = () => {
  const {
    settings: { settings },
  } = useStore();

  const cookiebotActivated = !!settings?.scripts?.cookiebotDomainGroupId;

  const [consent, setConsent] = useState<CookiebotConsent>({
    necessary: cookiebotActivated ? undefined : true,
    marketing: cookiebotActivated ? undefined : true,
    preferences: cookiebotActivated ? undefined : true,
    statistics: cookiebotActivated ? undefined : true,
  });

  useEffect(() => {
    if (window && cookiebotActivated) {
      setTimeout(() => {
        // @ts-ignore
        if (window.Cookiebot?.consent) setConsent(window.Cookiebot?.consent);
      }, 250);
    }
  }, [cookiebotActivated]);

  return consent;
};
