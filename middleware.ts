import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './src/lib/auth';

export function middleware(request: NextRequest) {
    // Protect admin routes
    if (request.nextUrl.pathname.startsWith('/admin')) {
        const token = request.cookies.get('auth-token')?.value;

        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/admin/:path*',
};
