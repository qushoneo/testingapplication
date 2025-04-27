import { NextResponse } from 'next/server';
import InvitationController from '@/app/api/controllers/InvitationController';
import { NextRequest } from 'next/server';

//get invite data

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const invitation = await InvitationController.getById(id);

    return NextResponse.json(invitation, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      {
        message: 'Failed to get users',
      },
      { status: 500 }
    );
  }
}
