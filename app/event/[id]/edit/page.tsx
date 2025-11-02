import EventForm from '@/app/event/_components/EventForm';
import { EVENTS, SPORTS } from '@/app/_constants/events';
import { Event, SportType } from '@/app/_lib/types';

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const eventData = EVENTS.find(e => e.id === Number(id));
  const sportName = SPORTS.find(s => s.id === eventData?.sportType)?.name as SportType;

  const event: Event | null = eventData
    ? {
        id: eventData.id,
        fullName: eventData.fullName,
        shortName: eventData.shortName,
        sportType: sportName || 'Soccer',
        date: eventData.date,
        venues: eventData.venue,
      }
    : null;

  const handleSubmit = async (values: {
    fullName: string;
    shortName: string;
    sportType: string;
    date: string;
    venues: string[];
  }) => {
    'use server';
    console.log('Update event', id, values);
    // TODO: Handle event update
  };

  return (
    <div className='container mx-auto px-4 py-8 max-w-2xl'>
      <h1 className='text-3xl font-bold mb-6'>Edit Event</h1>
      {event ? <EventForm event={event} onSubmit={handleSubmit} /> : <p>Event not found</p>}
    </div>
  );
}
