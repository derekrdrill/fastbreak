'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface DeleteConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  isDeleting?: boolean;
}

function DeleteConfirmationModal({
  open,
  onOpenChange,
  onConfirm,
  title = 'Delete Confirmation',
  description = 'Are you sure you want to delete this? This action cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  isDeleting = false,
}: DeleteConfirmationModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            className='hover:bg-white hover:text-black'
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            {cancelText}
          </Button>
          <Button
            variant='outline'
            onClick={handleConfirm}
            disabled={isDeleting}
            className='border-red-500 text-red-500 hover:bg-red-600 hover:text-red-50 hover:border-red-600'
          >
            {isDeleting ? 'Deleting...' : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteConfirmationModal;

