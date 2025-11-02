'use client';

import { useAuthStore } from '@/app/_store';
import { AuthForm } from './_components';

export default function LoginPage() {
  const setAuth = useAuthStore(state => state.setAuth);

  const handleSubmit = async (
    values: { email: string; password: string; confirmPassword?: string },
    mode: 'login' | 'signup',
  ) => {
    console.log(`${mode} attempt:`, values);
    // TODO: Implement auth with server action
    // if (mode === 'login') {
    //   const result = await signIn(values.email, values.password)
    //   if (result.success) {
    //     setAuth(true, result.user)
    //   }
    // } else {
    //   const result = await signUp(values.email, values.password)
    //   if (result.success) {
    //     setAuth(true, result.user)
    //   }
    // }
  };

  const handleGoogleAuth = async () => {
    console.log('Google auth attempt');
    // TODO: Implement Google OAuth
    // const result = await signInWithGoogle()
    // if (result.success) {
    //   setAuth(true, result.user)
    // }
  };

  return (
    <div className='container mx-auto px-4 py-8 max-w-md'>
      <div className='text-center mb-10'>
        <h2 className='text-2xl font-bold mb-2'>Welcome to Fastbreak</h2>
        <p className='text-gray-600 dark:text-gray-400 text-sm'>
          Create, manage, and organize sports events all in one place
        </p>
      </div>
      <AuthForm onSubmit={handleSubmit} onGoogleAuth={handleGoogleAuth} />
    </div>
  );
}
