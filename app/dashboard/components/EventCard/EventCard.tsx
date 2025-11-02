import { Event } from '@/app/_lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { getFormattedVenues } from '@/app/dashboard/helpers/dashboard.helpers';
import EventEditButton from '../EventEditButton/EventEditButton';

function EventCard({ id, shortName, fullName, date, venues }: Event) {
  const formattedDate = date.toLocaleDateString();
  const formattedVenues = getFormattedVenues({ venues });

  return (
    <Card className='hover:shadow-md transition-shadow'>
      <CardHeader>
        <Tooltip>
          <TooltipTrigger asChild>
            <CardTitle>{shortName}</CardTitle>
          </TooltipTrigger>
          <TooltipContent>
            <p>{fullName}</p>
          </TooltipContent>
        </Tooltip>
      </CardHeader>
      <CardContent>
        <p className='text-sm text-gray-500'>{formattedVenues}</p>
        <p className='text-sm text-gray-500'>{formattedDate}</p>
        <EventEditButton eventId={id} className='mt-4 w-full' />
      </CardContent>
    </Card>
  );
}

export default EventCard;
