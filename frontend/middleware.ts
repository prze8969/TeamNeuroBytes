import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtDecode } from 'jwt-decode'

// The protected routes and their required roles
const roleRouteMap: Record<string, string[]> = {
  '/farmer': ['FARMER'],
  '/buyer': ['BUYER'],
  '/organization': ['ORGANIZATION'],
  '/warehouse': ['WAREHOUSE'],
  '/transportation': ['TRANSPORTATION'],
  '/admin': ['ADMIN'],
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl

  // Allow auth routes and public assets
  if (pathname.startsWith('/login') || pathname.startsWith('/register') || pathname.startsWith('/_next') || pathname === '/') {
    return NextResponse.next()
  }

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    const decoded: any = jwtDecode(token)
    const userRole = decoded.role

    // Check if the user is trying to access a role-protected route
    for (const [routePrefix, allowedRoles] of Object.entries(roleRouteMap)) {
      if (pathname.startsWith(routePrefix) && !allowedRoles.includes(userRole)) {
        // Redirect unauthorized users to their own dashboard
        const dashboardUrl = `/${userRole.toLowerCase()}/dashboard`
        return NextResponse.redirect(new URL(dashboardUrl, request.url))
      }
    }
  } catch (error) {
    // Invalid token
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
