'use client';

import classNames from 'classnames';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { HiEye, HiEyeSlash } from 'react-icons/hi2';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { FormInput } from '@/app/_components';
import { authSchema, type AuthFormValues } from './schema/auth.schema';

type AuthMode = 'login' | 'signup';

interface AuthFormProps {
  onSubmit: (values: AuthFormValues, mode: AuthMode) => void | Promise<void>;
  onGoogleAuth: () => void;
}

function AuthForm({ onSubmit, onGoogleAuth }: AuthFormProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const isLogin = mode === 'login';
  const isSignup = !isLogin;

  const handleModeChange = (newMode: AuthMode) => {
    if (newMode !== mode) {
      setMode(newMode);
      form.reset();
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
  };

  const handleSubmit = async (values: AuthFormValues) => {
    await onSubmit(values, mode);
  };

  const descriptionText = isLogin
    ? 'Sign in to your Fastbreak account'
    : 'Get started with Fastbreak today';
  const submitButtonText = isLogin ? 'Sign In' : 'Sign Up';
  const googleButtonText = isLogin ? 'Sign in with Google' : 'Sign up with Google';

  const passwordInputType = showPassword ? 'text' : 'password';
  const passwordPlaceholder = isLogin ? 'Enter your password' : 'Create a password';

  const confirmPasswordInputType = showConfirmPassword ? 'text' : 'password';

  const passwordToggleHandler = () => setShowPassword(!showPassword);
  const confirmPasswordToggleHandler = () => setShowConfirmPassword(!showConfirmPassword);

  return (
    <div className='space-y-6'>
      <div className='text-center mb-8'>
        <div className='inline-flex gap-8 border-b border-gray-200 dark:border-gray-800'>
          <Button
            type='button'
            variant='ghost'
            onClick={() => handleModeChange('login')}
            className={classNames(
              'pb-3 px-1 h-auto text-sm font-medium transition-colors relative rounded-none border-0',
              {
                'text-foreground': isLogin,
                'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300':
                  !isLogin,
              },
            )}
          >
            Sign In
            {isLogin && <span className='absolute bottom-0 left-0 right-0 h-0.5 bg-foreground' />}
          </Button>
          <Button
            type='button'
            variant='ghost'
            onClick={() => handleModeChange('signup')}
            className={classNames(
              'pb-3 px-1 h-auto text-sm font-medium transition-colors relative rounded-none border-0',
              {
                'text-foreground': isSignup,
                'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300':
                  !isSignup,
              },
            )}
          >
            Sign Up
            {isSignup && <span className='absolute bottom-0 left-0 right-0 h-0.5 bg-foreground' />}
          </Button>
        </div>

        <p className='text-gray-600 dark:text-gray-400 mt-6'>{descriptionText}</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
          <FormInput
            name='email'
            label='Email'
            type='email'
            placeholder='Enter your email'
            required
          />
          <FormInput
            name='password'
            label='Password'
            type={passwordInputType}
            placeholder={passwordPlaceholder}
            required
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
          {isSignup && (
            <FormInput
              name='confirmPassword'
              label='Confirm Password'
              type={confirmPasswordInputType}
              placeholder='Confirm your password'
              required
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
            className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.01]'
          >
            {submitButtonText}
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

      <Button type='button' variant='outline' className='w-full' onClick={onGoogleAuth}>
        <svg className='mr-2 h-4 w-4' viewBox='0 0 24 24'>
          <path
            d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
            fill='#4285F4'
          />
          <path
            d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
            fill='#34A853'
          />
          <path
            d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
            fill='#FBBC05'
          />
          <path
            d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
            fill='#EA4335'
          />
        </svg>
        {googleButtonText}
      </Button>
    </div>
  );
}

export default AuthForm;
