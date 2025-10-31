// TODO: Implement event card component
// Props: event data (name, date, venue, sport type)
// Actions: edit, delete buttons

interface EventCardProps {
  event: {
    id: string;
    name: string;
    date: Date;
    venues: string[];
    sportType: string;
  };
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      {/* TODO: Render event details */}
      <h3 className="font-semibold">{event.name}</h3>
      {/* Date, venues, sport type */}
      {/* Edit/Delete buttons */}
    </div>
  );
}

