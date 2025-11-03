import { AUTH_FORM_DEFAULT_VALUES } from '@/app/auth/_constants/auth.constants';
import type { AuthFormValues } from '@/app/auth/_components/AuthForm/schema/auth.schema';

export function createAuthFormDefaults(): AuthFormValues {
  return {
    ...AUTH_FORM_DEFAULT_VALUES,
  };
}

// export { createAuthFormDefaults };
