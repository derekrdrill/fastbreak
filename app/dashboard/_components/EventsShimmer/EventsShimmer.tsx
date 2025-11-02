import classNames from 'classnames';
import { SPORTS } from '@/app/_constants/events';

interface EventsShimmerProps {
  sportFilter?: number | null;
  view: 'card' | 'list';
}

function EventsShimmer({ sportFilter, view }: EventsShimmerProps) {
  const hasNoSportFilter = sportFilter === null || sportFilter === undefined;
  const sportsToShow = hasNoSportFilter ? SPORTS : SPORTS.filter(sport => sport.id === sportFilter);

  const isCardView = view === 'card';
  const isListView = !isCardView;

  return (
    <div className='space-y-8'>
      {sportsToShow.map(sport => (
        <div key={sport.id}>
          <div className='mb-4'>
            <div className='h-7 w-32 bg-gray-200 rounded animate-pulse' />
          </div>
          <div
            className={classNames({
              'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4': isCardView,
              'flex flex-col gap-4': isListView,
            })}
          >
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className={classNames('bg-gray-200 rounded animate-pulse', {
                  'h-40': isCardView,
                  'h-20': isListView,
                })}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default EventsShimmer;
