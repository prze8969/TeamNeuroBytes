import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow static assets, images, API routes
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

  const response = NextResponse.next();

  // Auto-set the active role cookie based on the portal being viewed for seamless demo presentation
  if (pathname.includes('/farmer')) {
    response.cookies.set('user_role', 'FARMER', { path: '/' });
  } else if (pathname.includes('/buyer')) {
    response.cookies.set('user_role', 'BUYER', { path: '/' });
  } else if (pathname.includes('/fpo')) {
    response.cookies.set('user_role', 'ORGANIZATION', { path: '/' });
  } else if (pathname.includes('/admin')) {
    response.cookies.set('user_role', 'ADMIN', { path: '/' });
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
