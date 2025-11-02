import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import type { DashboardView, Event } from '@/app/_lib/types';

interface DashboardState {
  _hasHydrated: boolean;
  events: Event[];
  searchQuery: string;
  sportFilter: number | null;
  view: DashboardView;
  setHasHydrated: (hasHydrated: boolean) => void;
  setEvents: (events: Event[]) => void;
  setSearchQuery: (query: string) => void;
  setSportFilter: (sportId: number | null) => void;
  setView: (view: DashboardView) => void;
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    set => ({
      _hasHydrated: false,
      events: [],
      searchQuery: '',
      sportFilter: null,
      view: 'card',
      setHasHydrated: hasHydrated => set({ _hasHydrated: hasHydrated }),
      setEvents: events => set({ events }),
      setSearchQuery: query => set({ searchQuery: query }),
      setSportFilter: sportId => set({ sportFilter: sportId }),
      setView: view => set({ view }),
    }),
    {
      name: 'dashboard-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: state => ({
        searchQuery: state.searchQuery,
        sportFilter: state.sportFilter,
        view: state.view,
      }),
      onRehydrateStorage: () => state => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
