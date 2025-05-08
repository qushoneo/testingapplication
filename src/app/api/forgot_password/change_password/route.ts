import { NextRequest, NextResponse } from 'next/server';
import UserController from '../../controllers/UserController';
import ForgotPasswordController from '../../controllers/ForgotPasswordController';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { newPassword, email } = await req.json();

    const user = await UserController.changePassword(email, newPassword);

    if (!user) {
      return NextResponse.json(
        { field: 'email', message: 'Failed to find user' },
        { status: 400 }
      );
    }

    await ForgotPasswordController.delete(user.id);

    return NextResponse.json('Successful password changed', { status: 200 });
  } catch (e) {
    return NextResponse.json(
      {
        message: 'Failed to get users ' + e,
      },
      { status: 500 }
    );
  }
}
