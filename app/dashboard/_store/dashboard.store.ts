import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import type { DashboardView } from '@/app/_lib/types';

interface DashboardState {
  _hasHydrated: boolean;
  searchQuery: string;
  sportFilter: number | null;
  view: DashboardView;
  setHasHydrated: (hasHydrated: boolean) => void;
  setSearchQuery: (query: string) => void;
  setSportFilter: (sportId: number | null) => void;
  setView: (view: DashboardView) => void;
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    set => ({
      _hasHydrated: false,
      searchQuery: '',
      sportFilter: null,
      view: 'card',
      setHasHydrated: hasHydrated => set({ _hasHydrated: hasHydrated }),
      setSearchQuery: query => set({ searchQuery: query }),
      setSportFilter: sportId => set({ sportFilter: sportId }),
      setView: view => set({ view }),
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
