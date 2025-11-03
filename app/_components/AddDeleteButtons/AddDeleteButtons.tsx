'use client';

import classNames from 'classnames';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { deleteEvent } from '@/app/_actions';
import { useDashboardStore } from '@/app/dashboard/_store/dashboard.store';
import DeleteConfirmationModal from '@/app/_components/DeleteConfirmationModal/DeleteConfirmationModal';

interface AddDeleteButtonsProps {
  className?: string;
  deleteButtonText?: string;
  eventId: number;
  showDelete?: boolean;
  showEdit?: boolean;
}

function AddDeleteButtons({
  className,
  deleteButtonText = 'Delete',
  eventId,
  showDelete = false,
  showEdit = true,
}: AddDeleteButtonsProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const setEvents = useDashboardStore(state => state.setEvents);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    const result = await deleteEvent({ eventId });
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

  const deleteButtonTextMapped = isDeleting ? 'Deleting...' : deleteButtonText;
  const editLinkHref = `/event/${eventId}/edit`;

  return (
    <>
      <div className='flex gap-2'>
        {showEdit && (
          <Button
            asChild
            variant='outline'
            size='sm'
            className={classNames(
              'border-indigo-400 text-indigo-400 hover:bg-indigo-500 hover:text-indigo-50',
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
            onClick={handleDeleteClick}
            disabled={isDeleting}
            className={classNames(
              'border-red-500 text-red-500 hover:bg-red-600 hover:text-red-50 hover:border-red-600',
              className,
            )}
          >
            {deleteButtonTextMapped}
          </Button>
        )}
      </div>
      <DeleteConfirmationModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onConfirm={handleConfirmDelete}
        title='Delete Event'
        description='Are you sure you want to delete this event? This action cannot be undone.'
        confirmText={deleteButtonText}
        isDeleting={isDeleting}
      />
    </>
  );
}

export default AddDeleteButtons;
