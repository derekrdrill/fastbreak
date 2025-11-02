import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import type { DashboardView } from '@/app/_lib/types';

interface DashboardState {
  view: DashboardView;
  setView: (view: DashboardView) => void;
  _hasHydrated: boolean;
  setHasHydrated: (hasHydrated: boolean) => void;
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    set => ({
      view: 'card',
      setView: view => set({ view }),
      _hasHydrated: false,
      setHasHydrated: hasHydrated => set({ _hasHydrated: hasHydrated }),
    }),
    {
      name: 'dashboard-storage',
      storage: createJSONStorage(() => sessionStorage),
      onRehydrateStorage: () => state => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
