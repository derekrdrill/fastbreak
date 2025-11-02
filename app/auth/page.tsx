'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { signIn, signUp, signInWithGoogle } from '@/app/_actions/auth';
import { AuthForm } from './_components';

export default function LoginPage() {
  const router = useRouter();

  const handleSubmit = async (
    values: { email: string; password: string; confirmPassword?: string },
    mode: 'login' | 'signup',
  ) => {
    const result =
      mode === 'login'
        ? await signIn(values.email, values.password)
        : await signUp(values.email, values.password);

    if (result.success && result.data) {
      if (mode === 'signup') {
        toast.success(
          'Account created successfully! Please check your email to confirm your account.',
        );
      } else {
        toast.success('Signed in successfully!');
        router.push('/dashboard');
      }
    } else {
      toast.error(result.error || `Failed to ${mode}`);
    }
  };

  const handleGoogleAuth = async () => {
    const result = await signInWithGoogle();

    if (result.success && result.data) {
      window.location.href = result.data.url;
    } else {
      toast.error(result.error || 'Failed to initiate Google sign in');
    }
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
