import SocketServices from '../../services/socketServices';
import { endpoints } from '../../lib/clientEndpoints';
import { NextRequest, NextResponse } from 'next/server';
import NotificationController from '../../controllers/NotificationController';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: number }> }
) {
  try {
    const { userId } = await params;

    const userNotifications = await NotificationController.getByUserId(userId);

    SocketServices.sendToSocket(
      userNotifications,
      endpoints.ADD_NOTIFICATION_USER
    );

    return NextResponse.json(userNotifications, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { message: 'Failed to get notifications ' + e },
      { status: 400 }
    );
  }
}
