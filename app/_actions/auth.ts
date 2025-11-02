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
  return handleDbOperation({
    operation: async () => {
      const supabase = await getSupabaseClient();

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
        },
      });

      if (error) {
        return createError({ message: error.message });
      }

      if (!data.user) {
        return createError({ message: 'Failed to create user' });
      }

      const user: User = {
        id: data.user.id,
        email: data.user.email || email,
      };

      return createSuccess({ data: { user } });
    },
    fallbackError: 'Failed to sign up',
  });
}

export async function signIn(email: string, password: string): Promise<DbResult<{ user: User }>> {
  return handleDbOperation({
    operation: async () => {
      const supabase = await getSupabaseClient();

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return createError({ message: error.message });
      }

      if (!data.user) {
        return createError({ message: 'Failed to sign in' });
      }

      const user: User = {
        id: data.user.id,
        email: data.user.email || email,
      };

      return createSuccess({ data: { user } });
    },
    fallbackError: 'Failed to sign in',
  });
}

export async function signInWithGoogle(): Promise<DbResult<{ url: string }>> {
  return handleDbOperation({
    operation: async () => {
      const supabase = await getSupabaseClient();

      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${baseUrl}/auth/callback`,
        },
      });

      if (error) {
        return createError({ message: error.message });
      }

      if (!data.url) {
        return createError({ message: 'Failed to generate OAuth URL' });
      }

      return createSuccess({ data: { url: data.url } });
    },
    fallbackError: 'Failed to initiate Google sign in',
  });
}

export async function signOut(): Promise<DbResult<null>> {
  return handleDbOperation({
    operation: async () => {
      const supabase = await getSupabaseClient();

      const { error } = await supabase.auth.signOut();

      if (error) {
        return createError({ message: error.message });
      }

      return createSuccess({ data: null });
    },
    fallbackError: 'Failed to sign out',
  });
}

export async function getAuthenticatedSession(): Promise<DbResult<{ user: User } | null>> {
  return handleDbOperation({
    operation: async () => {
      const supabase = await getSupabaseClient();

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user || !user.email) {
        return createSuccess({ data: null });
      }

      const userData: User = {
        id: user.id,
        email: user.email,
      };

      return createSuccess({ data: { user: userData } });
    },
    fallbackError: 'Failed to get session',
  });
}
