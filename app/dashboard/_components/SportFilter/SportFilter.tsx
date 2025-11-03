'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { SPORTS } from '@/app/_constants/events';
import { useDashboardStore } from '@/app/dashboard/_store/dashboard.store';
import { getDashboardUrlWithParam } from '@/app/dashboard/_helpers/dashboard.helpers';

function SportFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isLoading = useDashboardStore(state => state.isLoading);
  const setSportFilter = useDashboardStore(state => state.setSportFilter);
  const setIsLoading = useDashboardStore(state => state.setIsLoading);

  const urlSport = searchParams.get('sport');
  const selectValue = urlSport || '';

  const handleChange = (value: string) => {
    const valueNumeric = value ? Number(value) : undefined;
    setSportFilter(valueNumeric);
    setIsLoading(true);
    const dashboardUrl = getDashboardUrlWithParam({
      currentParams: searchParams,
      key: 'sport',
      value,
    });
    router.push(dashboardUrl);
  };

  return (
    <div className='sm:w-64'>
      <select
        value={selectValue}
        onChange={e => handleChange(e.target.value)}
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
