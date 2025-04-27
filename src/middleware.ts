import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function middleware(req: NextRequest) {
  NextResponse.next();
  // const token = req.cookies.get('token')?.value;

  // console.log(req.cookies);

  // if (!token) {
  //   return NextResponse.redirect(new URL('/login', req.url));
  // }

  // try {
  //   console.log('jwt verify');
  //   await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));

  //   console.log('jwt verified successfully');
  //   return NextResponse.next();
  // } catch (error) {
  //   console.log('error while verification');
  //   return NextResponse.redirect(new URL('/login', req.url));
  // }
}

export const config = {
  matcher: ['/api/projects/:path*', '/api/users/:path'],
};
