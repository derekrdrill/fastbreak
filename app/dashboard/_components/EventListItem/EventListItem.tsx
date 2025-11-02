import { Event } from '@/app/_lib/types';
import { getFormattedVenues } from '@/app/dashboard/_helpers/dashboard.helpers';
import EventEditButton from '../EventEditButton/EventEditButton';

function EventListItem({ id, date, fullName, shortName, venues }: Omit<Event, 'sportType'>) {
  const formattedDate = date.toLocaleDateString();
  const formattedVenues = getFormattedVenues({ venues });

  return (
    <div className='flex items-center justify-between gap-4'>
      <div className='flex flex-col gap-1'>
        <h3>
          {fullName} - ({shortName})
        </h3>
        <p className='flex gap-2 text-sm text-gray-500'>
          <span>{formattedVenues}</span>
          <span>{formattedDate}</span>
        </p>
      </div>
      <EventEditButton eventId={id} />
    </div>
  );
}

export default EventListItem;
