import { NextRequest, NextResponse } from 'next/server';
import { getCompanyIdFromToken } from '../../lib/getCompanyIdFromToken';
import UserController from '../../controllers/UserController';
import { generateValidationErrors } from '../../lib/generateValidationErrors';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import mailController from '../../lib/transporter';
import InvitationController from '../../controllers/InvitationController';
import CompanyController from '../../controllers/CompanyController';
const inviteUserSchema = z.object({
  email: z.string().email(),
});

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;

    const { companyId } = await getCompanyIdFromToken(token);

    const company = await CompanyController.findById(companyId);

    const body = await req.json();

    const validation = inviteUserSchema.safeParse(body);

    if (!validation.success) {
      return generateValidationErrors(validation.error.errors);
    }

    const { email } = validation.data;

    const invitation = await InvitationController.create(email, companyId);

    mailController
      .sendMail({
        to: email,
        subject: 'Invitation to join QA Application',
        text: `Click here to join QA Application: ${process.env.PUBLIC_APP_URL}/invite/${invitation.id}`,
      })
      .catch((e) => console.log(e));

    return NextResponse.json({ message: 'User invited' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
