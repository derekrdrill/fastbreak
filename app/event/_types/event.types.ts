import type { FormValues } from '@/app/event/_components/schema/event.schema';

type EventFormMode = 'create' | 'edit';

type EventFormCopy = {
  submitLabel: string;
  loadingLabel: string;
  successMessage: string;
  errorMessage: string;
};

export type EventFormDefaultValues = Partial<FormValues>;

export type { EventFormMode, EventFormCopy };
