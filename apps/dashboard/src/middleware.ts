import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that don't require authentication
const publicRoutes = ['/', '/login', '/signup', '/pricing'];

// Routes that require authentication (prefix match)
const protectedPrefixes = ['/overview', '/analytics', '/users', '/billing', '/settings', '/help', '/jobs'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if it's a public route
  const _isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // Check if it's a protected route
  const _isProtectedRoute = protectedPrefixes.some((prefix) =>
    pathname.startsWith(prefix)
  );

  // For protected routes, we can check for an auth cookie if we set one
  // For now, we rely on client-side protection in the layout component
  // This middleware is here for future enhancement with cookie-based auth

  // Allow all requests to pass through
  // Client-side protection in dashboard layout will handle actual auth check
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*$).*)',
  ],
};
