'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { signOut, getAuthenticatedSession } from '@/app/_actions/auth';
import { Button } from '@/components/ui/button';
import type { User } from '@/app/_types';

function Header() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  async function handleLogout() {
    const result = await signOut();

    if (result.success) {
      setUser(null);
      toast.success('Signed out successfully');
      router.push('/auth');
    } else {
      toast.error(result.error || 'Failed to sign out');
    }
  }

  useEffect(() => {
    const loadSession = async () => {
      const result = await getAuthenticatedSession();

      if (result.success && result.data) {
        setUser(result.data.user);
      }
    };

    loadSession();
  }, []);

  return (
    <header className='border-b mb-4 px-4 py-3'>
      <div className='container mx-auto flex items-center justify-between'>
        <Link href='/dashboard' className='text-xl font-bold'>
          FASTBREAK
        </Link>
        <nav className='flex items-center gap-4'>
          {user && <span className='text-sm text-gray-600'>{user.email}</span>}
          {user && (
            <Button variant='ghost' size='sm' onClick={handleLogout} className='text-sm'>
              Logout
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
