'use server';

import { getSupabaseClient, type DbResult } from '@/app/_lib/db-helpers';
import type { User } from '@/app/_lib/types';

export async function signUp(email: string, password: string): Promise<DbResult<{ user: User }>> {
  try {
    const supabase = await getSupabaseClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data.user) {
      return { success: false, error: 'Failed to create user' };
    }

    const isEmailConfirmationRequired = data.user && !data.session;
    if (isEmailConfirmationRequired) {
      const user: User = {
        id: data.user.id,
        email: data.user.email || email,
      };
      return { success: true, data: { user } };
    }

    const user: User = {
      id: data.user.id,
      email: data.user.email || email,
    };

    return { success: true, data: { user } };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to sign up',
    };
  }
}

export async function signIn(email: string, password: string): Promise<DbResult<{ user: User }>> {
  try {
    const supabase = await getSupabaseClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data.user) {
      return { success: false, error: 'Failed to sign in' };
    }

    const user: User = {
      id: data.user.id,
      email: data.user.email || email,
    };

    return { success: true, data: { user } };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to sign in',
    };
  }
}

export async function signInWithGoogle(): Promise<DbResult<{ url: string }>> {
  try {
    const supabase = await getSupabaseClient();

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${baseUrl}/auth/callback`,
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data.url) {
      return { success: false, error: 'Failed to generate OAuth URL' };
    }

    return { success: true, data: { url: data.url } };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to initiate Google sign in',
    };
  }
}

export async function signOut(): Promise<DbResult<null>> {
  try {
    const supabase = await getSupabaseClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: null };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to sign out',
    };
  }
}

export async function getAuthenticatedSession(): Promise<DbResult<{ user: User } | null>> {
  try {
    const supabase = await getSupabaseClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      return { success: true, data: null };
    }

    if (!user || !user.email) {
      return { success: true, data: null };
    }

    const userData: User = {
      id: user.id,
      email: user.email,
    };

    return { success: true, data: { user: userData } };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get session',
    };
  }
}
