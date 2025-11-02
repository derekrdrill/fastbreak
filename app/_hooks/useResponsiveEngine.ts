import { useMediaQuery } from 'react-responsive';

/**
 * Custom hook for handling responsive breakpoints matching Tailwind CSS
 * @returns Object containing responsive breakpoint states
 */
export function useResponsiveEngine() {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });
  const isDesktop = useMediaQuery({ minWidth: 1024 });

  return {
    isMobile,
    isTablet,
    isDesktop,
  };
}
