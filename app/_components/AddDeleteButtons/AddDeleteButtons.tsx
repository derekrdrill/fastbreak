'use client';

import classNames from 'classnames';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { deleteEvent } from '@/app/_actions/events';
import { useDashboardStore } from '@/app/dashboard/_store/dashboard.store';

interface AddDeleteButtonsProps {
  className?: string;
  eventId: number;
  showDelete?: boolean;
  showEdit?: boolean;
}

function AddDeleteButtons({
  className,
  eventId,
  showDelete = false,
  showEdit = true,
}: AddDeleteButtonsProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const setEvents = useDashboardStore(state => state.setEvents);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();

    const confirmMessage =
      'Are you sure you want to delete this event? This action cannot be undone.';
    const hasConfirmed = confirm(confirmMessage);
    if (!hasConfirmed) {
      return;
    }

    setIsDeleting(true);
    const result = await deleteEvent(eventId);
    setIsDeleting(false);

    const successMessage = 'Event deleted successfully!';
    const errorMessage = result.error || 'Failed to delete event';

    if (result.success) {
      toast.success(successMessage);
      const currentEvents = useDashboardStore.getState().events;
      const updatedEvents = currentEvents.filter(e => e.id !== eventId);
      setEvents(updatedEvents);
      router.refresh();
    } else {
      toast.error(errorMessage);
    }
  };

  const deleteButtonText = isDeleting ? 'Deleting...' : 'Delete';
  const editLinkHref = `/event/${eventId}/edit`;

  return (
    <div className='flex gap-2'>
      {showEdit && (
        <Button
          asChild
          variant='outline'
          size='sm'
          className={classNames(
            'border-gray-400 text-gray-400 hover:bg-gray-500 hover:text-gray-50',
            className,
          )}
        >
          <Link href={editLinkHref}>Edit</Link>
        </Button>
      )}
      {showDelete && (
        <Button
          variant='outline'
          size='sm'
          onClick={handleDelete}
          disabled={isDeleting}
          className={classNames(
            'border-red-500 text-red-500 hover:bg-red-600 hover:text-red-50 hover:border-red-600',
            className,
          )}
        >
          {deleteButtonText}
        </Button>
      )}
    </div>
  );
}

export default AddDeleteButtons;
