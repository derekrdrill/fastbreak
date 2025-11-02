import { Fragment } from 'react/jsx-runtime';

import { TooltipProvider } from '@/components/ui/tooltip';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { EventCard, EventListItem } from '@/app/dashboard/_components';
import { getEventsBySport } from '@/app/dashboard/_helpers/dashboard.helpers';
import { useDashboardStore } from '@/app/dashboard/_store/dashboard.store';
import { useResponsiveEngine } from '@/app/_hooks';

function EventsList() {
  const { isMobile, isTablet } = useResponsiveEngine();
  const view = useDashboardStore(state => state.view);
  const events = useDashboardStore(state => state.events);
  const searchQuery = useDashboardStore(state => state.searchQuery);
  const sportFilter = useDashboardStore(state => state.sportFilter);
  const eventsBySport = getEventsBySport({ events, searchQuery, sportFilter });

  const isCardView = view === 'card';
  const isListView = view === 'list';

  return (
    <div className='space-y-8'>
      {eventsBySport.map(({ sport, events }) => {
        const visibleCards = isMobile ? 1 : isTablet ? 2 : 3;
        const shouldShowCarousel = isCardView && events.length > visibleCards;

        return (
          <Fragment key={sport.id}>
            <div className='flex items-center gap-2 mb-4'>
              {sport.icon}
              <h2 className='text-2xl font-semibold'>{sport.name}</h2>
            </div>
            {isCardView && (
              <Carousel
                opts={{
                  align: 'start',
                  loop: false,
                }}
                className='w-full px-10 lg:px-0'
              >
                <CarouselContent>
                  {events.map(event => (
                    <CarouselItem key={event.id} className='md:basis-1/2 lg:basis-1/3'>
                      <TooltipProvider>
                        <EventCard {...event} />
                      </TooltipProvider>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {shouldShowCarousel && (
                  <>
                    <CarouselPrevious />
                    <CarouselNext />
                  </>
                )}
              </Carousel>
            )}
            {isListView && (
              <div className='flex flex-col gap-4'>
                {events.map(event => (
                  <EventListItem key={event.id} {...event} />
                ))}
              </div>
            )}
          </Fragment>
        );
      })}
    </div>
  );
}

export default EventsList;
