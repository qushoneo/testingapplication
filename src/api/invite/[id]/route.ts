import InvitationController from '@/app/api/controllers/InvitationController';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

//get invite data

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const invitation = await InvitationController.getById(id);

    if (!invitation) {
      return NextResponse.json('Error', { status: 404 });
    }

    return NextResponse.json(invitation, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      {
        message: 'Failed to get users' + e,
      },
      { status: 500 }
    );
  }
}
