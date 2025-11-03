import { getEvents } from '@/app/_actions';
import DashboardRoot from './_components/DashboardRoot/DashboardRoot';

interface DashboardPageProps {
  searchParams: Promise<{ search?: string; sport?: string }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = await searchParams;
  const search = params.search || '';
  const sportFilter = params.sport ? Number(params.sport) : null;

  const result = await getEvents({
    search: search || undefined,
    sportTypeId: sportFilter,
  });
  const initialEvents = result.success ? result.data || [] : [];

  return <DashboardRoot initialEvents={initialEvents} />;
}
