'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SPORTS } from '@/constants';
import { useDashboardStore } from '@/app/dashboard/_store/dashboard.store';
import { getDashboardUrlWithParam } from '@/app/dashboard/_helpers/dashboard.helpers';

const ALL_SPORTS_VALUE = 'all';

function SportFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isLoading = useDashboardStore(state => state.isLoading);
  const setSportFilter = useDashboardStore(state => state.setSportFilter);
  const setIsLoading = useDashboardStore(state => state.setIsLoading);

  const urlSport = searchParams.get('sport');
  const selectValue = urlSport ?? ALL_SPORTS_VALUE;
  const selectedSport =
    selectValue === ALL_SPORTS_VALUE
      ? undefined
      : SPORTS.find(sport => String(sport.id) === selectValue);
  const selectedSportIcon = selectedSport?.icon;

  const handleChange = (value: string) => {
    const normalizedValue = value === ALL_SPORTS_VALUE ? '' : value;
    const valueNumeric = normalizedValue ? Number(normalizedValue) : undefined;
    setSportFilter(valueNumeric);
    setIsLoading(true);
    const dashboardUrl = getDashboardUrlWithParam({
      currentParams: searchParams,
      key: 'sport',
      value: normalizedValue,
    });
    router.push(dashboardUrl);
  };

  return (
    <div className='sm:w-64'>
      <Select disabled={isLoading} onValueChange={handleChange} value={selectValue}>
        <SelectTrigger className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 focus:border-transparent bg-white text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed'>
          <div className='flex w-full items-center justify-between gap-2'>
            <SelectValue placeholder='All Sports' />
            {selectedSportIcon && (
              <span className='flex items-center text-gray-700 [&_svg]:h-5 [&_svg]:w-5 [&_svg]:text-current'>
                {selectedSportIcon}
              </span>
            )}
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_SPORTS_VALUE}>All Sports</SelectItem>
          {SPORTS.map(sport => (
            <SelectItem key={sport.id} rightIcon={sport.icon} value={String(sport.id)}>
              {sport.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default SportFilter;
