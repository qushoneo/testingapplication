import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateValidationErrors } from '../../lib/generateValidationErrors';
import ForgotPasswordController from '../../controllers/ForgotPasswordController';
import UserController from '../../controllers/UserController';

const codeSchema = z.object({
  code: z.string().min(6).max(6),
  email: z.string().email(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const validation = codeSchema.safeParse(body);

    if (!validation.success) {
      return generateValidationErrors(validation.error.errors);
    }

    const user = await UserController.findByEmail(validation.data.email);

    if (!user) {
      return NextResponse.json([{ message: 'Invalid code', field: 'code' }], {
        status: 400,
      });
    }

    const code = await ForgotPasswordController.validateCode(
      user.id,
      validation.data.code
    );

    if (!code) {
      return NextResponse.json([{ message: 'Invalid code', field: 'code' }], {
        status: 400,
      });
    }

    return NextResponse.json('Code is valid', { status: 200 });
  } catch (e) {
    return NextResponse.json('Error', { status: 500 });
  }
}
