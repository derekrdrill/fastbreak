import Link from 'next/link';
import { IoArrowBack } from 'react-icons/io5';
import EventForm from '@/app/event/_components/EventForm';
import { getVenues } from '@/app/_actions/venues';
import { getEvent } from '@/app/_actions/events';
import EventActions from '@/app/dashboard/_components/EventActions/EventActions';

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Fetch venues and event from database
  const [venuesResult, eventResult] = await Promise.all([
    getVenues(),
    getEvent(Number(id)),
  ]);

  const venues = venuesResult.success ? venuesResult.data || [] : [];
  const event = eventResult.success ? eventResult.data || null : null;

  return (
    <div className='container mx-auto px-4 py-8 max-w-2xl'>
      <Link
        href='/dashboard'
        className='inline-flex items-center text-blue-600 hover:text-blue-800 mb-4'
      >
        <IoArrowBack className='w-5 h-5 mr-2' />
        Back to Dashboard
      </Link>
      <h1 className='text-3xl font-bold mb-6'>Edit Event</h1>
      {event ? (
        <>
          <EventForm venues={venues} event={event} />
          <div className='mt-6 pt-6 border-t'>
            <EventActions eventId={event.id} showDelete />
          </div>
        </>
      ) : (
        <p>Event not found</p>
      )}
    </div>
  );
}
