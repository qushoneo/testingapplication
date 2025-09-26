import { NextRequest, NextResponse } from "next/server";
import { getCompanyIdFromToken } from "../lib/getCompanyIdFromToken";
import UserController from "../controllers/UserController";

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Получить всех пользователей компании
 *     description: Возвращает список всех пользователей, принадлежащих компании авторизованного пользователя
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Список пользователей компании
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Ошибка при получении пользователей
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to get users <error details>
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const token = req?.cookies?.get("token")?.value;

    const companyId = (await getCompanyIdFromToken(token)).companyId;

    const users = await UserController.getAll(companyId!);

    return NextResponse.json(users, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      {
        message: "Failed to get users " + e,
      },
      { status: 500 }
    );
  }
}
