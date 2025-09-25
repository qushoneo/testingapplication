import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateValidationErrors } from "../lib/generateValidationErrors";
import ForgotPasswordController from "../controllers/ForgotPasswordController";
import UserController from "../controllers/UserController";
import mailController from "../lib/transporter";

const forgotPasswordSchema = z.object({ email: z.string().email() });

/**
 * @swagger
 * /api/forgot_password:
 *   post:
 *     summary: Запросить сброс пароля
 *     description: Отправляет код восстановления пароля на указанный email
 *     tags: [Password Recovery]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email пользователя для восстановления пароля
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Код восстановления отправлен на email
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: ""
 *       400:
 *         description: Ошибка валидации или email не найден
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ValidationError'
 *             examples:
 *               emailNotFound:
 *                 value: [{"field": "email", "message": "Cannot find email"}]
 *               validation:
 *                 value: [{"field": "email", "message": "Invalid email format"}]
 *       500:
 *         description: Внутренняя ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Error <error details>
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const validation = forgotPasswordSchema.safeParse(body);

    if (!validation.success) {
      return generateValidationErrors(validation.error.errors);
    }

    const user = await UserController.findByEmail(validation.data.email);

    if (!user) {
      return NextResponse.json(
        [{ field: "email", message: "Cannot find email" }],
        {
          status: 400,
        }
      );
    }

    const code = await ForgotPasswordController.createCode(user.id);

    mailController.sendMail({
      to: user.email,
      subject: "QA App forgot password!",
      html: `
      <div>
        <p>Code for reset your password</p>
        <b>${code.validCode}</b>
      </div>`,
    });

    return NextResponse.json("");
  } catch (e) {
    return NextResponse.json("Error " + e, { status: 500 });
  }
}
