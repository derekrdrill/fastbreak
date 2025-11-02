'use client';

import { useEffect, useState, useMemo, startTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { IoAdd, IoGrid, IoList } from 'react-icons/io5';
import { ButtonGroup } from '@/app/_components';
import { EventsList, SearchInput, SportFilter, EventsShimmer } from '@/app/dashboard/_components';
import { useDashboardStore } from '@/app/dashboard/_store/dashboard.store';
import type { Event } from '@/app/_lib/types';
import { Button } from '@/components/ui/button';

interface DashboardRootProps {
  initialEvents: Event[];
}

export default function DashboardRoot({ initialEvents }: DashboardRootProps) {
  const searchParams = useSearchParams();
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [isInitialMount, setIsInitialMount] = useState(true);

  const hasHydrated = useDashboardStore(state => state._hasHydrated);
  const view = useDashboardStore(state => state.view);
  const pendingSportFilter = useDashboardStore(state => state.pendingSportFilter);
  const isLoading = useDashboardStore(state => state.isLoading);
  const setView = useDashboardStore(state => state.setView);
  const setPendingSportFilter = useDashboardStore(state => state.setPendingSportFilter);
  const setIsLoading = useDashboardStore(state => state.setIsLoading);

  // Get sport filter from URL params
  const urlSport = searchParams.get('sport');
  const urlSportFilter = urlSport ? Number(urlSport) : null;
  const effectiveSportFilter =
    pendingSportFilter !== undefined ? pendingSportFilter : urlSportFilter;

  // Show shimmer during initial hydration period or when loading
  const showShimmer = !hasHydrated || isLoading || isInitialMount;

  // Sync events from server props to local state (initial mount only)
  useEffect(() => {
    if (isInitialMount) {
      // Small delay to allow hydration to complete, then show data
      const timer = setTimeout(() => {
        setEvents(initialEvents);
        setIsInitialMount(false);
        setIsLoading(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [initialEvents, isInitialMount, setIsLoading]);

  // Update events and clear loading state when initialEvents changes (after initial mount)
  useEffect(() => {
    if (!isInitialMount) {
      // Use startTransition to avoid blocking render
      startTransition(() => {
        setEvents(initialEvents);
        setIsLoading(false);
      });
    }
  }, [initialEvents, isInitialMount, setIsLoading]);

  useEffect(() => {
    if (!isLoading) {
      setPendingSportFilter(undefined);
    }
  }, [isLoading, setPendingSportFilter]);

  const shimmerComponent = useMemo(() => {
    return <EventsShimmer sportFilter={effectiveSportFilter ?? null} view={view} />;
  }, [view, effectiveSportFilter]);

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-3xl font-bold'>Event Dashboard</h1>
        <div className='flex items-center gap-4'>
          {hasHydrated && (
            <ButtonGroup
              options={[
                { label: 'Card', value: 'card', icon: <IoGrid /> },
                { label: 'List', value: 'list', icon: <IoList /> },
              ]}
              value={view}
              onChange={setView}
              disabled={showShimmer}
            />
          )}
          <Button
            asChild
            className='bg-blue-500 hover:bg-blue-600 hover:shadow-md'
            disabled={showShimmer}
          >
            <Link href='/event/new'>
              <IoAdd className='w-5 h-5' />
              Create Event
            </Link>
          </Button>
        </div>
      </div>

      {hasHydrated && (
        <div className='mb-6 flex flex-col sm:flex-row gap-4'>
          <SearchInput />
          <SportFilter />
        </div>
      )}

      {/* Show shimmer during hydration, initial mount, or when loading */}
      {showShimmer ? shimmerComponent : hasHydrated ? <EventsList events={events} /> : null}
    </div>
  );
}
