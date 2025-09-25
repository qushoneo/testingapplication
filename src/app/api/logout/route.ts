import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/logout:
 *   post:
 *     summary: Выход из системы
 *     description: Очищает cookie с JWT токеном, завершая сессию пользователя
 *     tags: [Authentication]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Успешный выход из системы
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: logged out
 *         headers:
 *           Set-Cookie:
 *             description: Очищается cookie с токеном
 *             schema:
 *               type: string
 *               example: token=; HttpOnly; expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/
 *       500:
 *         description: Внутренняя ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error-<error details>
 */
export async function POST() {
  try {
    const response = NextResponse.json(
      {
        message: "logged out",
      },
      { status: 200 }
    );

    //@ts-ignore
    response.cookies.set("token", "", {
      httpOnly: true,
      expires: new Date(0),
      path: "/",
    });

    return response;
  } catch (e) {
    return NextResponse.json({ message: "Error-" + e }, { status: 500 });
  }
}
