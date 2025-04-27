import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  if (!token) {
    console.log('Token not found, redirecting to login...');
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    console.log('Attempting to verify JWT...');

    await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));

    console.log('JWT verified successfully');
    return NextResponse.next();
  } catch (error) {
    console.log('Error during JWT verification:', error);
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
  matcher: ['/api/projects/:path*', '/api/users/:path*'],
};
