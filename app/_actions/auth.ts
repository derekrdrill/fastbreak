'use server';

import {
  getSupabaseClient,
  handleDbOperation,
  createError,
  createSuccess,
  type DbResult,
} from '@/app/_helpers/db';
import type { User } from '@/app/_types';

export async function signUp(email: string, password: string): Promise<DbResult<{ user: User }>> {
  return handleDbOperation(async () => {
    const supabase = await getSupabaseClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
      },
    });

    if (error) {
      return createError(error.message);
    }

    if (!data.user) {
      return createError('Failed to create user');
    }

    const user: User = {
      id: data.user.id,
      email: data.user.email || email,
    };

    return createSuccess({ user });
  }, 'Failed to sign up');
}

export async function signIn(email: string, password: string): Promise<DbResult<{ user: User }>> {
  return handleDbOperation(async () => {
    const supabase = await getSupabaseClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return createError(error.message);
    }

    if (!data.user) {
      return createError('Failed to sign in');
    }

    const user: User = {
      id: data.user.id,
      email: data.user.email || email,
    };

    return createSuccess({ user });
  }, 'Failed to sign in');
}

export async function signInWithGoogle(): Promise<DbResult<{ url: string }>> {
  return handleDbOperation(async () => {
    const supabase = await getSupabaseClient();

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${baseUrl}/auth/callback`,
      },
    });

    if (error) {
      return createError(error.message);
    }

    if (!data.url) {
      return createError('Failed to generate OAuth URL');
    }

    return createSuccess({ url: data.url });
  }, 'Failed to initiate Google sign in');
}

export async function signOut(): Promise<DbResult<null>> {
  return handleDbOperation(async () => {
    const supabase = await getSupabaseClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
      return createError(error.message);
    }

    return createSuccess(null);
  }, 'Failed to sign out');
}

export async function getAuthenticatedSession(): Promise<DbResult<{ user: User } | null>> {
  return handleDbOperation(async () => {
    const supabase = await getSupabaseClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    // No error means we checked - user might not be authenticated, which is fine
    if (error || !user || !user.email) {
      return createSuccess(null);
    }

    const userData: User = {
      id: user.id,
      email: user.email,
    };

    return createSuccess({ user: userData });
  }, 'Failed to get session');
}
