import Link from 'next/link';
import { IoArrowBack } from 'react-icons/io5';
import EventForm from '../_components/EventForm';
import { getVenues } from '@/app/_actions/venues';

export default async function NewEventPage() {
  const result = await getVenues();
  const venues = result.success ? result.data || [] : [];

  return (
    <div className='container mx-auto px-4 py-8 max-w-2xl'>
      <Link
        href='/dashboard'
        className='inline-flex items-center text-blue-600 hover:text-blue-800 mb-4'
      >
        <IoArrowBack className='w-5 h-5 mr-2' />
        Back to Dashboard
      </Link>
      <h1 className='text-3xl font-bold mb-6'>Create New Event</h1>
      <EventForm venues={venues} />
    </div>
  );
}
