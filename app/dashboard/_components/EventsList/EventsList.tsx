import classNames from 'classnames';
import { Fragment } from 'react/jsx-runtime';

import { TooltipProvider } from '@/components/ui/tooltip';
import { EventCard, EventListItem } from '@/app/dashboard/_components';
import { getEventsBySport } from '@/app/dashboard/_helpers/dashboard.helpers';
import { useDashboardStore } from '@/app/dashboard/_store/dashboard.store';

function EventsList() {
  const view = useDashboardStore(state => state.view);
  const eventsBySport = getEventsBySport();

  const isCardView = view === 'card';
  const isListView = view === 'list';

  return (
    <div className='space-y-8'>
      {eventsBySport.map(({ sport, events }) => (
        <div key={sport.id}>
          <div className='flex items-center gap-2 mb-4'>
            {sport.icon}
            <h2 className='text-2xl font-semibold'>{sport.name}</h2>
          </div>
          <div
            className={classNames('gap-4', {
              'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3': isCardView,
              'flex flex-col': isListView,
            })}
          >
            {events.map(event => (
              <Fragment key={event.id}>
                {isCardView && (
                  <TooltipProvider>
                    <EventCard {...event} />
                  </TooltipProvider>
                )}
                {isListView && <EventListItem {...event} />}
              </Fragment>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default EventsList;
