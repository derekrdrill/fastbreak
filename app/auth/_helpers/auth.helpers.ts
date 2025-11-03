import { AUTH_FORM_DEFAULT_VALUES } from '../_constants/auth.constants';
import type { AuthFormValues } from '../_components/AuthForm/schema/auth.schema';

export function createAuthFormDefaults(): AuthFormValues {
  return {
    ...AUTH_FORM_DEFAULT_VALUES,
  };
}

// export { createAuthFormDefaults };
