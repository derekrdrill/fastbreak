// TODO: Implement event form component
// Uses shadcn Form component with react-hook-form
// Fields:
//   - Event name (text input)
//   - Sport type (select dropdown)
//   - Date & Time (date/time picker)
//   - Description (textarea)
//   - Venues (dynamic array - add/remove venues)
// Submit button with loading/error states

interface EventFormProps {
  eventId?: string; // If provided, this is an edit form
  defaultValues?: {
    name: string;
    sportType: string;
    date: Date;
    description: string;
    venues: string[];
  };
}

export default function EventForm({ eventId, defaultValues }: EventFormProps) {
  return (
    <div>
      {/* TODO: Implement form using shadcn Form component */}
      {/* TODO: Add react-hook-form integration */}
    </div>
  );
}

