'use client';

import { useEffect, useState, startTransition } from 'react';
import type { KeyboardEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDashboardStore } from '@/app/dashboard/_store/dashboard.store';
import { getDashboardUrlWithParam } from '@/app/dashboard/_helpers/dashboard.helpers';

function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isLoading = useDashboardStore(state => state.isLoading);
  const setIsLoading = useDashboardStore(state => state.setIsLoading);
  const setSearch = useDashboardStore(state => state.setSearch);
  const urlSearch = searchParams.get('search') || '';

  const [localValue, setLocalValue] = useState(urlSearch);

  const dashboardUrlWithSearch = getDashboardUrlWithParam({
    currentParams: searchParams,
    key: 'search',
    value: localValue,
  });
  const shouldShowClearButton = !!localValue && !isLoading;

  const handleChange = (value: string) => {
    setLocalValue(value);
  };

  const handleSearch = () => {
    const localValueTrimmed = localValue.trim();
    setSearch(localValueTrimmed);
    setIsLoading(true);
    router.push(dashboardUrlWithSearch);
  };

  const handleClear = () => {
    setLocalValue('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  useEffect(() => {
    startTransition(() => {
      setLocalValue(urlSearch);
    });
  }, [urlSearch]);

  return (
    <div className='relative flex-1'>
      <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
      <input
        type='text'
        placeholder='Search events by full or short name (Los Angeles Lakers vs. Boston Celtics or LAL v BOS)...'
        value={localValue}
        onChange={e => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
        className='w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed'
      />
      <div className='absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2'>
        {shouldShowClearButton && (
          <Button
            type='button'
            variant='ghost'
            size='icon-sm'
            onClick={handleClear}
            className='text-gray-400 hover:text-gray-600 h-auto w-auto p-0'
            aria-label='Clear search'
            disabled={isLoading}
          >
            <X className='h-4 w-4' />
          </Button>
        )}
        {isLoading && <Loader2 className='h-4 w-4 text-gray-400 animate-spin' />}
        <Button type='button' size='sm' onClick={handleSearch} disabled={isLoading}>
          Search
        </Button>
      </div>
    </div>
  );
}

export default SearchInput;
