import EventForm from '../_components/EventForm';
import { getVenues } from '@/app/_actions';

export default async function NewEventPage() {
  const result = await getVenues();
  const venues = result.success ? result.data || [] : [];

  return (
    <>
      <h1 className='text-3xl font-bold mb-6'>Create New Event</h1>
      <EventForm venues={venues} />
    </>
  );
}
