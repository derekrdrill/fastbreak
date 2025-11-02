import Link from 'next/link';
import { IoArrowBack } from 'react-icons/io5';
import EventForm from '@/app/event/_components/EventForm';
import { getVenues } from '@/app/_actions/venues';
import { EVENTS } from '@/app/_constants/events';
import { Event } from '@/app/_lib/types';

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Fetch venues from database
  const venuesResult = await getVenues();
  const venues = venuesResult.success ? venuesResult.data || [] : [];

  // TODO: Replace with actual database fetch when getEvent is implemented
  const eventData = EVENTS.find(e => e.id === Number(id));

  const event: Event | null = eventData
    ? {
        id: eventData.id,
        fullName: eventData.fullName,
        shortName: eventData.shortName,
        sportTypeId: eventData.sportType,
        date: typeof eventData.date === 'string' ? eventData.date : eventData.date.toISOString(),
        venues: Array.isArray(eventData.venues) ? eventData.venues : [eventData.venues],
      }
    : null;

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
      {event ? <EventForm venues={venues} event={event} /> : <p>Event not found</p>}
    </div>
  );
}
