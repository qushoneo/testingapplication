import mailController from '@/app/api/lib/transporter';
import { userToDTO } from '@/app/api/lib/userTransferObject';
import { Role, User } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { generateValidationErrors } from '@/app/api/lib/generateValidationErrors';
import { z } from 'zod';
import UserController from '@/app/api/controllers/UserController';
import CompanyController from '@/app/api/controllers/CompanyController';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format').min(1, 'Email is required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /(?=.*\d)(?=.*[!@#$%^&*(),.?\":{}|<>])/,
      'Password must contain at least 1 number and 1 special character'
    ),
  jobTitle: z.string().min(1, 'Job title is required'),
  role: z.nativeEnum(Role).optional(),
  companyId: z.number({ message: 'Invailid company ID' }),
});

// finish invited register

export async function POST(req: NextRequest) {
  const body = await req.json();
  const validation = userSchema.safeParse(body);

  if (!validation.success) {
    return generateValidationErrors(validation.error.errors);
  }

  const { name, email, password, jobTitle, role, companyId } = validation.data;

  const existingUser = await UserController.findByEmail(email);

  if (existingUser) {
    return NextResponse.json(
      [{ field: 'email', message: 'Email already in use' }],
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await UserController.create({
    name,
    email,
    password: hashedPassword,
    jobTitle,
    companyId: companyId,
    role: role || Role.USER,
  } as User);

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

  await mailController
    .sendMail({
      to: email,
      subject: 'Register finished',
      text: "You're successfully register account!",
    })
    .catch((e) => console.log(e));

  return response;
}
