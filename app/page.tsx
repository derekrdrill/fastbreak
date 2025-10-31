import { redirect } from 'next/navigation';

export default function RootPage() {
  // TODO: Check auth status
  // If authenticated, redirect to dashboard
  // If not authenticated, redirect to login
  redirect('/dashboard');
}
