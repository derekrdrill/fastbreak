import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import type { DashboardView, Event } from '@/app/_lib/types';

interface DashboardState {
  _hasHydrated: boolean;
  events: Event[];
  selectedPlan: Event | null;
  pendingSportFilter: number | null | undefined;
  view: DashboardView;
  isLoading: boolean;
  setHasHydrated: (hasHydrated: boolean) => void;
  setEvents: (events: Event[]) => void;
  setSelectedPlan: (event: Event | null) => void;
  setPendingSportFilter: (sportId: number | null | undefined) => void;
  setView: (view: DashboardView) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    set => ({
      _hasHydrated: false,
      events: [],
      selectedPlan: null,
      pendingSportFilter: undefined,
      view: 'card',
      isLoading: false,
      setHasHydrated: hasHydrated => set({ _hasHydrated: hasHydrated }),
      setEvents: events => set({ events }),
      setSelectedPlan: event => set({ selectedPlan: event }),
      setPendingSportFilter: sportId => set({ pendingSportFilter: sportId }),
      setView: view => set({ view }),
      setIsLoading: isLoading => set({ isLoading }),
    }),
    {
      name: 'dashboard-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: state => ({
        view: state.view,
      }),
      onRehydrateStorage: () => state => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
