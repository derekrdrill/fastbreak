import { useMediaQuery } from 'react-responsive';
import { TAILWIND_BREAKPOINTS } from '@/constants';

/**
 * Custom hook for handling responsive breakpoints matching Tailwind CSS.
 * Provides boolean flags for mobile, tablet, and desktop viewports.
 *
 * Breakpoints are sourced from Tailwind CSS configuration via responsive.constants.ts
 *
 * @returns Object containing responsive breakpoint states (isMobile, isTablet, isDesktop)
 */
function useResponsiveEngine() {
  const isMobile = useMediaQuery({ maxWidth: TAILWIND_BREAKPOINTS.md - 1 });
  const isTablet = useMediaQuery({
    minWidth: TAILWIND_BREAKPOINTS.md,
    maxWidth: TAILWIND_BREAKPOINTS.lg - 1,
  });
  const isDesktop = useMediaQuery({ minWidth: TAILWIND_BREAKPOINTS.lg });

  return {
    isMobile,
    isTablet,
    isDesktop,
  };
}

export { useResponsiveEngine };
