import type { EventFormMode, EventFormCopy, EventFormDefaultValues } from '../_types';

const EVENT_FORM_DEFAULT_VALUES: EventFormDefaultValues = {
  fullName: '',
  shortName: '',
  description: '',
  sportType: undefined,
  date: '',
  venues: [''],
};

const EVENT_FORM_COPY: Record<EventFormMode, EventFormCopy> = {
  create: {
    submitLabel: 'Create Event',
    loadingLabel: 'Creating...',
    successMessage: 'Event created successfully!',
    errorMessage: 'Failed to create event',
  },
  edit: {
    submitLabel: 'Update Event',
    loadingLabel: 'Updating...',
    successMessage: 'Event updated successfully!',
    errorMessage: 'Failed to update event',
  },
};

export { EVENT_FORM_DEFAULT_VALUES, EVENT_FORM_COPY };
