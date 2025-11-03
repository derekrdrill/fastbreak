import type { Config } from 'tailwindcss';
import { TAILWIND_BREAKPOINTS } from './constants/responsive.constants';

const config: Config = {
  theme: {
    extend: {
      screens: {
        sm: `${TAILWIND_BREAKPOINTS.sm}px`,
        md: `${TAILWIND_BREAKPOINTS.md}px`,
        lg: `${TAILWIND_BREAKPOINTS.lg}px`,
        xl: `${TAILWIND_BREAKPOINTS.xl}px`,
        '2xl': `${TAILWIND_BREAKPOINTS['2xl']}px`,
      },
    },
  },
};

export default config;
