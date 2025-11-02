import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface EventEditButtonProps {
  eventId: number;
  className?: string;
}

function EventEditButton({ eventId, className }: EventEditButtonProps) {
  return (
    <Button asChild variant='outline' size='sm' className={className}>
      <Link href={`/event/${eventId}/edit`}>Edit</Link>
    </Button>
  );
}

export default EventEditButton;
