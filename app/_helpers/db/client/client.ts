import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { type NextRequest, type NextResponse } from 'next/server';

/**
 * Creates and returns a Supabase client configured for server-side operations.
 * Uses cookies for authentication state management with SSR support.
 *
 * @param request - Optional Next.js request object (for middleware)
 * @param response - Optional Next.js response object (for middleware)
 * @returns Configured Supabase client instance
 */
async function getSupabaseClient(request?: NextRequest, response?: NextResponse) {
  const isMiddleware = request && response;

  let getAllCookies: () => Array<{ name: string; value: string }>;
  let setAllCookies: (
    cookiesToSet: Array<{ name: string; value: string; options?: CookieOptions }>,
  ) => void;

  if (isMiddleware) {
    // Middleware mode: use request/response cookies
    getAllCookies = () => request!.cookies.getAll();
    setAllCookies = cookiesToSet => {
      cookiesToSet.forEach(({ name, value, options }) => {
        request!.cookies.set(name, value);
        response!.cookies.set(name, value, options);
      });
    };
  } else {
    // Route handler/server component mode: use cookies from next/headers
    const cookieStore = await cookies();
    getAllCookies = () => cookieStore.getAll();
    setAllCookies = cookiesToSet => {
      cookiesToSet.forEach(({ name, value, options }) => {
        cookieStore.set(name, value, options);
      });
    };
  }

  return createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
    cookies: {
      getAll: getAllCookies,
      setAll: setAllCookies,
    },
  });
}

export { getSupabaseClient };
