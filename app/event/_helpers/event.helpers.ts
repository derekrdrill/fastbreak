import type { EventFormDefaultValues } from '../_types/event.types';
import { EVENT_FORM_DEFAULT_VALUES } from '../_constants/event.constants';

function createEventFormDefaults(overrides: EventFormDefaultValues = {}): EventFormDefaultValues {
  const baseVenues = EVENT_FORM_DEFAULT_VALUES.venues ?? [''];

  return {
    ...EVENT_FORM_DEFAULT_VALUES,
    ...overrides,
    venues: overrides.venues ?? [...baseVenues],
  };
}

export { createEventFormDefaults };
