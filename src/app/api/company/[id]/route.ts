import { NextRequest, NextResponse } from 'next/server';
import CompanyController from '../../controllers/CompanyController';
import InvitationController from '../../controllers/InvitationController';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await params;
    const { id } = await params;

    const company = await CompanyController.findById(Number(id));

    return NextResponse.json(company, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
