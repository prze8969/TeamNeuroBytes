import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Allow static assets, images, next system routes, and API endpoints
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Redirect legacy /organization route to /fpo/dashboard
  if (pathname.startsWith('/organization')) {
    return NextResponse.redirect(new URL('/fpo/dashboard', request.url));
  }

  // List of private/protected dashboard paths
  const isProtectedPath = 
    pathname.startsWith('/farmer') ||
    pathname.startsWith('/buyer') ||
    pathname.startsWith('/fpo') ||
    pathname.startsWith('/transportation') ||
    pathname.startsWith('/warehouse') ||
    pathname.startsWith('/admin');

  const tokenCookie = request.cookies.get('token')?.value;
  const roleCookie = request.cookies.get('user_role')?.value;

  // If visiting a protected dashboard without a valid token session
  if (isProtectedPath) {
    if (!tokenCookie || tokenCookie.trim() === '') {
      let preselectedRole = 'farmer';
      if (pathname.includes('/buyer')) preselectedRole = 'buyer';
      else if (pathname.includes('/fpo')) preselectedRole = 'fpo';
      else if (pathname.includes('/transportation')) preselectedRole = 'transporter';
      else if (pathname.includes('/warehouse')) preselectedRole = 'warehouse';
      else if (pathname.includes('/admin')) preselectedRole = 'admin';

      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirectTo', pathname + search);
      loginUrl.searchParams.set('preselectedRole', preselectedRole);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
