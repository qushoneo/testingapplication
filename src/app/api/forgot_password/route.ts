import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateValidationErrors } from '../lib/generateValidationErrors';
import ForgotPasswordController from '../controllers/ForgotPasswordController';
import UserController from '../controllers/UserController';
import mailController from '../lib/transporter';

const forgotPasswordSchema = z.object({ email: z.string().email() });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const validation = forgotPasswordSchema.safeParse(body);

    if (!validation.success) {
      return generateValidationErrors(validation.error.errors);
    }

    const user = await UserController.findByEmail(validation.data.email);

    if (!user) {
      NextResponse.json([{ field: 'email', message: 'Cannot find email' }]);
    }

    const code = await ForgotPasswordController.createCode(user.id);

    mailController.sendMail({
      to: user.email,
      subject: 'QA App forgot password!',
      html: `
      <div>
        <p>Code for reset your password</p>
        <b>${code.validCode}</b>
      </div>`,
    });

    return NextResponse.json('');
  } catch (e) {
    return NextResponse.json('Error', { status: 500 });
  }
}
