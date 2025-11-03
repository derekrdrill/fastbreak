'use client';

import classNames from 'classnames';
import Link from 'next/link';
import { IoArrowBack } from 'react-icons/io5';
import { useDashboardStore } from '@/app/dashboard/_store/dashboard.store';

interface BackButtonProps {
  className?: string;
  label?: string;
}

function BackButton({ className, label = 'Back to Dashboard' }: BackButtonProps) {
  const search = useDashboardStore(state => state.search);
  const sportFilter = useDashboardStore(state => state.sportFilter);

  const params = new URLSearchParams();

  if (search) params.set('search', search);
  if (sportFilter) params.set('sport', String(sportFilter));

  const paramsString = params.toString() ? `?${params.toString()}` : '';
  const href = `/dashboard${paramsString}`;

  return (
    <Link
      href={href}
      className={classNames(
        'inline-flex items-center text-blue-600 hover:text-blue-800 mb-4',
        className,
      )}
    >
      <IoArrowBack className='w-5 h-5 mr-2' />
      {label}
    </Link>
  );
}

export default BackButton;
