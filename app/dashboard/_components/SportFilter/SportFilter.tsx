'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { SPORTS } from '@/app/_constants/events';
import { useDashboardStore } from '@/app/dashboard/_store/dashboard.store';

function SportFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pendingSportFilter = useDashboardStore(state => state.pendingSportFilter);
  const isLoading = useDashboardStore(state => state.isLoading);
  const setPendingSportFilter = useDashboardStore(state => state.setPendingSportFilter);
  const setIsLoading = useDashboardStore(state => state.setIsLoading);

  // Get sport filter from URL params
  const urlSport = searchParams.get('sport');
  const urlSportFilter = urlSport ? Number(urlSport) : null;

  // Use pending value if available (for immediate UI feedback), otherwise use URL value
  const effectiveSportFilter =
    pendingSportFilter !== undefined ? pendingSportFilter : urlSportFilter;
  const selectValue =
    effectiveSportFilter === null || effectiveSportFilter === undefined
      ? ''
      : String(effectiveSportFilter);

  const handleChange = (sportId: number | null) => {
    setPendingSportFilter(sportId);
    setIsLoading(true);
    const params = new URLSearchParams(searchParams.toString());
    if (sportId !== null) {
      params.set('sport', String(sportId));
    } else {
      params.delete('sport');
    }
    router.push(`/dashboard?${params.toString()}`);
  };

  return (
    <div className='sm:w-64'>
      <select
        value={selectValue}
        onChange={e => handleChange(e.target.value ? Number(e.target.value) : null)}
        disabled={isLoading}
        className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed'
      >
        <option value=''>All Sports</option>
        {SPORTS.map(sport => (
          <option key={sport.id} value={String(sport.id)}>
            {sport.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SportFilter;
