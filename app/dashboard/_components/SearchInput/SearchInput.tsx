'use client';

import { useEffect, useRef, useState, startTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDashboardStore } from '@/app/dashboard/_store/dashboard.store';

function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isLoading = useDashboardStore(state => state.isLoading);
  const setIsLoading = useDashboardStore(state => state.setIsLoading);
  const urlSearch = searchParams.get('search') || '';

  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isTypingRef = useRef(false);
  const lastCommittedValueRef = useRef(urlSearch);
  const shouldRestoreFocusRef = useRef(false);

  const [localValue, setLocalValue] = useState(urlSearch);
  const [isPendingSearch, setIsPendingSearch] = useState(false);

  const isSearchBarDisabled = isLoading && !isPendingSearch;
  const shouldShowClearButtonRef = localValue && !isPendingSearch;

  const handleChange = (value: string) => {
    isTypingRef.current = true;

    if (inputRef.current && document.activeElement === inputRef.current) {
      shouldRestoreFocusRef.current = true;
    }

    setLocalValue(value);
    setIsPendingSearch(true);

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      lastCommittedValueRef.current = value;
      setIsLoading(true);
      setIsPendingSearch(false);
      setTimeout(() => {
        isTypingRef.current = false;
      }, 0);
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set('search', value);
      } else {
        params.delete('search');
      }
      router.push(`/dashboard?${params.toString()}`);
    }, 500);
  };

  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const shouldStartTransition =
      !isTypingRef.current && urlSearch !== lastCommittedValueRef.current;

    if (shouldStartTransition) {
      startTransition(() => {
        setLocalValue(urlSearch);
        lastCommittedValueRef.current = urlSearch;
      });
    }
  }, [urlSearch]);

  useEffect(() => {
    const shouldRestoreFocus =
      !isLoading && !isPendingSearch && shouldRestoreFocusRef.current && inputRef.current;
    if (shouldRestoreFocus) {
      const timer = setTimeout(() => {
        if (inputRef.current && document.activeElement !== inputRef.current) {
          inputRef.current.focus();
          shouldRestoreFocusRef.current = false;
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isLoading, isPendingSearch]);

  return (
    <div className='relative flex-1'>
      <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
      <input
        ref={inputRef}
        type='text'
        placeholder='Search events by name...'
        value={localValue}
        onChange={e => handleChange(e.target.value)}
        onBlur={() => {
          if (!isPendingSearch) {
            shouldRestoreFocusRef.current = false;
          }
        }}
        disabled={isSearchBarDisabled}
        className='w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed'
      />
      <div className='absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2'>
        {isPendingSearch && <Loader2 className='h-4 w-4 text-gray-400 animate-spin' />}
        {shouldShowClearButtonRef && (
          <Button
            type='button'
            variant='ghost'
            size='icon-sm'
            onClick={() => handleChange('')}
            className='text-gray-400 hover:text-gray-600 h-auto w-auto p-0'
            aria-label='Clear search'
            disabled={isLoading}
          >
            <X className='h-4 w-4' />
          </Button>
        )}
      </div>
    </div>
  );
}

export default SearchInput;
