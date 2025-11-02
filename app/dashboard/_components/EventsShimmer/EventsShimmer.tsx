import { SPORTS } from '@/app/_constants/events';

interface EventsShimmerProps {
  sportFilter?: number | null;
  view: 'card' | 'list';
}

function EventsShimmer({ sportFilter, view }: EventsShimmerProps) {
  const sportsToShow =
    sportFilter === null || sportFilter === undefined
      ? SPORTS
      : SPORTS.filter(sport => sport.id === sportFilter);

  const isCardView = view === 'card';
  const shimmerItemClass = isCardView ? 'h-40' : 'h-20';
  const containerClass = isCardView
    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
    : 'flex flex-col gap-4';

  return (
    <div className='space-y-8'>
      {sportsToShow.map(sport => (
        <div key={sport.id}>
          <div className='mb-4'>
            <div className='h-7 w-32 bg-gray-200 rounded animate-pulse' />
          </div>
          <div className={containerClass}>
            {[1, 2, 3].map(i => (
              <div key={i} className={`${shimmerItemClass} bg-gray-200 rounded animate-pulse`} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default EventsShimmer;
