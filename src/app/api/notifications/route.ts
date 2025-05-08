import { NextRequest, NextResponse } from 'next/server';
import NotificationController from '../controllers/NotificationController';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const body = await req.json();

    const notificationIds = body.ids as string[];

    const notifications = await NotificationController.makeRead(
      notificationIds
    );

    return NextResponse.json(notifications, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { error: 'Failed to get project' + e },
      { status: 500 }
    );
  }
}
