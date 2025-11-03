'use client';

import classNames from 'classnames';
import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { HiEye, HiEyeSlash } from 'react-icons/hi2';
import { FcGoogle } from 'react-icons/fc';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { FormInput } from '@/app/_components';
import { AUTH_MODE_COPY, AUTH_TABS } from '@/app/auth/_constants/auth.constants';
import { createAuthFormDefaults } from '@/app/auth/_helpers/auth.helpers';
import type { AuthMode } from '@/app/auth/_types/auth.types';
import {
  authSchema,
  type AuthFormValues,
} from '@/app/auth/_components/AuthForm/schema/auth.schema';

export interface AuthFormProps {
  onSubmit: (values: AuthFormValues, mode: AuthMode) => void | Promise<void>;
  onGoogleAuth: () => void;
}

function AuthForm({ onSubmit, onGoogleAuth }: AuthFormProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: createAuthFormDefaults(),
  });

  const isSubmitting = form.formState.isSubmitting;
  const modeCopy = useMemo(() => AUTH_MODE_COPY[mode], [mode]);

  const handleModeChange = useCallback(
    (newMode: AuthMode) => {
      if (newMode !== mode) {
        setMode(newMode);
        form.reset(createAuthFormDefaults());
        setShowPassword(false);
        setShowConfirmPassword(false);
      }
    },
    [form, mode],
  );

  const handleSubmit = useCallback(
    async (values: AuthFormValues) => {
      await onSubmit(values, mode);
    },
    [mode, onSubmit],
  );

  const passwordInputType = showPassword ? 'text' : 'password';
  const confirmPasswordInputType = showConfirmPassword ? 'text' : 'password';

  const passwordToggleHandler = useCallback(() => setShowPassword(prev => !prev), []);
  const confirmPasswordToggleHandler = useCallback(() => setShowConfirmPassword(prev => !prev), []);

  return (
    <div className='space-y-6'>
      <div className='text-center mb-8'>
        <div className='inline-flex gap-8 border-b border-gray-200 dark:border-gray-800'>
          {AUTH_TABS.map(tabMode => {
            const isActive = tabMode === mode;
            const tabCopy = AUTH_MODE_COPY[tabMode];

            return (
              <Button
                key={tabMode}
                type='button'
                variant='ghost'
                onClick={() => handleModeChange(tabMode)}
                className={classNames(
                  'pb-3 px-1 h-auto text-sm font-medium transition-colors relative rounded-none border-0',
                  {
                    'text-foreground': isActive,
                    'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300':
                      !isActive,
                  },
                )}
              >
                {tabCopy.tabLabel}
                {isActive && (
                  <span className='absolute bottom-0 left-0 right-0 h-0.5 bg-foreground' />
                )}
              </Button>
            );
          })}
        </div>

        <p className='text-gray-600 dark:text-gray-400 mt-6'>{modeCopy.description}</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
          <FormInput
            name='email'
            label='Email'
            type='email'
            placeholder='Enter your email'
            required
            disabled={isSubmitting}
          />
          <FormInput
            name='password'
            label='Password'
            type={passwordInputType}
            placeholder={modeCopy.passwordPlaceholder}
            required
            disabled={isSubmitting}
            endIcon={
              <button
                type='button'
                onClick={passwordToggleHandler}
                className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 cursor-pointer'
              >
                {showPassword && <HiEyeSlash className='h-5 w-5' />}
                {!showPassword && <HiEye className='h-5 w-5' />}
              </button>
            }
          />
          {mode === 'signup' && (
            <FormInput
              name='confirmPassword'
              label='Confirm Password'
              type={confirmPasswordInputType}
              placeholder='Confirm your password'
              required
              disabled={isSubmitting}
              endIcon={
                <button
                  type='button'
                  onClick={confirmPasswordToggleHandler}
                  className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 cursor-pointer'
                >
                  {showConfirmPassword && <HiEyeSlash className='h-5 w-5' />}
                  {!showConfirmPassword && <HiEye className='h-5 w-5' />}
                </button>
              }
            />
          )}
          <Button
            type='submit'
            disabled={isSubmitting}
            className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.01]'
          >
            {isSubmitting ? 'Processing...' : modeCopy.submitLabel}
          </Button>
        </form>
      </Form>

      <div className='relative'>
        <div className='absolute inset-0 flex items-center'>
          <span className='w-full border-t' />
        </div>
        <div className='relative flex justify-center text-xs uppercase'>
          <span className='bg-white px-2 text-gray-500'>Or continue with</span>
        </div>
      </div>

      <Button
        type='button'
        variant='outline'
        className='w-full'
        onClick={onGoogleAuth}
        disabled={isSubmitting}
      >
        <FcGoogle className='mr-2 h-4 w-4' />
        {modeCopy.googleLabel}
      </Button>
    </div>
  );
}

export default AuthForm;
