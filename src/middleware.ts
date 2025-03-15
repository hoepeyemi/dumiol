import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware will run on client-side navigation
export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Protected routes that require verification and wallet connection
  const protectedRoutes = ['/game', '/history'];

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    path === route || path.startsWith(`${route}/`)
  );

  // If it's a protected route, check for verification
  if (isProtectedRoute) {
    // Get the verification status from cookies
    const isVerified = request.cookies.get('selfVerified')?.value === 'true';
    
    // If not verified, redirect to home page
    if (!isVerified) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Continue with the request
  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: ['/game/:path*', '/history/:path*'],
}; 