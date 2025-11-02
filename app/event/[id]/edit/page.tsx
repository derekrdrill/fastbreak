import EventForm from '@/app/event/_components/EventForm';
import { getVenues } from '@/app/_actions/venues';
import { getEvent } from '@/app/_actions/events';
import { BackButton, AddDeleteButtons } from '@/app/_components';

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [venuesResult, eventResult] = await Promise.all([getVenues(), getEvent(Number(id))]);

  const venues = venuesResult.success ? venuesResult.data || [] : [];
  const event = eventResult.success ? eventResult.data || null : null;

  return (
    <div className='container mx-auto px-4 py-8 max-w-2xl'>
      <BackButton />
      <h1 className='text-3xl font-bold mb-6'>Edit Event</h1>
      {event && (
        <>
          <EventForm venues={venues} event={event} />
          <div className='mt-6 pt-6 border-t'>
            <AddDeleteButtons eventId={event.id} showDelete showEdit={false} />
          </div>
        </>
      )}
      {!event && <p>Event not found</p>}
    </div>
  );
}
