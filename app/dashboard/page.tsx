export default function DashboardPage() {
  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-3xl font-bold'>Event Dashboard</h1>
        <a
          href='/event/new'
          className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
        >
          Create Event
        </a>
      </div>

      {/* TODO: Add search and filter controls */}
      <div className='mb-6'>
        {/* Search by name */}
        {/* Filter by sport type */}
      </div>

      {/* TODO: Add event list/grid with key details */}
      <div>{/* Event cards with: name, date, venue, sport type */}</div>
    </div>
  );
}
