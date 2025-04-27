import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userToDTO } from '../lib/userTransferObject';
import { z } from 'zod';
import { generateValidationErrors } from '../lib/generateValidationErrors';
import UserController from '../controllers/UserController';

const loginSchema = z.object({
  email: z.string().email('Invalid email format').min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return generateValidationErrors(validation.error.errors);
    }

    const { email, password } = validation.data;

    const user = await UserController.findByEmail(email);

    if (!user) {
      return NextResponse.json(
        [{ field: 'email', message: 'Cannot find email' }],
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        [{ field: 'password', message: 'Invalid password' }],
        { status: 401 }
      );
    }

    console.log(user.id);

    const token = jwt.sign(
      { id: user.id, companyId: user.companyId },
      process.env.JWT_SECRET || 'jwt-secret-key-2025',
      {
        expiresIn: '30d',
      }
    );

    const response = NextResponse.json(
      { user: userToDTO(user), token },
      { status: 200 }
    );

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
