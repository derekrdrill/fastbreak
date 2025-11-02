import { redirect } from 'next/navigation';
import { getAuthenticatedSession } from '@/app/_actions/auth';

export default async function RootPage() {
  const result = await getAuthenticatedSession();
  const isAuthenticatedSession = result.success && result.data;

  if (isAuthenticatedSession) {
    redirect('/dashboard');
  } else {
    redirect('/auth');
  }
}
