import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtDecode } from 'jwt-decode'

// The protected routes and their required roles
const roleRouteMap: Record<string, string[]> = {
  '/farmer': ['FARMER'],
  '/buyer': ['BUYER'],
  '/fpo': ['FPO'],
  '/organization': ['ORGANIZATION', 'FPO'],
  '/warehouse': ['WAREHOUSE'],
  '/transportation': ['TRANSPORTATION'],
  '/admin': ['ADMIN'],
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const userRoleCookie = request.cookies.get('user_role')?.value
  const { pathname } = request.nextUrl

  // Allow auth routes, public assets, and static files
  if (
    pathname.startsWith('/login') ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/kyc') ||
    pathname.startsWith('/_next') ||
    pathname === '/'
  ) {
    return NextResponse.next()
  }

  // If no token or role present, redirect to login
  if (!token && !userRoleCookie) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  let userRole = userRoleCookie || 'FARMER'

  if (token && token !== 'mock-jwt-token') {
    try {
      const decoded: any = jwtDecode(token)
      if (decoded?.role) {
        userRole = decoded.role
      }
    } catch (error) {
      // Fallback to cookie role or login
    }
  }

  // Check if user is accessing a role-protected route
  for (const [routePrefix, allowedRoles] of Object.entries(roleRouteMap)) {
    if (pathname.startsWith(routePrefix) && !allowedRoles.includes(userRole)) {
      const dashboardUrl = `/${userRole.toLowerCase()}/dashboard`
      return NextResponse.redirect(new URL(dashboardUrl, request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
