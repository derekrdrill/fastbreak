'use client';

import ButtonGroup from '@/app/_components/ButtonGroup/ButtonGroup';
import EventsList from '@/app/dashboard/_components/EventsList/EventsList';
import { useDashboardStore } from '@/app/dashboard/_store/dashboard.store';

export default function DashboardPage() {
  const view = useDashboardStore(state => state.view);
  const setView = useDashboardStore(state => state.setView);
  const hasHydrated = useDashboardStore(state => state._hasHydrated);

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-3xl font-bold'>Event Dashboard</h1>
        <div className='flex items-center gap-4'>
          {hasHydrated && (
            <ButtonGroup
              options={[
                { label: 'Card', value: 'card' },
                { label: 'List', value: 'list' },
              ]}
              value={view}
              onChange={setView}
            />
          )}
          <a
            href='/event/new'
            className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
          >
            Create Event
          </a>
        </div>
      </div>
      {/* TODO: Add search and filter controls */}
      <div className='mb-6'>
        {/* Search by name */}
        {/* Filter by sport type */}
      </div>
      {hasHydrated && <EventsList />}
    </div>
  );
}
