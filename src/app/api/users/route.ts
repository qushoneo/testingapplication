import { NextRequest, NextResponse } from 'next/server';
import { getCompanyIdFromToken } from '../lib/getCompanyIdFromToken';
import { prisma } from '../lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;

    if (!token) {
      throw new Error('No token');
    }

    const { companyId } = await getCompanyIdFromToken(token);

    if (!companyId) {
      throw new Error('Cannot find company id');
    }

    const users = await prisma.user.findMany({
      where: {
        companyId: companyId,
      },
      omit: {
        password: true,
      },
    });

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
