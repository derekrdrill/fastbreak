import DashboardClient from './_components/DashboardClient/DashboardClient';
import { getEvents } from '@/app/_actions/events';

export default async function DashboardPage() {
  const result = await getEvents();
  const initialEvents = result.success ? result.data || [] : [];

  return <DashboardClient initialEvents={initialEvents} />;
}
