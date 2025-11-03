'use client';

import { useEffect } from 'react';

export function useClickOutside(
  refs: Array<React.RefObject<unknown>>,
  onOutside: () => void,
  enabled: boolean = true,
) {
  useEffect(() => {
    if (!enabled) return;

    const handler = (e: MouseEvent) => {
      const clickedInside = refs.some(ref => {
        const el = ref.current as HTMLElement | null;
        return el ? el.contains(e.target as Node) : false;
      });
      if (!clickedInside) onOutside();
    };

    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [refs, onOutside, enabled]);
}
