import { NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const tokenHash = requestUrl.searchParams.get('token_hash');
  const type = requestUrl.searchParams.get('type');
  const origin = requestUrl.origin;
  const cookieStore = await cookies();

  const supabase = createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: Array<{ name: string; value: string; options: CookieOptions }>) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options);
        });
      },
    },
  });

  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return NextResponse.redirect(`${origin}/auth?error=${encodeURIComponent(error.message)}`);
    }
    // Verify the user is confirmed after exchange
    if (data?.user && data.session) {
      return NextResponse.redirect(`${origin}/dashboard`);
    }
  }

  // Handle email confirmation with token_hash (alternative method)
  if (tokenHash && type === 'email') {
    const { error } = await supabase.auth.verifyOtp({
      type: 'email',
      token_hash: tokenHash,
    });
    if (error) {
      return NextResponse.redirect(`${origin}/auth?error=${encodeURIComponent(error.message)}`);
    }
    return NextResponse.redirect(`${origin}/dashboard`);
  }

  // If no code or token_hash, redirect to auth page
  return NextResponse.redirect(`${origin}/auth`);
}
