'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { IoAdd, IoGrid, IoList } from 'react-icons/io5';
import { ButtonGroup } from '@/app/_components';
import { EventsList, SearchInput, SportFilter } from '@/app/dashboard/_components';
import { useDashboardStore } from '@/app/dashboard/_store/dashboard.store';
import type { Event } from '@/app/_lib/types';
import { Button } from '@/components/ui/button';

interface DashboardClientProps {
  initialEvents: Event[];
}

export default function DashboardClient({ initialEvents }: DashboardClientProps) {
  const hasHydrated = useDashboardStore(state => state._hasHydrated);
  const setEvents = useDashboardStore(state => state.setEvents);
  const searchQuery = useDashboardStore(state => state.searchQuery);
  const sportFilter = useDashboardStore(state => state.sportFilter);
  const view = useDashboardStore(state => state.view);
  const setSearchQuery = useDashboardStore(state => state.setSearchQuery);
  const setSportFilter = useDashboardStore(state => state.setSportFilter);
  const setView = useDashboardStore(state => state.setView);

  useEffect(() => {
    setEvents(initialEvents);
  }, [initialEvents, setEvents]);

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
            />
          )}
          <Button asChild className='bg-blue-500 hover:bg-blue-600 hover:shadow-md'>
            <Link href='/event/new'>
              <IoAdd className='w-5 h-5' />
              Create Event
            </Link>
          </Button>
        </div>
      </div>

      {hasHydrated && (
        <div className='mb-6 flex flex-col sm:flex-row gap-4'>
          <SearchInput value={searchQuery} onChange={setSearchQuery} />
          <SportFilter value={sportFilter} onChange={setSportFilter} />
        </div>
      )}

      {hasHydrated && <EventsList />}
    </div>
  );
}
