import { NextResponse } from 'next/server';
import { Role, User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userToDTO } from '../lib/userTransferObject';
import { z } from 'zod';
import { generateValidationErrors } from '../lib/generateValidationErrors';
import UserController from '../controllers/UserController';
import CompanyController from '../controllers/CompanyController';
import mailController from '../lib/transporter';

// Sign up Endpoints

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
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = userSchema.safeParse(body);

    if (!validation.success) {
      return generateValidationErrors(validation.error.errors);
    }

    const { name, email, password, jobTitle, role } = validation.data;

    const existingUser = await UserController.findByEmail(email);

    if (existingUser) {
      return NextResponse.json(
        [{ field: 'email', message: 'Email already in use' }],
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const company = await CompanyController.create(
      `${name.split(' ')[0].replace(',', ' ')} company`
    );

    const user = await UserController.create({
      name,
      email,
      password: hashedPassword,
      jobTitle,
      companyId: company.id,
      role: role || Role.ADMIN,
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
      path: '/',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    await mailController.sendMail({
      to: email,
      subject: 'Register finished',
      text: "You're successfully register account!",
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' + error },
      { status: 500 }
    );
  }
}
