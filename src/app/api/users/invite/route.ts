import { NextRequest, NextResponse } from 'next/server';
import { getCompanyIdFromToken } from '@/app/api/lib/getCompanyIdFromToken';
import { generateValidationErrors } from '@/app/api/lib/generateValidationErrors';
import { z } from 'zod';
import mailController from '@/app/api/lib/transporter';
import InvitationController from '@/app/api/controllers/InvitationController';
const inviteUserSchema = z.object({
  email: z.string().email(),
});

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;

    const { companyId } = await getCompanyIdFromToken(token);

    const body = await req.json();

    const validation = inviteUserSchema.safeParse(body);

    if (!validation.success) {
      return generateValidationErrors(validation.error.errors);
    }

    const { email } = validation.data;

    const invitation = await InvitationController.create(email, companyId!);

    mailController.sendMail({
      to: email,
      subject: 'Invitation to join QA Application',
      text: `Click here to join QA Application: ${process.env.PUBLIC_APP_URL}/invite/${invitation.id}`,
    });

    return NextResponse.json({ message: 'User invited' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
