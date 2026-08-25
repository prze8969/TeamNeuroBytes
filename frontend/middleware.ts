// frontend/middleware.ts
// NOTE ON STATIC EXPORT / GITHUB PAGES:
// Next.js middleware DOES NOT execute when output: 'export' is configured (such as for GitHub Pages).
// The client-side <ProtectedRoute> layout wrappers in frontend/app/*/layout.tsx serve as the authoritative
// source of truth for route protection and access control during static deployments.
// This middleware file is preserved for Node.js / Vercel / server deployments.

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
