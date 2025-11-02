import EventForm from '../_components/EventForm';
import { getVenues } from '@/app/_actions/venues';
import { BackButton } from '@/app/_components';

export default async function NewEventPage() {
  const result = await getVenues();
  const venues = result.success ? result.data || [] : [];

  return (
    <div className='container mx-auto px-4 py-8 max-w-2xl'>
      <BackButton />
      <h1 className='text-3xl font-bold mb-6'>Create New Event</h1>
      <EventForm venues={venues} />
    </div>
  );
}
