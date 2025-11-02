'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { signIn, signUp, signInWithGoogle } from '@/app/_actions';
import { AuthForm } from './_components';

function LoginPage() {
  const router = useRouter();

  const handleSubmit = async (
    values: { email: string; password: string; confirmPassword?: string },
    mode: 'login' | 'signup',
  ) => {
    const isLoginMode = mode === 'login';
    const isSignupMode = !isLoginMode;

    const authResult = isLoginMode
      ? await signIn({ email: values.email, password: values.password })
      : await signUp({ email: values.email, password: values.password });

    const hasSuccess = authResult.success && authResult.data;
    const errorMessage = authResult.error || `Failed to ${mode}`;

    if (hasSuccess) {
      if (isSignupMode) {
        const signupMessage =
          'Account created successfully! Please check your email to confirm your account.';
        toast.success(signupMessage);
      } else {
        const signinMessage = 'Signed in successfully!';
        toast.success(signinMessage);
        router.push('/dashboard');
      }
    } else {
      toast.error(errorMessage);
    }
  };

  const handleGoogleAuth = async () => {
    const result = await signInWithGoogle();

    const hasSuccess = result.success && result.data;
    const errorMessage = result.error || 'Failed to initiate Google sign in';
    const googleAuthUrl = result.data?.url;

    if (hasSuccess && googleAuthUrl) {
      window.location.href = googleAuthUrl;
    } else {
      toast.error(errorMessage);
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

export default LoginPage;
