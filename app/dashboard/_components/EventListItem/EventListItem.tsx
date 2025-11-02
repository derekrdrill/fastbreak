import { Event } from '@/app/_types';
import { getFormattedVenues } from '@/app/dashboard/_helpers/dashboard.helpers';
import AddDeleteButtons from '@/app/_components/AddDeleteButtons/AddDeleteButtons';

function EventListItem({ id, date, fullName, shortName, venues }: Omit<Event, 'sportTypeId'>) {
  const formattedDate = new Date(date).toLocaleDateString();
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
      <AddDeleteButtons eventId={id} showDelete />
    </div>
  );
}

export default EventListItem;
