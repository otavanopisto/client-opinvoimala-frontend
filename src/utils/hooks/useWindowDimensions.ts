import { useState, useEffect } from 'react';
import { BREAKPOINTS } from '../../theme';

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;

  const isMobile = width < BREAKPOINTS.mobile;
  const isTablet = width < BREAKPOINTS.tablet;
  const isLaptop = width < BREAKPOINTS.laptop;

  return { width, height, isMobile, isTablet, isLaptop };
}

/**
 * Hook to detect window dimensions (width, height)
 */
export function useWindowDimensions() {
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
