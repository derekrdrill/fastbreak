import EventForm from '../_components/EventForm';

export default function NewEventPage() {
  return (
    <div className='container mx-auto px-4 py-8 max-w-2xl'>
      <h1 className='text-3xl font-bold mb-6'>Create New Event</h1>
      <EventForm />
    </div>
  );
}
