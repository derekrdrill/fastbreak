'use client';

import { useEffect, useState, startTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { IoAdd, IoGrid, IoList } from 'react-icons/io5';
import { ButtonGroup } from '@/app/_components';
import { EventsList, SearchInput, SportFilter, EventsShimmer } from '@/app/dashboard/_components';
import { useDashboardStore } from '@/app/dashboard/_store/dashboard.store';
import type { Event } from '@/app/_types';
import { Button } from '@/components/ui/button';

interface DashboardRootProps {
  initialEvents: Event[];
}

function DashboardRoot({ initialEvents }: DashboardRootProps) {
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

  const urlSport = searchParams.get('sport');
  const urlSportFilter = urlSport ? Number(urlSport) : null;
  const effectiveSportFilter =
    pendingSportFilter !== undefined ? pendingSportFilter : urlSportFilter;

  const shouldShowShimmer = !hasHydrated || isLoading || isInitialMount;

  useEffect(() => {
    if (isInitialMount) {
      const timer = setTimeout(() => {
        setEvents(initialEvents);
        setIsInitialMount(false);
        setIsLoading(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [initialEvents, isInitialMount, setIsLoading]);

  useEffect(() => {
    if (!isInitialMount) {
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

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex flex-col gap-4 justify-between mb-6 sm:flex-row sm:items-center'>
        <h1 className='text-3xl font-bold'>Event Dashboard</h1>
        <div className='flex items-center gap-4 justify-between'>
          {hasHydrated && (
            <ButtonGroup
              options={[
                { label: 'Card', value: 'card', icon: <IoGrid /> },
                { label: 'List', value: 'list', icon: <IoList /> },
              ]}
              value={view}
              onChange={setView}
              disabled={shouldShowShimmer}
            />
          )}
          <Button
            asChild
            className='bg-blue-500 hover:bg-blue-600 hover:shadow-md'
            disabled={shouldShowShimmer}
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

      {shouldShowShimmer && <EventsShimmer sportFilter={effectiveSportFilter} view={view} />}
      {!shouldShowShimmer && <EventsList events={events} />}
    </div>
  );
}

export default DashboardRoot;
