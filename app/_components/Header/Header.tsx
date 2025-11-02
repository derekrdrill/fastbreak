'use client';

import Link from 'next/link';
import { useAuthStore } from '@/app/_store';
// TODO: Add proper logout functionality

function Header() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const user = useAuthStore(state => state.user);

  // TODO: Get auth status from server component on initial load
  // TODO: Make logout actually work

  return (
    <header className='border-b mb-4 px-4 py-3'>
      <div className='container mx-auto flex items-center justify-between'>
        <Link href='/dashboard' className='text-xl font-bold'>
          FASTBREAK
        </Link>
        <nav className='flex items-center gap-4'>
          {isAuthenticated && user && <span className='text-sm text-gray-600'>{user.email}</span>}
          {isAuthenticated && (
            <Link href='/logout' className='text-sm hover:underline'>
              Logout
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
