import { NextRequest, NextResponse } from 'next/server';
import { getCompanyIdFromToken } from '../lib/getCompanyIdFromToken';
import UserController from '../controllers/UserController';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const token = req?.cookies?.get('token')?.value;

    const companyId = (await getCompanyIdFromToken(token)).companyId;

    const users = await UserController.getAll(companyId!);

    return NextResponse.json(users, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      {
        message: 'Failed to get users ' + e,
      },
      { status: 500 }
    );
  }
}
