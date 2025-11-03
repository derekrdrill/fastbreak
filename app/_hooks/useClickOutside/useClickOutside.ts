'use client';

import { useEffect } from 'react';

/**
 * Calls `onOutside` when a click occurs outside of any provided refs.
 * Pass `enabled=false` to temporarily disable the listener.
 *
 * @param refs Array of element refs to treat as inside
 * @param onOutside Callback invoked on outside clicks
 * @param enabled Whether the listener is active (defaults to true)
 */
function useClickOutside(
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

export { useClickOutside };
