'use client';

import { IoAdd, IoGrid, IoList } from 'react-icons/io5';
import ButtonGroup from '@/app/_components/ButtonGroup/ButtonGroup';
import { EventsList, SearchInput, SportFilter } from '@/app/dashboard/_components';
import { useDashboardStore } from '@/app/dashboard/_store/dashboard.store';

export default function DashboardPage() {
  const hasHydrated = useDashboardStore(state => state._hasHydrated);
  const searchQuery = useDashboardStore(state => state.searchQuery);
  const sportFilter = useDashboardStore(state => state.sportFilter);
  const view = useDashboardStore(state => state.view);
  const setSearchQuery = useDashboardStore(state => state.setSearchQuery);
  const setSportFilter = useDashboardStore(state => state.setSportFilter);
  const setView = useDashboardStore(state => state.setView);

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
          <a
            href='/event/new'
            className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all duration-200 hover:shadow-lg active:scale-95 flex items-center gap-2 font-medium'
          >
            <IoAdd className='w-5 h-5' />
            Create Event
          </a>
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
