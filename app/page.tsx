import { redirect } from 'next/navigation';
import { getAuthenticatedSession } from '@/app/_actions';

export default async function RootPage() {
  const isLocalDev = process.env.ENV === 'local';

  if (isLocalDev) {
    redirect('/dashboard');
  }

  const result = await getAuthenticatedSession();
  const isAuthenticatedSession = result.success && result.data;
  const shouldRedirectToDashboard = isAuthenticatedSession || isLocalDev;

  if (shouldRedirectToDashboard) {
    redirect('/dashboard');
  }

  redirect('/auth');
}
