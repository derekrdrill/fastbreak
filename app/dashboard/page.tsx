'use client';

import { useState } from 'react';

import ButtonGroup from '@/app/_components/common/ButtonGroup/ButtonGroup';
import { DashboardView } from '@/app/_lib/types';
import EventList from '@/app/dashboard/components/EventList/EventList';

export default function DashboardPage() {
  const [view, setView] = useState<DashboardView>('list');

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-3xl font-bold'>Event Dashboard</h1>
        <div className='flex items-center gap-4'>
          <ButtonGroup
            options={[
              { label: 'Card', value: 'card' },
              { label: 'List', value: 'list' },
            ]}
            value={view}
            onChange={setView}
          />
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
      <EventList view={view} />
    </div>
  );
}
