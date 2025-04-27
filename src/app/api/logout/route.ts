import { NextRequest, NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = NextResponse.json(
      {
        message: 'logged out',
      },
      { status: 200 }
    );

    //@ts-ignore
    response.cookies.set('token', '', {
      httpOnly: true,
      sameSite: 'Strict',
      expires: new Date(0),
      path: '/',
    });

    return response;
  } catch (e) {
    return NextResponse.json({ message: 'Error-' + e }, { status: 500 });
  }
}
