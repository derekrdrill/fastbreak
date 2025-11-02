import { Event } from '@/app/_lib/types';
import { getFormattedVenues } from '@/app/dashboard/_helpers/dashboard.helpers';
import { AddDeleteButtons } from '@/app/_components';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

function EventCard({ id, shortName, fullName, date, venues }: Omit<Event, 'sportTypeId'>) {
  const formattedDate = new Date(date).toLocaleDateString();
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
        <AddDeleteButtons eventId={id} className='mt-4' showDelete />
      </CardContent>
    </Card>
  );
}

export default EventCard;
