import { NextRequest, NextResponse } from "next/server";
import NotificationController from "../controllers/NotificationController";

/**
 * @swagger
 * /api/notifications:
 *   post:
 *     summary: Отметить уведомления как прочитанные
 *     description: Отмечает указанные уведомления как прочитанные по их ID
 *     tags: [Notifications]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ids
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Массив ID уведомлений для отметки как прочитанные
 *                 example: ["clh1a2b3c4d5e6f7g8h9i0j1", "clk2b3c4d5e6f7g8h9i0j1k2"]
 *     responses:
 *       200:
 *         description: Уведомления успешно отмечены как прочитанные
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notification'
 *       500:
 *         description: Ошибка при обновлении уведомлений
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to get project<error details>
 */
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
      { error: "Failed to get project" + e },
      { status: 500 }
    );
  }
}
