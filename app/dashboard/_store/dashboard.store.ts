import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import type { DashboardView, Event } from '@/app/_types';

interface DashboardState {
  _hasHydrated: boolean;
  events: Event[];
  isLoading: boolean;
  search?: string;
  selectedPlan?: Event;
  sportFilter?: number;
  view: DashboardView;
  setHasHydrated: (hasHydrated: boolean) => void;
  setEvents: (events: Event[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  setSearch: (search?: string) => void;
  setSelectedPlan: (event?: Event) => void;
  setSportFilter: (sportId?: number) => void;
  setView: (view: DashboardView) => void;
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    set => ({
      _hasHydrated: false,
      events: [],
      isLoading: false,
      view: 'card',
      setHasHydrated: hasHydrated => set({ _hasHydrated: hasHydrated }),
      setEvents: events => set({ events }),
      setIsLoading: isLoading => set({ isLoading }),
      setSearch: search => set({ search }),
      setSelectedPlan: event => set({ selectedPlan: event }),
      setSportFilter: sportId => set({ sportFilter: sportId }),
      setView: view => set({ view }),
    }),
    {
      name: 'dashboard-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: state => ({
        view: state.view,
        sportFilter: state.sportFilter,
        search: state.search,
      }),
      onRehydrateStorage: () => state => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
