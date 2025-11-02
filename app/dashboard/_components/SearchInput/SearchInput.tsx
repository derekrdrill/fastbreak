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

  // Get initial value from URL params
  const urlSearch = searchParams.get('search') || '';

  // Use local state for input value to avoid blocking on every keystroke
  const [localValue, setLocalValue] = useState(urlSearch);
  const [isPendingSearch, setIsPendingSearch] = useState(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingRef = useRef(false);
  const lastCommittedValueRef = useRef(urlSearch);
  const inputRef = useRef<HTMLInputElement>(null);
  const shouldRestoreFocusRef = useRef(false);

  // Sync local value when URL params change from external sources (e.g., navigation)
  // Only sync when not actively typing and URL changed to something we didn't commit
  useEffect(() => {
    if (!isTypingRef.current && urlSearch !== lastCommittedValueRef.current) {
      // URL changed from external source, sync local value
      startTransition(() => {
        setLocalValue(urlSearch);
        lastCommittedValueRef.current = urlSearch;
      });
    }
  }, [urlSearch]);

  const handleChange = (value: string) => {
    // Mark that we're actively typing
    isTypingRef.current = true;

    // Track if input has focus so we can restore it after navigation
    if (inputRef.current && document.activeElement === inputRef.current) {
      shouldRestoreFocusRef.current = true;
    }

    // Update local state immediately for smooth typing
    setLocalValue(value);
    setIsPendingSearch(true);

    // Clear existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Update URL and trigger search after debounce delay
    debounceTimeoutRef.current = setTimeout(() => {
      // Mark the value we're committing
      lastCommittedValueRef.current = value;
      setIsLoading(true);
      setIsPendingSearch(false);
      // Clear typing flag after a microtask
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

  // Restore focus after navigation completes (when loading stops and we were searching)
  useEffect(() => {
    if (!isLoading && !isPendingSearch && shouldRestoreFocusRef.current && inputRef.current) {
      // Small delay to ensure DOM is ready after navigation
      const timer = setTimeout(() => {
        if (inputRef.current && document.activeElement !== inputRef.current) {
          inputRef.current.focus();
          shouldRestoreFocusRef.current = false;
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isLoading, isPendingSearch]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  // Spinner should only show when actively searching (not when sport filter changes)
  // Input should be disabled when loading from any source (search or filter)

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
          // Clear restore focus flag if user explicitly blurs (clicks away)
          if (!isPendingSearch) {
            shouldRestoreFocusRef.current = false;
          }
        }}
        disabled={isLoading && !isPendingSearch}
        className='w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed'
      />
      <div className='absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2'>
        {isPendingSearch && <Loader2 className='h-4 w-4 text-gray-400 animate-spin' />}
        {localValue && !isPendingSearch && (
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
