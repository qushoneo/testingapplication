import { verifyToken } from '@/app/lib/auth';

import { NextRequest, NextResponse } from 'next/server';
import { userToDTO } from '../lib/userTransferObject';
import { prisma } from '../lib/prisma';
import UserController from '../controllers/UserController';

export async function GET(req: NextRequest) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const decodedToken = verifyToken(token);

    if (!decodedToken || !decodedToken.id || !decodedToken.companyId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const user = await UserController.findById(decodedToken.id);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const response = NextResponse.json({ user: userToDTO(user) });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return response;
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json(
      { error: 'Authentication error' + error },
      { status: 500 }
    );
  }
}
