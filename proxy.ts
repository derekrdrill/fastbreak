import { type NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/app/_helpers/db/client/client';

export async function proxy(request: NextRequest) {
  const response = NextResponse.next();

  // Skip auth redirects in local development
  const isLocalDev = process.env.ENV === 'local';

  if (isLocalDev) {
    return response;
  }

  const supabase = await getSupabaseClient(request, response);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthPage = request.nextUrl.pathname.startsWith('/auth');
  const isProtectedRoute =
    request.nextUrl.pathname.startsWith('/dashboard') ||
    request.nextUrl.pathname.startsWith('/event/new') ||
    request.nextUrl.pathname.match(/^\/event\/\d+\/edit$/);

  if (!user && isProtectedRoute) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  if (user && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
