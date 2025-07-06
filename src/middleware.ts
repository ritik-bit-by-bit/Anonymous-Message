import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
export {default} from 'next-auth/middleware'
import { getToken } from 'next-auth/jwt'
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const token = await getToken({req:request})
    const url = request.nextUrl;

    // If the user is authenticated
    if(token) {
        // and tries to access auth pages or the root, redirect to dashboard
        if (
            url.pathname.startsWith('/sign-in') ||
            url.pathname.startsWith('/signup') ||
            url.pathname.startsWith('/verify') ||
            url.pathname === '/'
        ) {
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }
    } 
    // If the user is not authenticated
    else {
        // and tries to access protected pages, redirect to sign-in
        if (url.pathname.startsWith('/dashboard')) {
            return NextResponse.redirect(new URL('/sign-in', request.url));
        }
    }

    // Allow the request to continue
    return NextResponse.next();
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/sign-in',
    '/sign-up',
    '/',
    '/dashboard/:path*',
    '/verify/:path*'
  ]
}