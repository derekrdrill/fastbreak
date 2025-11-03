import type { AuthFormValues } from '@/app/auth/_components/AuthForm/schema/auth.schema';
import type { AuthMode } from '@/app/auth/_types/auth.types';

export const AUTH_TABS: AuthMode[] = ['login', 'signup'];

export const AUTH_FORM_DEFAULT_VALUES: AuthFormValues = {
  email: '',
  password: '',
  confirmPassword: '',
};

export const AUTH_MODE_COPY: Record<
  AuthMode,
  {
    tabLabel: string;
    description: string;
    submitLabel: string;
    googleLabel: string;
    passwordPlaceholder: string;
  }
> = {
  login: {
    tabLabel: 'Sign In',
    description: 'Sign in to your Fastbreak account',
    submitLabel: 'Sign In',
    googleLabel: 'Sign in with Google',
    passwordPlaceholder: 'Enter your password',
  },
  signup: {
    tabLabel: 'Sign Up',
    description: 'Get started with Fastbreak today',
    submitLabel: 'Sign Up',
    googleLabel: 'Sign up with Google',
    passwordPlaceholder: 'Create a password',
  },
};
